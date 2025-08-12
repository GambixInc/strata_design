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

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch real project data from the backend
        const response = await ApiService.getProjectResults(id);
        
        if (response.success && response.data) {
          const { project: projectData, pages, recommendations, health } = response.data;
          
          // Transform the backend data to match our frontend interface
          const transformedProject: ProjectData = {
            id: projectData.project_id || id,
            name: projectData.name || `Project ${id}`,
            url: projectData.domain || 'Unknown URL',
            status: projectData.status || 'Active',
            healthScore: health?.overall_score || 0,
            lastUpdated: projectData.updated_at || new Date().toISOString(),
            pages: pages.map((page: any) => ({
              id: page.page_id || page.id,
              url: page.page_url || page.url,
              title: page.title || 'Untitled Page',
              status: page.status || 'success',
              loadTime: page.load_time || 0,
              size: `${Math.round((page.word_count || 0) / 100)}KB`, // Rough estimate
              lastScraped: page.last_crawled || new Date().toISOString(),
              issues: page.issues || [],
              recommendations: page.recommendations || []
            })),
            recommendations: recommendations.map((rec: any) => rec.description || rec.title || 'Recommendation'),
            alerts: [] // Backend doesn't have alerts yet, so empty array
          };
          
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
