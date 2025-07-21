import React, { useState } from 'react';
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

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scrapedResults, setScrapedResults] = useState<ScrapedResults | null>(null);
  const [error, setError] = useState<string | null>(null);

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
          user_email: 'olivia@strata.com', // This should come from user authentication
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

  return (
    <div className="dashboard-container">
      <Sidebar
        userName="Olivia Rhye"
        userEmail="olivia@strata.com"
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
                <h2>SEO Analysis Results</h2>
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
                  <div className="stat-item">
                    <div className="stat-number">12</div>
                    <div className="stat-label">Projects Created</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">847</div>
                    <div className="stat-label">Pages Analyzed</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">98%</div>
                    <div className="stat-label">Success Rate</div>
                  </div>
                </div>
              </div>

              <div className="recent-projects">
                <h2>Recent Projects</h2>
                <div className="projects-list">
                  <div className="project-item">
                    <div className="project-info">
                      <h4>healthtech.com</h4>
                      <p>Health Tech • Created 2 days ago</p>
                    </div>
                    <div className="project-status">
                      <span className="status-badge completed">Completed</span>
                    </div>
                  </div>
                  <div className="project-item">
                    <div className="project-info">
                      <h4>ecommerce-store.com</h4>
                      <p>E-commerce • Created 5 days ago</p>
                    </div>
                    <div className="project-status">
                      <span className="status-badge completed">Completed</span>
                    </div>
                  </div>
                  <div className="project-item">
                    <div className="project-info">
                      <h4>saas-platform.io</h4>
                      <p>SaaS • Created 1 week ago</p>
                    </div>
                    <div className="project-status">
                      <span className="status-badge completed">Completed</span>
                    </div>
                  </div>
                </div>
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