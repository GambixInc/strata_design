import React, { useState, useEffect } from 'react';
import './Scraper.css';

alert("Scraper loaded");
interface ScrapedData {
  title: string;
  saved_directory: string;
  links: string[];
  css_content: {
    inline_styles: any[];
    internal_stylesheets: any[];
    external_stylesheets: string[];
  };
  js_content: {
    inline_scripts: any[];
    external_scripts: string[];
  };
  html_content: string;
}

interface FileData {
  scraped_files: Array<{ name: string }>;
  optimized_files: Array<{ name: string }>;
}

interface TrackerStats {
  total_sites: number;
  total_scrapes: number;
  total_optimizations: number;
  recent_activities: any[];
}

interface TrackedSite {
  domain: string;
  scrapes: any[];
  optimizations: any[];
  first_scraped: string;
}

interface TrackerSites {
  [key: string]: TrackedSite;
}

const Scraper: React.FC = () => {
  const [activeTab, setActiveTab] = useState('results');
  const [url, setUrl] = useState('');
  const [userProfile, setUserProfile] = useState('general');
  const [loading, setLoading] = useState(false);
  const [scrapedData, setScrapedData] = useState<ScrapedData | null>(null);
  const [files, setFiles] = useState<FileData | null>(null);
  const [trackerStats, setTrackerStats] = useState<TrackerStats | null>(null);
  const [trackerSummary, setTrackerSummary] = useState<string>('');
  const [trackedSites, setTrackedSites] = useState<TrackerSites | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showAlert = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const scrapeWebsite = async () => {
    if (!url.trim()) {
      showAlert('Please enter a valid URL', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() })
      });

      const result = await response.json();

      if (result.success) {
        setScrapedData(result.data);
        showAlert(`✅ Successfully scraped! Files saved to: ${result.data.saved_directory}`, 'success');
      } else {
        showAlert(`❌ Error: ${result.error}`, 'error');
      }
    } catch (error) {
      showAlert(`❌ Network error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const optimizeWebsite = async () => {
    if (!url.trim()) {
      showAlert('Please enter a valid URL', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          url: url.trim(),
          user_profile: userProfile
        })
      });

      const result = await response.json();

      if (result.success) {
        showAlert(`✅ Successfully optimized for ${userProfile}! Files saved to: ${result.data.optimized_directory}`, 'success');
        setActiveTab('files');
        loadFiles();
      } else {
        showAlert(`❌ Error: ${result.error}`, 'error');
      }
    } catch (error) {
      showAlert(`❌ Network error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadFiles = async () => {
    try {
      const response = await fetch('/api/files');
      const result = await response.json();

      if (result.success) {
        setFiles(result.data);
      } else {
        showAlert(`❌ Error: ${result.error}`, 'error');
      }
    } catch (error) {
      showAlert(`❌ Network error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    }
  };

  const loadTrackerStats = async () => {
    try {
      const response = await fetch('/api/tracker/stats');
      const result = await response.json();

      if (result.success) {
        setTrackerStats(result.data);
      } else {
        showAlert(`❌ Error: ${result.error}`, 'error');
      }
    } catch (error) {
      showAlert(`❌ Network error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    }
  };

  const loadTrackerSummary = async () => {
    try {
      const response = await fetch('/api/tracker/summary');
      const result = await response.json();

      if (result.success) {
        setTrackerSummary(result.data.summary);
      } else {
        showAlert(`❌ Error: ${result.error}`, 'error');
      }
    } catch (error) {
      showAlert(`❌ Network error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    }
  };

  const loadTrackedSites = async () => {
    try {
      const response = await fetch('/api/tracker/sites');
      const result = await response.json();

      if (result.success) {
        setTrackedSites(result.data);
      } else {
        showAlert(`❌ Error: ${result.error}`, 'error');
      }
    } catch (error) {
      showAlert(`❌ Network error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    }
  };

  useEffect(() => {
    if (activeTab === 'files') {
      loadFiles();
    }
  }, [activeTab]);

  return (
    <div className="scraper-container">
      <div className="scraper-header">
        <h1>🌐 Web Scraper & Optimizer</h1>
        <p>Extract, analyze, and optimize web content with AI-powered insights</p>
        <div className="nav-buttons">
          <button className="btn btn-secondary" onClick={() => window.open('/dashboard', '_blank')}>
            📊 View SEO & Analytics Dashboard
          </button>
        </div>
      </div>

      <div className="input-section">
        <div className="input-group">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL (e.g., https://example.com)"
            required
          />
          <select value={userProfile} onChange={(e) => setUserProfile(e.target.value)}>
            <option value="general">General User</option>
            <option value="foodie_event_planner">Foodie Event Planner</option>
            <option value="tech_enthusiast">Tech Enthusiast</option>
            <option value="business_owner">Business Owner</option>
            <option value="student">Student</option>
          </select>
          <button className="btn" onClick={scrapeWebsite} disabled={loading}>
            🔍 Scrape Website
          </button>
          <button className="btn btn-success" onClick={optimizeWebsite} disabled={loading}>
            🚀 Optimize
          </button>
        </div>
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Processing your request...</p>
          </div>
        )}
      </div>

      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.message}
        </div>
      )}

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
        >
          📄 Results
        </button>
        <button 
          className={`tab ${activeTab === 'files' ? 'active' : ''}`}
          onClick={() => setActiveTab('files')}
        >
          📁 Files
        </button>
        <button 
          className={`tab ${activeTab === 'tracker' ? 'active' : ''}`}
          onClick={() => setActiveTab('tracker')}
        >
          📊 Tracker
        </button>
      </div>

      <div className="tab-content">
        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="tab-pane active">
            <div className="results-content">
              {!scrapedData ? (
                <div className="alert alert-info">
                  Enter a URL and click "Scrape Website" to get started. The results will appear here.
                </div>
              ) : (
                <>
                  <div className="alert alert-success">
                    ✅ Successfully scraped: {scrapedData.title}
                  </div>
                  
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-number">{scrapedData.links.length}</div>
                      <div className="stat-label">Links Found</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-number">{scrapedData.css_content.inline_styles.length}</div>
                      <div className="stat-label">Inline Styles</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-number">{scrapedData.css_content.internal_stylesheets.length}</div>
                      <div className="stat-label">Internal Stylesheets</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-number">{scrapedData.js_content.inline_scripts.length}</div>
                      <div className="stat-label">Inline Scripts</div>
                    </div>
                  </div>

                  <div className="result-section">
                    <h3>🔗 Links Found ({scrapedData.links.length})</h3>
                    <div className="code-block">
                      {scrapedData.links.slice(0, 20).join('\n')}
                      {scrapedData.links.length > 20 && `\n... and ${scrapedData.links.length - 20} more`}
                    </div>
                  </div>

                  <div className="result-section">
                    <h3>🎨 CSS Content</h3>
                    <div className="code-block">
                      Inline Styles: {scrapedData.css_content.inline_styles.length}
                      Internal Stylesheets: {scrapedData.css_content.internal_stylesheets.length}
                      External Stylesheets: {scrapedData.css_content.external_stylesheets.length}

                      External Stylesheet URLs:
                      {scrapedData.css_content.external_stylesheets.join('\n')}
                    </div>
                  </div>

                  <div className="result-section">
                    <h3>⚡ JavaScript Content</h3>
                    <div className="code-block">
                      Inline Scripts: {scrapedData.js_content.inline_scripts.length}
                      External Scripts: {scrapedData.js_content.external_scripts.length}

                      External Script URLs:
                      {scrapedData.js_content.external_scripts.join('\n')}
                    </div>
                  </div>

                  <div className="result-section">
                    <h3>📄 HTML Preview (First 1000 characters)</h3>
                    <div className="code-block">
                      {scrapedData.html_content.substring(0, 1000)}...
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Files Tab */}
        {activeTab === 'files' && (
          <div className="tab-pane active">
            <div className="result-section">
              <h3>📁 Saved Files</h3>
              <div className="input-group">
                <button className="btn btn-secondary" onClick={loadFiles}>
                  🔄 Refresh Files
                </button>
              </div>
              <div className="files-content">
                {!files ? (
                  <div className="alert alert-info">
                    Click "Refresh Files" to see all saved scraped and optimized files.
                  </div>
                ) : (
                  <>
                    <h3>📄 Scraped Sites</h3>
                    {files.scraped_files.length > 0 ? (
                      <div className="file-list">
                        {files.scraped_files.map((file, index) => (
                          <div key={index} className="file-item">
                            <span className="file-name">{file.name}</span>
                            <span className="file-type">scraped</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="alert alert-info">No scraped files found.</div>
                    )}
                    
                    <h3>🚀 Optimized Sites</h3>
                    {files.optimized_files.length > 0 ? (
                      <div className="file-list">
                        {files.optimized_files.map((file, index) => (
                          <div key={index} className="file-item">
                            <span className="file-name">{file.name}</span>
                            <span className="file-type">optimized</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="alert alert-info">No optimized files found.</div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tracker Tab */}
        {activeTab === 'tracker' && (
          <div className="tab-pane active">
            <div className="result-section">
              <h3>📊 Site Tracker</h3>
              <div className="input-group">
                <button className="btn btn-secondary" onClick={loadTrackerStats}>
                  📈 Load Stats
                </button>
                <button className="btn btn-secondary" onClick={loadTrackerSummary}>
                  📋 Load Summary
                </button>
                <button className="btn btn-secondary" onClick={loadTrackedSites}>
                  🔗 Load Sites
                </button>
              </div>
              
              {trackerStats && (
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-number">{trackerStats.total_sites}</div>
                    <div className="stat-label">Total Sites</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">{trackerStats.total_scrapes}</div>
                    <div className="stat-label">Total Scrapes</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">{trackerStats.total_optimizations}</div>
                    <div className="stat-label">Total Optimizations</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">{trackerStats.recent_activities.length}</div>
                    <div className="stat-label">Recent Activities</div>
                  </div>
                </div>
              )}
              
              {trackerSummary && (
                <div className="tracker-summary">
                  {trackerSummary}
                </div>
              )}
              
              {trackedSites && (
                <div className="sites-list">
                  {Object.keys(trackedSites).length === 0 ? (
                    <div className="alert alert-info">No sites tracked yet.</div>
                  ) : (
                    Object.values(trackedSites).map((site, index) => (
                      <div key={index} className="site-card">
                        <div className="site-domain">🔗 {site.domain}</div>
                        <div className="site-stats">
                          <span>📄 Scrapes: {site.scrapes.length}</span>
                          <span>🚀 Optimizations: {site.optimizations.length}</span>
                          <span>📅 First: {new Date(site.first_scraped).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
              
              {!trackerStats && !trackerSummary && !trackedSites && (
                <div className="alert alert-info">
                  Click the buttons above to view tracking statistics, summary, or all tracked sites.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scraper; 