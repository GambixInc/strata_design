import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { useAuth } from './hooks/useAuth';

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
