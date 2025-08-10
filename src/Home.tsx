// src/Home.tsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import ApiService, { useApiCall, handleApiError } from './services/api';

import { useAuth } from './hooks/useAuth';

// Import components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ProjectHeader from './components/ProjectHeader';
import KPICard from './components/KPICard';
import SiteHealthCircle from './components/SiteHealthCircle';
import CrawledPagesSummary from './components/CrawledPagesSummary';
import PerformanceCard from './components/PerformanceCard';
import AlertBanner from './components/AlertBanner';
import SitesTable from './components/SitesTable';
import Pagination from './components/Pagination';
import RecommendationDetail from './components/RecommendationDetail';
import CreateProjectModal from './components/CreateProjectModal';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

interface Recommendation {
  category: string;
  issue: string;
  recommendation: string;
  guidelines: string[];
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('home');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [currentRecommendation, setCurrentRecommendation] = useState<Recommendation | null>(null);
  const [currentIssueIndex, setCurrentIssueIndex] = useState(1);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [optimizedIssues, setOptimizedIssues] = useState(0);

  // Sample recommendation data
  const recommendations: { [key: string]: Recommendation[] } = {
    'Technical SEO': [
      {
        category: 'Technical SEO',
        issue: 'Page lacks clear and structured HTML headings (H1, H2, H3), making it hard for both users and search engines to understand the page\'s hierarchy.',
        recommendation: 'Add a logical heading structure using semantic HTML to break content into scannable sections.',
        guidelines: [
          'H1 Page title (used once).',
          'H2 Main sections of the page.',
          'H3 Sub-sections or feature details.'
        ]
      },
      {
        category: 'Technical SEO',
        issue: 'Missing meta description tag, which is crucial for search engine snippets and click-through rates.',
        recommendation: 'Add a compelling meta description that accurately describes the page content.',
        guidelines: [
          'Keep it between 150-160 characters.',
          'Include primary keywords naturally.',
          'Make it compelling and action-oriented.'
        ]
      }
    ],
    'Content & On-Page SEO': [
      {
        category: 'Content & On-Page SEO',
        issue: 'Page content is too thin with insufficient depth and comprehensive coverage of the topic.',
        recommendation: 'Expand content to provide comprehensive coverage of the topic with detailed information.',
        guidelines: [
          'Aim for at least 1,500 words of quality content.',
          'Include relevant keywords naturally.',
          'Add supporting images, videos, or infographics.'
        ]
      }
    ],
    'Performance & Core Web Vitals': [
      {
        category: 'Performance & Core Web Vitals',
        issue: 'Images are not optimized, causing slow page load times and poor Core Web Vitals scores.',
        recommendation: 'Optimize all images for web use to improve page load speed.',
        guidelines: [
          'Use WebP format when possible.',
          'Compress images without losing quality.',
          'Implement lazy loading for images below the fold.'
        ]
      }
    ],
    'Internal Linking & Site Architecture': [
      {
        category: 'Internal Linking & Site Architecture',
        issue: 'Page lacks internal links to other relevant pages on the website.',
        recommendation: 'Add relevant internal links to improve site navigation and SEO.',
        guidelines: [
          'Link to related content naturally within the text.',
          'Use descriptive anchor text.',
          'Create a logical content hierarchy.'
        ]
      }
    ],
    'Visual UX & Accessibility': [
      {
        category: 'Visual UX & Accessibility',
        issue: 'Poor color contrast ratios making content difficult to read for users with visual impairments.',
        recommendation: 'Improve color contrast ratios to meet WCAG accessibility guidelines.',
        guidelines: [
          'Ensure text contrast ratio is at least 4.5:1.',
          'Test with color blindness simulators.',
          'Provide alternative text for images.'
        ]
      }
    ],
    'Authority & Backlinks': [
      {
        category: 'Authority & Backlinks',
        issue: 'Page lacks external links to authoritative sources, reducing credibility and SEO value.',
        recommendation: 'Add relevant external links to authoritative sources to build credibility.',
        guidelines: [
          'Link to industry experts and authoritative websites.',
          'Use nofollow for affiliate or sponsored links.',
          'Ensure links add value to your content.'
        ]
      }
    ]
  };

