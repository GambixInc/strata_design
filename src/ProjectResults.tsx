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

interface ScrapedData {
  has_scraped_data: boolean;
  title: string;
  original_url: string;
  scraped_at: string;
  seo_report: string;
  word_count: number;
  meta_description: string;
  images_count: number;
  links_count: number;
  h1_tags: string[];
  meta_tags: any;
  stats: any;
}

const ProjectResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [scrapedData, setScrapedData] = useState<ScrapedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch real project data from the backend
        const response = await ApiService.getProjectResults(id);
        
        if (response.success && response.data) {
          const { project: projectData, scrapedData } = response.data;
          
          // Transform the backend data to match our frontend interface
          const transformedProject: ProjectData = {
            id: projectData.project_id || id,
            name: projectData.name || `Project ${id}`,
            url: projectData.domain || 'Unknown URL',
            status: projectData.status || 'Active',
            healthScore: scrapedData.has_scraped_data ? Math.min(100, Math.max(0, 100 - (scrapedData.images_count * 5) - (scrapedData.word_count < 300 ? 20 : 0))) : 0,
            lastUpdated: projectData.last_crawl || projectData.updated_at || new Date().toISOString(),
            pages: scrapedData.has_scraped_data ? [{
              id: 'main-page',
              url: scrapedData.original_url || projectData.domain,
              title: scrapedData.title || 'Untitled Page',
              status: 'success',
              loadTime: 0,
              size: `${Math.round((scrapedData.word_count || 0) / 100)}KB`,
              lastScraped: scrapedData.scraped_at || new Date().toISOString(),
              issues: [],
              recommendations: []
            }] : [],
            recommendations: scrapedData.has_scraped_data ? [] : [], // We'll display SEO report separately
            alerts: []
          };
          
          // Store the full scraped data for display
          setScrapedData(scrapedData);
          
          setProject(transformedProject);
        } else {
          // If no data returned, show a message about no data available
          setError('No project data available. This project may not have been scraped yet.');
        }
      } catch (err: any) {
        console.error('Error fetching project data:', err);
        setError(err.message || 'Failed to load project data');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  const handleDebugFiles = async () => {
    if (!id) return;
    
    try {
      // Note: Debug functionality not supported in current Lambda API
      alert('Debug functionality is not supported in the current unified Lambda API.');
    } catch (error) {
      console.error('Debug error:', error);
      alert('Debug request failed. Check console for details.');
    }
  };

  const handleRescrape = async () => {
    if (!id) return;
    
    if (!confirm('This will re-scrape the website. This may take a few moments. Continue?')) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Get the current project to get the URL
      const projectResponse = await ApiService.getProject(id, 'default_user');
      
      if (!projectResponse.success) {
        throw new Error('Failed to get project details');
      }
      
      const project = projectResponse.data;
      const url = project.url;
      
      // Re-scrape using the unified Lambda API
      const rescrapeResponse = await ApiService.createProject({
        websiteUrl: url,
        userId: 'default_user'
      });
      
      if (rescrapeResponse.success) {
        alert('Project re-scraped successfully! Refreshing page...');
        // Reload the page to show the new data
        window.location.reload();
      } else {
        throw new Error('Failed to re-scrape project');
      }
    } catch (error) {
      console.error('Re-scrape error:', error);
      alert('Re-scrape request failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

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
          activePage="home"
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
          activePage="home"
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
            
            {error && error.includes('No project data available') && (
              <div className="error-help">
                <h4>Possible Solutions:</h4>
                <ul>
                  <li>The project may not have been scraped yet</li>
                  <li>The scraped files may have been moved or deleted</li>
                  <li>There may be a file path issue</li>
                </ul>
                <p>Try clicking the "Debug Files" button below to diagnose the issue.</p>
              </div>
            )}
            
            <div className="error-actions">
              <button onClick={() => navigate('/dashboard')} className="btn-primary">
                Back to Dashboard
              </button>
              {id && (
                <>
                  <button onClick={handleDebugFiles} className="btn-secondary">
                    Debug Files
                  </button>
                  <button onClick={handleRescrape} className="btn-secondary">
                    Re-scrape Project
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="project-results-container">
      <Sidebar
        sidebarOpen={sidebarOpen}
        activePage="home"
        onNavigation={handleNavigation}
        onToggleSidebar={handleToggleSidebar}
        userName={user?.name || 'User'}
        onLogout={logout}
      />
      
      <div className="main-content">
        {/* Simple Header */}
        <div className="simple-header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <i className="fas fa-arrow-left"></i>
            Back to Dashboard
          </button>
          <h1>SEO Scraped Data - {project.name}</h1>
          <p className="project-url">{project.url}</p>
          {id && (
            <button onClick={handleRescrape} className="btn-secondary" style={{ marginLeft: '1rem' }}>
              Re-scrape Project
            </button>
          )}
        </div>

        {/* Simple SEO Data Display */}
        <div className="seo-data-container">
          <div className="seo-summary">
            <h3>Summary</h3>
            <p>Pages Scraped: {project.pages.length}</p>
            <p>Health Score: {project.healthScore}%</p>
            <p>Last Updated: {formatDate(project.lastUpdated)}</p>
          </div>

          <div className="seo-pages">
            <h3>Scraped Pages</h3>
            {project.pages.map((page) => (
              <div key={page.id} className="page-data">
                <h4>{page.title}</h4>
                <p><strong>URL:</strong> {page.url}</p>
                <p><strong>Status:</strong> {page.status}</p>
                <p><strong>Load Time:</strong> {page.loadTime}s</p>
                <p><strong>Size:</strong> {page.size}</p>
                <p><strong>Last Scraped:</strong> {formatDate(page.lastScraped)}</p>
                
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
                
                {page.recommendations.length > 0 && (
                  <div className="page-recommendations">
                    <h5>Recommendations:</h5>
                    <ul>
                      {page.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {scrapedData && scrapedData.has_scraped_data && (
            <div className="seo-report">
              <h3>SEO Analysis Report</h3>
              <div className="seo-report-content">
                <pre>{scrapedData.seo_report}</pre>
              </div>
            </div>
          )}

          <div className="seo-recommendations">
            <h3>Overall Recommendations</h3>
            <ul>
              {project.recommendations.map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          </div>

          <div className="seo-alerts">
            <h3>Alerts</h3>
            <ul>
              {project.alerts.map((alert, index) => (
                <li key={index}>{alert}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectResults;
