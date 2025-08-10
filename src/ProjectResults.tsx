import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { useAuth } from './hooks/useAuth';
import ApiService from './services/api';
import './ProjectResults.css';

interface ScrapedPage {
  id: string;
  url: string;
  title: string;
  status: 'success' | 'error' | 'pending';
  loadTime: number;
  size: string;
  lastScraped: string;
  issues: string[];
  recommendations: string[];
}

interface ProjectData {
  id: string;
  name: string;
  url: string;
  status: string;
  healthScore: number;
  pages: ScrapedPage[];
  recommendations: string[];
  alerts: string[];
  lastUpdated: string;
}

const ProjectResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'pages' | 'recommendations' | 'alerts'>('overview');

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        // For now, we'll use demo data since the backend doesn't have this endpoint yet
        // TODO: Replace with actual API call when backend endpoint is ready
        // const projectData = await ApiService.getProjectResults(id);
        
        // Demo data for now
        const demoProject: ProjectData = {
          id: id,
          name: `Project ${id}`,
          url: 'https://example.com',
          status: 'Active',
          healthScore: 78,
          lastUpdated: new Date().toISOString(),
          pages: [
            {
              id: '1',
              url: 'https://example.com',
              title: 'Homepage',
              status: 'success',
              loadTime: 1.2,
              size: '245KB',
              lastScraped: new Date().toISOString(),
              issues: ['Missing alt text on 3 images', 'Slow loading time'],
              recommendations: ['Optimize images', 'Enable compression']
            },
            {
              id: '2',
              url: 'https://example.com/about',
              title: 'About Us',
              status: 'success',
              loadTime: 0.8,
              size: '156KB',
              lastScraped: new Date().toISOString(),
              issues: ['Missing meta description'],
              recommendations: ['Add meta description', 'Improve heading structure']
            }
          ],
          recommendations: [
            'Optimize image sizes for faster loading',
            'Add missing alt text to images',
            'Implement browser caching',
            'Minimize CSS and JavaScript files',
            'Use a CDN for static assets'
          ],
          alerts: [
            'Site health score dropped by 5%',
            '3 pages have accessibility issues',
            'Mobile responsiveness needs improvement'
          ]
        };
        
        setProject(demoProject);
      } catch (err) {
        setError('Failed to load project data');
        console.error('Error fetching project data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  const handleNavigation = (navItem: any) => {
    navigate(navItem.path);
  };

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="project-results-container">
        <Sidebar
          sidebarOpen={sidebarOpen}
          activePage="project"
          onNavigation={handleNavigation}
          onToggleSidebar={handleToggleSidebar}
          userName={user?.name || 'User'}
          onLogout={logout}
        />
        <div className="main-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading project results...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="project-results-container">
        <Sidebar
          sidebarOpen={sidebarOpen}
          activePage="project"
          onNavigation={handleNavigation}
          onToggleSidebar={handleToggleSidebar}
          userName={user?.name || 'User'}
          onLogout={logout}
        />
        <div className="main-content">
          <div className="error-container">
            <i className="fas fa-exclamation-triangle"></i>
            <h2>Error Loading Project</h2>
            <p>{error || 'Project not found'}</p>
            <button onClick={() => navigate('/dashboard')} className="btn-primary">
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="project-results-container">
      <Sidebar
        sidebarOpen={sidebarOpen}
        activePage="project"
        onNavigation={handleNavigation}
        onToggleSidebar={handleToggleSidebar}
        userName={user?.name || 'User'}
        onLogout={logout}
      />
      
      <div className="main-content">
        {/* Header */}
        <div className="project-header">
          <div className="project-info">
            <button className="back-btn" onClick={() => navigate('/dashboard')}>
              <i className="fas fa-arrow-left"></i>
              Back to Dashboard
            </button>
            <h1>{project.name}</h1>
            <p className="project-url">{project.url}</p>
          </div>
          <div className="project-stats">
            <div className="stat-item">
              <span className="stat-label">Health Score</span>
              <span className={`stat-value ${project.healthScore < 70 ? 'warning' : ''}`}>
                {project.healthScore}%
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Pages Scraped</span>
              <span className="stat-value">{project.pages.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Last Updated</span>
              <span className="stat-value">{formatDate(project.lastUpdated)}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="project-tabs">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="fas fa-chart-line"></i>
            Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'pages' ? 'active' : ''}`}
            onClick={() => setActiveTab('pages')}
          >
            <i className="fas fa-file-alt"></i>
            Pages ({project.pages.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'recommendations' ? 'active' : ''}`}
            onClick={() => setActiveTab('recommendations')}
          >
            <i className="fas fa-lightbulb"></i>
            Recommendations ({project.recommendations.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'alerts' ? 'active' : ''}`}
            onClick={() => setActiveTab('alerts')}
          >
            <i className="fas fa-exclamation-triangle"></i>
            Alerts ({project.alerts.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="overview-grid">
                <div className="overview-card">
                  <h3>Site Health Overview</h3>
                  <div className="health-score-display">
                    <div className="health-circle">
                      <span className="health-number">{project.healthScore}%</span>
                    </div>
                    <p className="health-status">
                      {project.healthScore >= 90 ? 'Excellent' : 
                       project.healthScore >= 70 ? 'Good' : 
                       project.healthScore >= 50 ? 'Fair' : 'Poor'}
                    </p>
                  </div>
                </div>
                
                <div className="overview-card">
                  <h3>Quick Stats</h3>
                  <div className="stats-list">
                    <div className="stat-row">
                      <span>Total Pages:</span>
                      <span>{project.pages.length}</span>
                    </div>
                    <div className="stat-row">
                      <span>Issues Found:</span>
                      <span>{project.pages.reduce((acc, page) => acc + page.issues.length, 0)}</span>
                    </div>
                    <div className="stat-row">
                      <span>Avg Load Time:</span>
                      <span>{(project.pages.reduce((acc, page) => acc + page.loadTime, 0) / project.pages.length).toFixed(1)}s</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pages' && (
            <div className="pages-tab">
              <div className="pages-list">
                {project.pages.map((page) => (
                  <div key={page.id} className="page-card">
                    <div className="page-header">
                      <div className="page-info">
                        <h4>{page.title}</h4>
                        <p className="page-url">{page.url}</p>
                      </div>
                      <div className="page-status">
                        <span className={`status-badge ${page.status}`}>
                          {page.status}
                        </span>
                      </div>
                    </div>
                    <div className="page-details">
                      <div className="page-stats">
                        <span>Load Time: {page.loadTime}s</span>
                        <span>Size: {page.size}</span>
                        <span>Last Scraped: {formatDate(page.lastScraped)}</span>
                      </div>
                      {page.issues.length > 0 && (
                        <div className="page-issues">
                          <h5>Issues Found:</h5>
                          <ul>
                            {page.issues.map((issue, index) => (
                              <li key={index}>{issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="recommendations-tab">
              <div className="recommendations-list">
                {project.recommendations.map((recommendation, index) => (
                  <div key={index} className="recommendation-card">
                    <div className="recommendation-icon">
                      <i className="fas fa-lightbulb"></i>
                    </div>
                    <div className="recommendation-content">
                      <p>{recommendation}</p>
                    </div>
                    <button className="recommendation-action">
                      <i className="fas fa-check"></i>
                      Mark as Done
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="alerts-tab">
              <div className="alerts-list">
                {project.alerts.map((alert, index) => (
                  <div key={index} className="alert-card">
                    <div className="alert-icon">
                      <i className="fas fa-exclamation-triangle"></i>
                    </div>
                    <div className="alert-content">
                      <p>{alert}</p>
                    </div>
                    <button className="alert-action">
                      <i className="fas fa-times"></i>
                      Dismiss
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectResults;
