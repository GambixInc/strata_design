// src/Home.tsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

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

  // Sample data
  const websites = [
    {
      id: '1',
      url: 'https://www.inthebox.io',
      icon: 'fas fa-globe',
      status: 'Active',
      healthScore: 80,
      recommendations: 17,
      autoOptimize: true,
      lastUpdated: '2 hours ago'
    },
    {
      id: '2',
      url: 'https://www.shop.sneakerspa.ng/',
      icon: 'fas fa-shopping-cart',
      status: 'Active',
      healthScore: 76,
      recommendations: 7,
      autoOptimize: false,
      lastUpdated: '1 day ago'
    },
    {
      id: '3',
      url: 'https://www.meditationoasis.com',
      icon: 'fas fa-leaf',
      status: 'Active',
      healthScore: 96,
      recommendations: 3,
      autoOptimize: true,
      lastUpdated: '3 hours ago'
    },
    {
      id: '4',
      url: 'https://www.art.ai',
      icon: 'fas fa-palette',
      status: 'Needs Attention',
      healthScore: 68,
      recommendations: 74,
      autoOptimize: false,
      lastUpdated: '5 hours ago'
    }
  ];

  const pageStatuses = [
    { type: 'healthy' as const, count: 3, label: 'Healthy Pages' },
    { type: 'broken' as const, count: 1, label: 'Broken Pages' },
    { type: 'issues' as const, count: 5, label: 'Have Issues' }
  ];

  const performanceData = [
    { title: 'Technical SEO', score: 85 },
    { title: 'Content & On-Page SEO', score: 78 },
    { title: 'Performance & Core Web Vitals', score: 75 },
    { title: 'Internal Linking & Site Architecture', score: 92 },
    { title: 'Visual UX & Accessibility', score: 76 },
    { title: 'Authority & Backlinks', score: 78 }
  ];

  useEffect(() => {
    // Check if user is authenticated using the same key as Login component
    const checkAuth = () => {
      const user = localStorage.getItem('currentUser');
      if (user) {
        setCurrentUser(JSON.parse(user));
      }
      setLoading(false);
    };

    checkAuth();
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
    setActivePage('project');
    // Don't navigate - just update state
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
      />

      {/* Main Content */}
      <main className="main-content">
        {activePage === 'project' ? (
          <ProjectPage />
        ) : activePage === 'home' ? (
          <>
            <Header userName={currentUser.name} userRole={currentUser.role} />

            {/* Dashboard Content */}
            <div className="dashboard-content">
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
                <button className="new-project-btn">
                  <i className="fas fa-plus"></i>
                  New Project
                </button>
              </div>

              <AlertBanner
                title="Low Site Health"
                description="art.ai has a site health of only 68%. Please view recommendations now."
                time="2 hours ago"
                priority="High Priority"
                progress={68}
                onViewResults={() => handleViewResults(websites[3])}
                onDismiss={() => console.log('Dismissed alert')}
                onClose={() => console.log('Closed alert')}
              />

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
    </div>
  );
};

export default Home;
