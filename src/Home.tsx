import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import CreateProjectModal from './components/CreateProjectModal';
import './App.css';
import './Home.css';

interface ProjectData {
  websiteUrl: string;
  category: string;
  description: string;
}

interface ScrapedResults {
  url: string;
  title: string;
  seo_metadata: {
    meta_tags: Record<string, string>;
    word_count: number;
    headings: Record<string, string[]>;
    images: Array<{ src: string; alt: string }>;
    internal_links: string[];
    external_links: string[];
    social_links: string[];
  };
  saved_directory: string;
  timestamp: string;
}

interface UserStats {
  total_projects: number;
  total_pages: number;
  success_rate: number;
}

interface RecentProject {
  url: string;
  category: string;
  timestamp: string;
  status: 'completed' | 'processing' | 'failed';
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scrapedResults, setScrapedResults] = useState<ScrapedResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({ total_projects: 0, total_pages: 0, success_rate: 0 });
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const userEmail = 'olivia@strata.com'; // This should come from authentication context

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setDataLoading(true);
    try {
      // Fetch user's scraped sites and stats
      const response = await fetch(`http://localhost:8080/api/user-sites?email=${encodeURIComponent(userEmail)}`);
      if (response.ok) {
        const userData = await response.json();
        
        // Calculate stats from user data
        const projects = userData.sites || [];
        const totalProjects = projects.length;
        const totalPages = projects.reduce((sum: number, project: any) => sum + (project.pages_scraped || 1), 0);
        const successfulProjects = projects.filter((project: any) => project.status !== 'failed').length;
        const successRate = totalProjects > 0 ? Math.round((successfulProjects / totalProjects) * 100) : 0;

        setUserStats({
          total_projects: totalProjects,
          total_pages: totalPages,
          success_rate: successRate
        });

        // Set recent projects (last 3)
        const recentProjectsData = projects
          .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 3)
          .map((project: any) => ({
            url: project.url,
            category: project.category || 'Website',
            timestamp: project.timestamp,
            status: project.status || 'completed'
          }));

        setRecentProjects(recentProjectsData);
      } else {
        console.warn('Failed to fetch user data, using defaults');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const handleCreateProject = async (projectData: ProjectData) => {
    setIsLoading(true);
    setError(null);
    setScrapedResults(null);
    
    try {
      // Make API call to backend scraping service
      const response = await fetch('http://localhost:8080/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: projectData.websiteUrl,
          user_email: userEmail,
          category: projectData.category,
          description: projectData.description
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to scrape website');
      }

      const result = await response.json();
      
      if (result.success) {
        // Display results on the same page
        setScrapedResults({
          url: projectData.websiteUrl,
          title: result.data.title || 'No title found',
          seo_metadata: result.data.seo_metadata || {},
          saved_directory: result.data.saved_directory || '',
          timestamp: new Date().toISOString()
        });

        // Refresh user data to show updated stats
        await fetchUserData();
      } else {
        throw new Error(result.error || 'Failed to scrape website');
      }
    } catch (error) {
      console.error('Error scraping website:', error);
      setError(error instanceof Error ? error.message : 'Failed to scrape website');
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setScrapedResults(null);
    setError(null);
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed': return 'status-badge completed';
      case 'processing': return 'status-badge processing';
      case 'failed': return 'status-badge failed';
      default: return 'status-badge completed';
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar
        userName="Olivia Rhye"
        userEmail={userEmail}
        userAvatar="https://randomuser.me/api/portraits/women/44.jpg"
        onLogout={handleLogout}
      />

      <main className="dashboard-main-content">
        <div className="home-content">
          <div className="home-header">
            <h1>Welcome back, Olivia</h1>
            <p>Get started by creating a new project to analyze your website.</p>
          </div>

          {/* Show error if any */}
          {error && (
            <div className="error-message">
              <div className="error-content">
                <i className="fas fa-exclamation-triangle"></i>
                <span>{error}</span>
                <button onClick={clearResults} className="error-close">
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          )}

          {/* Show scraped results if available */}
          {scrapedResults && (
            <div className="results-section">
              <div className="results-header">
                <div className="results-breadcrumb">
                  <button onClick={clearResults} className="breadcrumb-home">
                    <i className="fas fa-home"></i> Dashboard
                  </button>
                  <i className="fas fa-chevron-right breadcrumb-separator"></i>
                  <span className="breadcrumb-current">SEO Analysis Results</span>
                </div>
                <button onClick={clearResults} className="clear-results-btn">
                  <i className="fas fa-times"></i> Clear Results
                </button>
              </div>
              
              <div className="results-grid">
                <div className="result-card">
                  <h3>Website Overview</h3>
                  <div className="result-item">
                    <span className="label">URL:</span>
                    <span className="value">{scrapedResults.url}</span>
                  </div>
                  <div className="result-item">
                    <span className="label">Title:</span>
                    <span className="value">{scrapedResults.title}</span>
                  </div>
                  <div className="result-item">
                    <span className="label">Word Count:</span>
                    <span className="value">{scrapedResults.seo_metadata.word_count || 0}</span>
                  </div>
                </div>

                <div className="result-card">
                  <h3>Meta Tags</h3>
                  {scrapedResults.seo_metadata.meta_tags && Object.keys(scrapedResults.seo_metadata.meta_tags).length > 0 ? (
                    Object.entries(scrapedResults.seo_metadata.meta_tags).slice(0, 5).map(([key, value]) => (
                      <div key={key} className="result-item">
                        <span className="label">{key}:</span>
                        <span className="value">{value}</span>
                      </div>
                    ))
                  ) : (
                    <p className="no-data">No meta tags found</p>
                  )}
                </div>

                <div className="result-card">
                  <h3>Headings Structure</h3>
                  {scrapedResults.seo_metadata.headings && Object.keys(scrapedResults.seo_metadata.headings).length > 0 ? (
                    Object.entries(scrapedResults.seo_metadata.headings).map(([level, headings]) => (
                      <div key={level} className="result-item">
                        <span className="label">{level.toUpperCase()}:</span>
                        <span className="value">{headings.length} headings</span>
                      </div>
                    ))
                  ) : (
                    <p className="no-data">No headings found</p>
                  )}
                </div>

                <div className="result-card">
                  <h3>Images & Links</h3>
                  <div className="result-item">
                    <span className="label">Images:</span>
                    <span className="value">{scrapedResults.seo_metadata.images?.length || 0}</span>
                  </div>
                  <div className="result-item">
                    <span className="label">Internal Links:</span>
                    <span className="value">{scrapedResults.seo_metadata.internal_links?.length || 0}</span>
                  </div>
                  <div className="result-item">
                    <span className="label">External Links:</span>
                    <span className="value">{scrapedResults.seo_metadata.external_links?.length || 0}</span>
                  </div>
                  <div className="result-item">
                    <span className="label">Social Links:</span>
                    <span className="value">{scrapedResults.seo_metadata.social_links?.length || 0}</span>
                  </div>
                </div>
              </div>

              <div className="results-actions">
                <button onClick={() => setIsModalOpen(true)} className="analyze-another-btn">
                  <i className="fas fa-plus"></i> Analyze Another Website
                </button>
                <button onClick={clearResults} className="back-to-dashboard-btn">
                  <i className="fas fa-home"></i> Back to Dashboard
                </button>
              </div>
            </div>
          )}

          {/* Show initial content if no results */}
          {!scrapedResults && !error && (
            <>
              <div className="home-actions">
                <div className="create-project-card">
                  <h3>Create New Project</h3>
                  <p>Start by entering your website URL to analyze and optimize your site's performance.</p>
                  <button 
                    className="create-project-btn"
                    onClick={() => setIsModalOpen(true)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-folder-plus"></i>
                        New Project
                      </>
                    )}
                  </button>
                </div>

                <div className="quick-stats">
                  {dataLoading ? (
                    <div className="stats-loading">
                      <i className="fas fa-spinner fa-spin"></i>
                      <span>Loading stats...</span>
                    </div>
                  ) : (
                    <>
                      <div className="stat-item">
                        <div className="stat-number">{userStats.total_projects}</div>
                        <div className="stat-label">Projects Created</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-number">{userStats.total_pages}</div>
                        <div className="stat-label">Pages Analyzed</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-number">{userStats.success_rate}%</div>
                        <div className="stat-label">Success Rate</div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="recent-projects">
                <h2>Recent Projects</h2>
                {dataLoading ? (
                  <div className="projects-loading">
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Loading projects...</span>
                  </div>
                ) : recentProjects.length > 0 ? (
                  <div className="projects-list">
                    {recentProjects.map((project, index) => (
                      <div key={index} className="project-item">
                        <div className="project-info">
                          <h4>{project.url}</h4>
                          <p>{project.category} • {formatTimeAgo(project.timestamp)}</p>
                        </div>
                        <div className="project-status">
                          <span className={getStatusBadgeClass(project.status)}>
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-projects">
                    <p>No projects yet. Create your first project to get started!</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleCreateProject}
      />
    </div>
  );
};

export default Home; 