  // State for real data
  const [websites, setWebsites] = useState<any[]>([]);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Demo data for when backend is unavailable
  const demoWebsites = [
    {
      id: 'demo-1',
      url: 'https://example.com',
      icon: 'fas fa-globe',
      status: 'Active',
      healthScore: 85,
      recommendations: 12,
      autoOptimize: true,
      lastUpdated: '2 hours ago'
    },
    {
      id: 'demo-2',
      url: 'https://demo-site.com',
      icon: 'fas fa-shopping-cart',
      status: 'Needs Attention',
      healthScore: 65,
      recommendations: 8,
      autoOptimize: false,
      lastUpdated: '1 day ago'
    }
  ];

  // Default data for when backend data is not available
  const defaultPageStatuses = [
    { type: 'healthy' as const, count: 0, label: 'Healthy Pages' },
    { type: 'broken' as const, count: 0, label: 'Broken Pages' },
    { type: 'issues' as const, count: 0, label: 'Have Issues' }
  ];

  const defaultPerformanceData = [
    { title: 'Technical SEO', score: 0 },
    { title: 'Content & On-Page SEO', score: 0 },
    { title: 'Performance & Core Web Vitals', score: 0 },
    { title: 'Internal Linking & Site Architecture', score: 0 },
    { title: 'Visual UX & Accessibility', score: 0 },
    { title: 'Authority & Backlinks', score: 0 }
  ];

  // Use real data or defaults
  const pageStatuses = dashboardData?.page_statuses || defaultPageStatuses;
  const performanceData = dashboardData?.performance_breakdown || defaultPerformanceData;

