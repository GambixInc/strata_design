// src/Home.tsx

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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

interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

const Home: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('home');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  const location = useLocation();
  const navigate = useNavigate();

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
    // Simple mock authentication
    setTimeout(() => {
      setCurrentUser({
        name: 'Olivia Rhye',
        role: 'Admin'
      });
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Update active page based on current URL
    const path = location.pathname;
    if (path === '/project') {
      setActivePage('project');
    } else {
      setActivePage('home');
    }
  }, [location.pathname]);

  const handleNavigation = (navItem: NavItem) => {
    console.log('Navigating to:', navItem.id);
    setActivePage(navItem.id);
    if (navItem.path !== location.pathname) {
      navigate(navItem.path);
    }
  };

  const handleBackToHome = () => {
    console.log('Going back to home');
    setActivePage('home');
    navigate('/');
  };

  const handleViewRecommendation = (title: string) => {
    console.log(`Viewing recommendations for: ${title}`);
  };

  const handleViewResults = (website: any) => {
    console.log('Viewing results for:', website.url);
    setActivePage('project');
    navigate('/project');
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

  // If user is not logged in, show the marketing page
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-slate-100 text-slate-800">
        <nav className="sticky top-0 z-20 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-slate-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 font-semibold text-slate-900">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white">S</span>
              <span>Strata</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">Home</Link>
              <Link to="/login" className="inline-flex items-center rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500">Login</Link>
            </div>
          </div>
        </nav>

        {/* Guest user marketing page content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Welcome to Strata
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Your comprehensive SEO and website optimization platform
            </p>
            <Link to="/login" className="inline-flex items-center rounded-md bg-violet-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-violet-500">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Project page component
  const ProjectPage = () => {
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
      />

      {/* Main Content */}
      <main className="main-content">
        {activePage === 'project' ? (
          <ProjectPage />
        ) : (
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
        )}
      </main>
    </div>
  );
};

export default Home;
