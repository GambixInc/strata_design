import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ApiService } from './services/api';
import './LambdaResults.css';

const LambdaResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const rawData = location.state?.scrapedData;
  
  // Handle the array structure - lambda returns an array with one object
  const scrapedData = Array.isArray(rawData) ? rawData[0] : rawData;
  
  // Debug logging
  console.log('LambdaResults - location.state:', location.state);
  console.log('LambdaResults - rawData:', rawData);
  console.log('LambdaResults - scrapedData:', scrapedData);

  const handleGoBack = () => {
    navigate('/home');
  };

  const handleCreateProject = async () => {
    try {
      console.log('Creating project with scraped data:', scrapedData);
      
      const projectData = {
        websiteUrl: scrapedData.url,
        category: 'General',
        description: scrapedData.description || '',
        scrapedData: scrapedData,
        userId: 'default_user' // You can replace this with actual user ID from auth
      };
      
      const response = await ApiService.createProject(projectData);
      
      if (response.success) {
        console.log('Project created successfully:', response.data);
        // Navigate back to home page
        navigate('/home');
      } else {
        throw new Error('Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error creating project. Please try again.');
    }
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
          {/* Basic Information */}
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

          {/* HTTP/Curl Information */}
          {scrapedData.curl_info && (
            <div className="results-section">
              <h2>HTTP Analysis</h2>
              <div className="info-grid">
                <div className="info-item">
                  <label>Final URL:</label>
                  <span>{scrapedData.curl_info.url_final}</span>
                </div>
                <div className="info-item">
                  <label>Response Time:</label>
                  <span>{scrapedData.curl_info.response_time_ms?.toFixed(2)}ms</span>
                </div>
                <div className="info-item">
                  <label>Server:</label>
                  <span>{scrapedData.curl_info.server || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <label>Encoding:</label>
                  <span>{scrapedData.curl_info.encoding || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <label>Redirected:</label>
                  <span className={scrapedData.curl_info.redirected ? 'status-success' : 'status-neutral'}>
                    {scrapedData.curl_info.redirected ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="info-item">
                  <label>Redirect Count:</label>
                  <span>{scrapedData.curl_info.redirect_count || 0}</span>
                </div>
                <div className="info-item">
                  <label>Compressed:</label>
                  <span className={scrapedData.curl_info.is_compressed ? 'status-success' : 'status-neutral'}>
                    {scrapedData.curl_info.is_compressed ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="info-item">
                  <label>Chunked Transfer:</label>
                  <span className={scrapedData.curl_info.is_chunked ? 'status-success' : 'status-neutral'}>
                    {scrapedData.curl_info.is_chunked ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Security Headers */}
          {scrapedData.curl_info?.security_headers && (
            <div className="results-section">
              <h2>Security Headers</h2>
              <div className="security-headers">
                {Object.entries(scrapedData.curl_info.security_headers).map(([header, value]) => (
                  <div key={header} className="security-header-item">
                    <label>{header.replace(/_/g, ' ').toUpperCase()}:</label>
                    <span className={value ? 'status-success' : 'status-warning'}>
                      {String(value) || 'Not Set'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Framework Detection */}
          {scrapedData.framework_detection && (
            <div className="results-section">
              <h2>Framework Detection</h2>
              <div className="framework-grid">
                {Object.entries(scrapedData.framework_detection).map(([framework, detected]) => (
                  <div key={framework} className="framework-item">
                    <span className={`framework-badge ${detected ? 'detected' : 'not-detected'}`}>
                      {framework.charAt(0).toUpperCase() + framework.slice(1)}
                    </span>
                    <span className={detected ? 'status-success' : 'status-neutral'}>
                      {detected ? 'Detected' : 'Not Found'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content Analysis */}
          {scrapedData.content_analysis && (
            <div className="results-section">
              <h2>Content Structure Analysis</h2>
              <div className="content-analysis-grid">
                <div className="analysis-column">
                  <h3>Headings</h3>
                  <div className="headings-list">
                    {Object.entries(scrapedData.content_analysis.headings || {}).map(([level, count]) => (
                      <div key={level} className="heading-item">
                        <span className="heading-level">{level.toUpperCase()}</span>
                        <span className="heading-count">{String(count)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="analysis-column">
                  <h3>Elements</h3>
                  <div className="elements-list">
                    <div className="element-item">
                      <span>Paragraphs</span>
                      <span>{scrapedData.content_analysis.paragraphs || 0}</span>
                    </div>
                    <div className="element-item">
                      <span>Images</span>
                      <span>{scrapedData.content_analysis.images_count || 0}</span>
                    </div>
                    <div className="element-item">
                      <span>Forms</span>
                      <span>{scrapedData.content_analysis.forms_count || 0}</span>
                    </div>
                    <div className="element-item">
                      <span>Scripts</span>
                      <span>{scrapedData.content_analysis.scripts_count || 0}</span>
                    </div>
                    <div className="element-item">
                      <span>Stylesheets</span>
                      <span>{scrapedData.content_analysis.stylesheets_count || 0}</span>
                    </div>
                  </div>
                </div>
                <div className="analysis-column">
                  <h3>Lists & Tables</h3>
                  <div className="lists-tables-list">
                    <div className="list-item">
                      <span>Unordered Lists</span>
                      <span>{scrapedData.content_analysis.lists?.ul || 0}</span>
                    </div>
                    <div className="list-item">
                      <span>Ordered Lists</span>
                      <span>{scrapedData.content_analysis.lists?.ol || 0}</span>
                    </div>
                    <div className="list-item">
                      <span>Tables</span>
                      <span>{scrapedData.content_analysis.tables || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Text Statistics */}
          {(scrapedData.word_count || scrapedData.character_count) && (
            <div className="results-section">
              <h2>Text Statistics</h2>
              <div className="stats-grid">
                <div className="stat-item">
                  <label>Word Count:</label>
                  <span>{scrapedData.word_count?.toLocaleString() || 0}</span>
                </div>
                <div className="stat-item">
                  <label>Character Count:</label>
                  <span>{scrapedData.character_count?.toLocaleString() || 0}</span>
                </div>
              </div>
            </div>
          )}

          {/* Meta Tags */}
          {scrapedData.meta_tags && Object.keys(scrapedData.meta_tags).length > 0 && (
            <div className="results-section">
              <h2>Meta Tags</h2>
              <div className="meta-tags-grid">
                {Object.entries(scrapedData.meta_tags).map(([name, content]) => (
                  <div key={name} className="meta-tag-item">
                    <label>{name}:</label>
                    <span>{String(content)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Images */}
          {scrapedData.images && scrapedData.images.length > 0 && (
            <div className="results-section">
              <h2>Images ({scrapedData.images.length})</h2>
              <div className="images-container">
                {scrapedData.images.slice(0, 5).map((image: any, index: number) => (
                  <div key={index} className="image-item">
                    <img src={image.src} alt={image.alt || 'Image'} onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }} />
                    <div className="image-info">
                      <span className="image-src">{image.src}</span>
                      {image.alt && <span className="image-alt">{image.alt}</span>}
                    </div>
                  </div>
                ))}
                {scrapedData.images.length > 5 && (
                  <p className="more-images">
                    ... and {scrapedData.images.length - 5} more images
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Scripts and Stylesheets */}
          {(scrapedData.scripts?.length > 0 || scrapedData.stylesheets?.length > 0) && (
            <div className="results-section">
              <h2>Resources</h2>
              <div className="resources-grid">
                {scrapedData.scripts && scrapedData.scripts.length > 0 && (
                  <div className="resource-column">
                    <h3>Scripts ({scrapedData.scripts.length})</h3>
                    <div className="resource-list">
                      {scrapedData.scripts.slice(0, 5).map((script: string, index: number) => (
                        <a key={index} href={script} target="_blank" rel="noopener noreferrer" className="resource-item">
                          {script}
                        </a>
                      ))}
                      {scrapedData.scripts.length > 5 && (
                        <p className="more-resources">... and {scrapedData.scripts.length - 5} more</p>
                      )}
                    </div>
                  </div>
                )}
                {scrapedData.stylesheets && scrapedData.stylesheets.length > 0 && (
                  <div className="resource-column">
                    <h3>Stylesheets ({scrapedData.stylesheets.length})</h3>
                    <div className="resource-list">
                      {scrapedData.stylesheets.slice(0, 5).map((stylesheet: string, index: number) => (
                        <a key={index} href={stylesheet} target="_blank" rel="noopener noreferrer" className="resource-item">
                          {stylesheet}
                        </a>
                      ))}
                      {scrapedData.stylesheets.length > 5 && (
                        <p className="more-resources">... and {scrapedData.stylesheets.length - 5} more</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Scraper Information */}
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

          {/* Scraper Features */}
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

          {/* Links */}
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

          {/* Content Preview */}
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
