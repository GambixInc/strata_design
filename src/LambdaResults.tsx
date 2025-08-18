import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './LambdaResults.css';

const LambdaResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const scrapedData = location.state?.scrapedData;

  const handleGoBack = () => {
    navigate('/home');
  };

  const handleCreateProject = () => {
    // Store the scraped data in localStorage for the home page to use
    const projects = JSON.parse(localStorage.getItem('localProjects') || '[]');
    const newProject = {
      id: Date.now().toString(),
      websiteUrl: scrapedData.url,
      category: 'General',
      description: scrapedData.description || '',
      title: scrapedData.title || scrapedData.url,
      healthScore: Math.floor(Math.random() * 30) + 70,
      lastChecked: new Date().toISOString(),
      status: 'active',
      createdAt: new Date().toISOString(),
      scrapedData: scrapedData
    };
    
    projects.unshift(newProject);
    localStorage.setItem('localProjects', JSON.stringify(projects));
    
    navigate('/home');
  };

  if (!scrapedData) {
    return (
      <div className="lambda-results-container">
        <div className="error-message">
          <h2>No Data Available</h2>
          <p>No scraped data found. Please try scraping a website again.</p>
          <button onClick={handleGoBack} className="btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="lambda-results-container">
      <div className="results-header">
        <h1>Website Analysis Results</h1>
        <p>Analysis completed for: <strong>{scrapedData.url}</strong></p>
      </div>

      <div className="results-content">
        <div className="results-section">
          <h2>Basic Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Website Title:</label>
              <span>{scrapedData.title || 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>Description:</label>
              <span>{scrapedData.description || 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>Keywords:</label>
              <span>{scrapedData.keywords || 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>Content Length:</label>
              <span>{scrapedData.content_length?.toLocaleString()} characters</span>
            </div>
            <div className="info-item">
              <label>Links Found:</label>
              <span>{scrapedData.links_count} links</span>
            </div>
            <div className="info-item">
              <label>Status Code:</label>
              <span className={`status-${scrapedData.status_code}`}>
                {scrapedData.status_code}
              </span>
            </div>
          </div>
        </div>

        <div className="results-section">
          <h2>Scraper Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Scraped At:</label>
              <span>{new Date(scrapedData.scraped_at * 1000).toLocaleString()}</span>
            </div>
            <div className="info-item">
              <label>Scraper Version:</label>
              <span>{scrapedData.scraper_version}</span>
            </div>
            <div className="info-item">
              <label>Content Type:</label>
              <span>{scrapedData.content_type}</span>
            </div>
          </div>
        </div>

        {scrapedData.scraper_features && (
          <div className="results-section">
            <h2>Scraper Features Used</h2>
            <div className="features-list">
              {scrapedData.scraper_features.map((feature: string, index: number) => (
                <span key={index} className="feature-tag">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}

        {scrapedData.links && scrapedData.links.length > 0 && (
          <div className="results-section">
            <h2>Links Found ({scrapedData.links.length})</h2>
            <div className="links-container">
              {scrapedData.links.slice(0, 10).map((link: string, index: number) => (
                <a 
                  key={index} 
                  href={link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="link-item"
                >
                  {link}
                </a>
              ))}
              {scrapedData.links.length > 10 && (
                <p className="more-links">
                  ... and {scrapedData.links.length - 10} more links
                </p>
              )}
            </div>
          </div>
        )}

        <div className="results-section">
          <h2>Content Preview</h2>
          <div className="content-preview">
            <p>{scrapedData.content?.substring(0, 500)}...</p>
          </div>
        </div>
      </div>

      <div className="results-actions">
        <button onClick={handleGoBack} className="btn-secondary">
          Go Back
        </button>
        <button onClick={handleCreateProject} className="btn-primary">
          Create Project
        </button>
      </div>
    </div>
  );
};

export default LambdaResults;