  useEffect(() => {
    // Since this component is protected by ProtectedRoute, we can assume user is authenticated
    // Just fetch the data from backend
    const fetchData = async () => {
      try {
        setLoadingData(true);
        setDataError(null);
        
        // Fetch projects and dashboard data in parallel
        const [projectsResponse, dashboardResponse] = await Promise.all([
          ApiService.getProjects(),
          ApiService.getDashboardData()
        ]);
        
        if (projectsResponse.success) {
          setWebsites(projectsResponse.data || []);
        } else {
          // Backend error - will be handled in catch block
          throw new Error('Failed to load projects');
        }
        
        if (dashboardResponse.success) {
          setDashboardData(dashboardResponse.data);
        } else {
          // Backend error - will be handled in catch block
          throw new Error('Failed to load dashboard data');
        }
      } catch (err) {
        const errorMessage = handleApiError(err);
        console.error('Error loading data:', errorMessage);
        
        // Handle different types of errors
        if (errorMessage.includes('Authentication required') || 
            errorMessage.includes('Token expired') ||
            errorMessage.includes('Invalid or expired token')) {
          // Authentication error - let the auth system handle it
          console.error('Authentication error:', errorMessage);
        } else if (errorMessage.includes('500') || 
                   errorMessage.includes('Failed to connect') ||
                   errorMessage.includes('Network error')) {
          // Backend/server error - show dashboard with demo data
          console.warn('Backend error, showing dashboard with fallback data');
          setWebsites(demoWebsites); // Use demo data instead of empty list
          setDashboardData(null); // Will use default data
          setDataError(null); // Don't show error, show dashboard instead
        } else {
          // Other errors (like 404, validation errors, etc.) - show empty state
          console.warn('API error, showing empty state');
          setWebsites([]); // Empty list for user with no projects
          setDashboardData(null); // Will use default data
          setDataError(null); // Don't show error, show empty state instead
        }
      } finally {
        setLoadingData(false);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Remove the URL sync useEffect since we're using state-based navigation

  const handleNavigation = (navItem: NavItem) => {
    console.log('Navigating to:', navItem.id, 'Current activePage:', activePage);
    setActivePage(navItem.id);
    console.log('Active page set to:', navItem.id);
    // Don't use navigate() for internal navigation - just update the state
    // This keeps everything within the same component
  };

  const handleBackToHome = () => {
    console.log('Going back to home');
    setActivePage('home');
    // Don't navigate - just update state
  };

  const handleViewRecommendation = (title: string) => {
    console.log(`Viewing recommendations for: ${title}`);
    const categoryRecommendations = recommendations[title];
    if (categoryRecommendations && categoryRecommendations.length > 0) {
      setCurrentRecommendation(categoryRecommendations[0]);
      setCurrentIssueIndex(1);
      setActivePage('recommendation');
    }
  };

  const handleViewResults = (website: any) => {
    console.log('Viewing results for:', website.url);
    // Navigate to the new ProjectResults page with the website ID
    navigate(`/project/${website.id}`);
  };

  const handleEdit = (website: any) => {
    console.log('Editing:', website.url);
  };

  const handleDelete = (website: any) => {
    console.log('Deleting:', website.url);
  };

  const handleToggleAutoOptimize = (website: any) => {
    console.log('Toggling auto-optimize for:', website.url);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleAcceptRecommendations = () => {
    console.log('Accepting recommendations');
    setOptimizationProgress(100);
    setOptimizedIssues(optimizedIssues + 1);
  };

  const handleViewAndEdit = () => {
    console.log('View and edit recommendations');
  };

  const handleBackFromRecommendation = () => {
    setActivePage('project');
    setCurrentRecommendation(null);
  };

  const handlePreviousIssue = () => {
    if (currentRecommendation && currentIssueIndex > 1) {
      setCurrentIssueIndex(currentIssueIndex - 1);
    }
  };

  const handleNextIssue = () => {
    if (currentRecommendation) {
      const categoryRecommendations = recommendations[currentRecommendation.category];
      if (categoryRecommendations && currentIssueIndex < categoryRecommendations.length) {
        setCurrentIssueIndex(currentIssueIndex + 1);
        setCurrentRecommendation(categoryRecommendations[currentIssueIndex]);
      }
    }
  };

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCreateProject = async (projectData: any) => {
    try {
      const response = await ApiService.createProject(projectData);
      if (response.success) {
        // Refresh the projects list
        const projectsResponse = await ApiService.getProjects();
        if (projectsResponse.success) {
          setWebsites(projectsResponse.data || []);
        }
        setShowCreateModal(false);
      } else {
        throw new Error(response.error || 'Failed to create project');
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setDataError(errorMessage);
      console.error('Error creating project:', errorMessage);
    }
  };

  const handleRetry = () => {
    setDataError(null);
    setRetryCount(0);
    // Trigger a re-render to reload data
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="loading">
        <i className="fas fa-spinner"></i>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <Link to="/login">Go to Login</Link>
      </div>
    );
  }

  // If user is not logged in, redirect to landing page
  if (!currentUser) {
    navigate('/');
    return null;
  }

  // Debug: Log current state
  console.log('Current activePage:', activePage);
  console.log('Current user:', currentUser);

  // Recommendation Detail Page
  if (activePage === 'recommendation' && currentRecommendation) {
    const categoryRecommendations = recommendations[currentRecommendation.category];
    const totalIssues = categoryRecommendations ? categoryRecommendations.length : 1;
    
    return (
      <div className="dashboard-layout">
        <Sidebar 
          sidebarOpen={sidebarOpen}
          activePage="project"
          onNavigation={handleNavigation}
          onToggleSidebar={handleToggleSidebar}
          userName={user?.name || currentUser?.name || 'User'}
          onLogout={logout}
        />
        <div className="main-content">
          <RecommendationDetail
            category={currentRecommendation.category}
            issue={currentRecommendation.issue}
            recommendation={currentRecommendation.recommendation}
            guidelines={currentRecommendation.guidelines}
            onAcceptRecommendations={handleAcceptRecommendations}
            onViewAndEdit={handleViewAndEdit}
            onBack={handleBackFromRecommendation}
            currentIssue={currentIssueIndex}
            totalIssues={totalIssues}
            onPrevious={handlePreviousIssue}
            onNext={handleNextIssue}
            optimizationProgress={optimizationProgress}
            optimizedIssues={optimizedIssues}
          />
        </div>
      </div>
    );
  }

  // Project page component
  const ProjectPage = () => {
    console.log('Rendering ProjectPage component');
    return (
      <div className="project-page">
        <ProjectHeader 
          projectName="inthebox.io"
          userName={currentUser.name}
          onBack={handleBackToHome}
        />

        <div className="project-content">
          {/* KPIs and Site Health */}
          <div className="metrics-section">
            <div className="kpi-cards">
              <KPICard 
                title="Total Impressions"
                value="6,000"
                trend={{ value: "100%", isPositive: true }}
              />
              <KPICard 
                title="Total Engagements"
                value="2,340"
                trend={{ value: "100%", isPositive: true }}
              />
              <KPICard 
                title="Total Conversions"
                value="1,700"
                trend={{ value: "100%", isPositive: true }}
              />
            </div>
            
            <SiteHealthCircle percentage={80} label="Site Health" />
          </div>

          <CrawledPagesSummary pageStatuses={pageStatuses} />

          {/* Performance Breakdown */}
          <div className="performance-section">
            <h2>Performance Breakdown</h2>
            <div className="performance-grid">
              {performanceData.map((item, index) => (
                <PerformanceCard
                  key={index}
                  title={item.title}
                  score={item.score}
                  onViewRecommendation={() => handleViewRecommendation(item.title)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-layout">
      <Sidebar 
        sidebarOpen={sidebarOpen}
        activePage={activePage}
        onNavigation={handleNavigation}
        onToggleSidebar={handleToggleSidebar}
        userName={user?.name || currentUser?.name || 'User'}
        onLogout={logout}
      />

      {/* Main Content */}
      <main className="main-content">
        {activePage === 'project' ? (
          <ProjectPage />
        ) : activePage === 'home' ? (
          <>
            <Header userName={currentUser?.name || 'User'} userRole={currentUser?.role || 'user'} />

            {/* Dashboard Content */}
            <div className="dashboard-content">
              {/* Loading State */}
              {loadingData && (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Loading your projects...</p>
                </div>
              )}

              {/* Error State - Only show for critical errors, not backend data errors */}
              {dataError && !loadingData && (
                <div className="error-container">
                  <div className="error-message">
                    <i className="fas fa-exclamation-triangle"></i>
                    <p>{dataError}</p>
                    <button onClick={handleRetry}>Retry</button>
                  </div>
                </div>
              )}

              {/* Content when data is loaded or when showing fallback data */}
              {!loadingData && (
                <>
                  {/* Backend Status Notification */}
                  {websites.length > 0 && websites.some(site => site.id.startsWith('demo-')) && !dataError && (
                    <div className="backend-status-notification">
                      <i className="fas fa-info-circle"></i>
                      <span>Showing demo data - backend connection unavailable</span>
                    </div>
                  )}

                  {/* Empty State for New Users */}
                  {websites.length === 0 && !loadingData && !dataError && (
                    <div className="empty-state">
                      <div className="empty-state-icon">
                        <i className="fas fa-folder-open"></i>
                      </div>
                      <h3>No projects yet</h3>
                      <p>Get started by creating your first project to monitor and optimize your website.</p>
                      <button 
                        className="create-first-project-btn"
                        onClick={() => setShowCreateModal(true)}
                      >
                        <i className="fas fa-plus"></i>
                        Create Your First Project
                      </button>
                    </div>
                  )}

                  {/* Dashboard Content - Only show when there are projects or demo data */}
                  {websites.length > 0 && (
                    <>
                      {/* Search and New Project Section */}
                      <div className="search-section">
                        <div className="search-container">
                          <i className="fas fa-search search-icon"></i>
                          <input 
                            type="text" 
                            placeholder="Enter URL or Keyword" 
                            className="search-input"
                          />
                        </div>
                        <button 
                          className="new-project-btn"
                          onClick={() => setShowCreateModal(true)}
                        >
                          <i className="fas fa-plus"></i>
                          New Project
                        </button>
                      </div>

                      {/* Show alert only if there are websites with low health scores */}
                      {websites.some(site => site.healthScore < 70) && (
                        <AlertBanner
                          title="Low Site Health"
                          description="Some sites have low health scores. Please review recommendations."
                          time="Recently"
                          priority="High Priority"
                          progress={Math.min(...websites.map(site => site.healthScore))}
                          onViewResults={() => handleViewResults(websites.find(site => site.healthScore < 70))}
                          onDismiss={() => console.log('Dismissed alert')}
                          onClose={() => console.log('Closed alert')}
                        />
                      )}

                      <SitesTable
                        websites={websites}
                        onViewResults={handleViewResults}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleAutoOptimize={handleToggleAutoOptimize}
                      />

                      <Pagination
                        currentPage={currentPage}
                        totalPages={1}
                        totalItems={websites.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                        onItemsPerPageChange={handleItemsPerPageChange}
                      />
                    </>
                  )}
                </>
              )}
            </div>
          </>
        ) : (
          // Fallback for any other page
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Page: {activePage}</h2>
            <p>This page is under construction.</p>
            <button onClick={() => setActivePage('home')}>Go to Home</button>
          </div>
        )}
      </main>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onConfirm={handleCreateProject}
      />
    </div>
  );
};

export default Home;
