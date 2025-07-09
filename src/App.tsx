import React, { useState, useRef } from 'react';
import './App.css';

const API_BASE = '/api';

const userProfiles = [
  { value: 'general', label: 'General User' },
  { value: 'foodie_event_planner', label: 'Foodie Event Planner' },
  { value: 'tech_enthusiast', label: 'Tech Enthusiast' },
  { value: 'business_owner', label: 'Business Owner' },
  { value: 'student', label: 'Student' },
];

type ScrapeResult = any; // You can define a more specific type if desired

type FilesData = {
  scraped_files: { name: string }[];
  optimized_files: { name: string }[];
};

type TrackerStats = {
  total_sites: number;
  total_scrapes: number;
  total_optimizations: number;
  recent_activities: any[];
};

type TrackedSites = Record<string, any>;

function App() {
  // UI State
  const [activeTab, setActiveTab] = useState<'results' | 'files' | 'tracker' | 'dashboard'>('results');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: 'info' | 'success' | 'error' } | null>(null);

  // Scrape/Optimize State
  const [url, setUrl] = useState('');
  const [userProfile, setUserProfile] = useState(userProfiles[0].value);
  const [scrapeResult, setScrapeResult] = useState<ScrapeResult | null>(null);

  // Files State
  const [filesData, setFilesData] = useState<FilesData | null>(null);

  // Tracker State
  const [trackerStats, setTrackerStats] = useState<TrackerStats | null>(null);
  const [trackerSummary, setTrackerSummary] = useState<string | null>(null);
  const [trackedSites, setTrackedSites] = useState<TrackedSites | null>(null);

  // Refs for tab content
  const trackerStatsRef = useRef<HTMLDivElement>(null);
  const trackerSummaryRef = useRef<HTMLDivElement>(null);
  const trackedSitesRef = useRef<HTMLDivElement>(null);

  // Tab switching
  const handleTab = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setAlert(null);
    // Optionally auto-load data for tabs
    if (tab === 'files') loadFiles();
  };

  // Alerts
  const showAlert = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setAlert({ message, type });
  };

  // Scrape Website
  const scrapeWebsite = async () => {
    if (!url.trim()) {
      showAlert('Please enter a valid URL', 'error');
      return;
    }
    setLoading(true);
    setAlert(null);
    try {
      const response = await fetch(`${API_BASE}/scrape`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const result = await response.json();
      if (result.success) {
        setScrapeResult(result.data);
        showAlert(`✅ Successfully scraped! Files saved to: ${result.data.saved_directory}`, 'success');
      } else {
        showAlert(`❌ Error: ${result.error}`, 'error');
      }
    } catch (error: any) {
      showAlert(`❌ Network error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Optimize Website
  const optimizeWebsite = async () => {
    if (!url.trim()) {
      showAlert('Please enter a valid URL', 'error');
      return;
    }
    setLoading(true);
    setAlert(null);
    try {
      const response = await fetch(`${API_BASE}/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, user_profile: userProfile }),
      });
      const result = await response.json();
      if (result.success) {
        showAlert(`✅ Successfully optimized for ${userProfile}! Files saved to: ${result.data.optimized_directory}`, 'success');
        handleTab('files');
        loadFiles();
      } else {
        showAlert(`❌ Error: ${result.error}`, 'error');
      }
    } catch (error: any) {
      showAlert(`❌ Network error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Load Files
  const loadFiles = async () => {
    setFilesData(null);
    try {
      const response = await fetch(`${API_BASE}/files`);
      const result = await response.json();
      if (result.success) {
        setFilesData(result.data);
      } else {
        setFilesData(null);
        showAlert(`❌ Error: ${result.error}`, 'error');
      }
    } catch (error: any) {
      setFilesData(null);
      showAlert(`❌ Network error: ${error.message}`, 'error');
    }
  };

  // Tracker Functions
  const loadTrackerStats = async () => {
    setTrackerStats(null);
    try {
      const response = await fetch(`${API_BASE}/tracker/stats`);
      const result = await response.json();
      if (result.success) {
        setTrackerStats(result.data);
        if (trackerStatsRef.current) trackerStatsRef.current.style.display = 'grid';
        if (trackerSummaryRef.current) trackerSummaryRef.current.style.display = 'none';
        if (trackedSitesRef.current) trackedSitesRef.current.style.display = 'none';
      } else {
        showAlert(`❌ Error: ${result.error}`, 'error');
      }
    } catch (error: any) {
      showAlert(`❌ Network error: ${error.message}`, 'error');
    }
  };

  const loadTrackerSummary = async () => {
    setTrackerSummary(null);
    try {
      const response = await fetch(`${API_BASE}/tracker/summary`);
      const result = await response.json();
      if (result.success) {
        setTrackerSummary(result.data.summary);
        if (trackerStatsRef.current) trackerStatsRef.current.style.display = 'none';
        if (trackerSummaryRef.current) trackerSummaryRef.current.style.display = 'block';
        if (trackedSitesRef.current) trackedSitesRef.current.style.display = 'none';
      } else {
        showAlert(`❌ Error: ${result.error}`, 'error');
      }
    } catch (error: any) {
      showAlert(`❌ Network error: ${error.message}`, 'error');
    }
  };

  const loadTrackedSites = async () => {
    setTrackedSites(null);
    try {
      const response = await fetch(`${API_BASE}/tracker/sites`);
      const result = await response.json();
      if (result.success) {
        setTrackedSites(result.data);
        if (trackerStatsRef.current) trackerStatsRef.current.style.display = 'none';
        if (trackerSummaryRef.current) trackerSummaryRef.current.style.display = 'none';
        if (trackedSitesRef.current) trackedSitesRef.current.style.display = 'block';
      } else {
        showAlert(`❌ Error: ${result.error}`, 'error');
      }
    } catch (error: any) {
      showAlert(`❌ Network error: ${error.message}`, 'error');
    }
  };

  // Render
  return (
    <div className="container">
      <div className="header">
        <h1>🌐 Web Scraper & Optimizer</h1>
        <p>Extract, analyze, and optimize web content with AI-powered insights</p>
        <div className="nav-buttons" style={{ marginTop: 20 }}>
          <button className="btn btn-secondary" onClick={() => window.open('/dashboard', '_blank')}>
            📊 View SEO & Analytics Dashboard
          </button>
        </div>
      </div>

      <div className="input-section">
        <div className="input-group">
          <input
            type="url"
            placeholder="Enter website URL (e.g., https://example.com)"
            value={url}
            onChange={e => setUrl(e.target.value)}
            required
          />
          <select value={userProfile} onChange={e => setUserProfile(e.target.value)}>
            {userProfiles.map(profile => (
              <option key={profile.value} value={profile.value}>{profile.label}</option>
            ))}
          </select>
          <button className="btn" onClick={scrapeWebsite} disabled={loading}>🔍 Scrape Website</button>
          <button className="btn btn-success" onClick={optimizeWebsite} disabled={loading}>🚀 Optimize</button>
        </div>
        {loading && (
          <div className="loading" style={{ display: 'block' }}>
            <div className="spinner"></div>
            <p>Processing your request...</p>
          </div>
        )}
      </div>

      <div className="tabs">
        <button className={`tab${activeTab === 'results' ? ' active' : ''}`} onClick={() => handleTab('results')}>📄 Results</button>
        <button className={`tab${activeTab === 'files' ? ' active' : ''}`} onClick={() => handleTab('files')}>📁 Files</button>
        <button className={`tab${activeTab === 'tracker' ? ' active' : ''}`} onClick={() => handleTab('tracker')}>📊 Tracker</button>
        <button className={`tab${activeTab === 'dashboard' ? ' active' : ''}`} onClick={() => handleTab('dashboard')}>📈 SEO Dashboard</button>
      </div>

      <div className="tab-content">
        {/* Results Tab */}
        <div id="results" className={`tab-pane${activeTab === 'results' ? ' active' : ''}`}>
          <div id="resultsContent">
            {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}
            {scrapeResult && (
              <div>
                <div className="alert alert-success">
                  ✅ Successfully scraped: {scrapeResult.title}
                </div>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-number">{scrapeResult.links?.length ?? 0}</div>
                    <div className="stat-label">Links Found</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">{scrapeResult.css_content?.inline_styles?.length ?? 0}</div>
                    <div className="stat-label">Inline Styles</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">{scrapeResult.css_content?.internal_stylesheets?.length ?? 0}</div>
                    <div className="stat-label">Internal Stylesheets</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">{scrapeResult.js_content?.inline_scripts?.length ?? 0}</div>
                    <div className="stat-label">Inline Scripts</div>
                  </div>
                </div>
                <div className="result-section">
                  <h3>🔗 Links Found ({scrapeResult.links?.length ?? 0})</h3>
                  <div className="code-block">
                    {(scrapeResult.links || []).slice(0, 20).join('\n')}
                    {(scrapeResult.links?.length ?? 0) > 20 && `\n... and ${(scrapeResult.links.length - 20)} more`}
                  </div>
                </div>
                <div className="result-section">
                  <h3>🎨 CSS Content</h3>
                  <div className="code-block">
                    Inline Styles: {scrapeResult.css_content?.inline_styles?.length ?? 0}
                    {'\n'}Internal Stylesheets: {scrapeResult.css_content?.internal_stylesheets?.length ?? 0}
                    {'\n'}External Stylesheets: {scrapeResult.css_content?.external_stylesheets?.length ?? 0}
                    {'\n'}\nExternal Stylesheet URLs:{'\n'}
                    {(scrapeResult.css_content?.external_stylesheets || []).join('\n')}
                  </div>
                </div>
                <div className="result-section">
                  <h3>⚡ JavaScript Content</h3>
                  <div className="code-block">
                    Inline Scripts: {scrapeResult.js_content?.inline_scripts?.length ?? 0}
                    {'\n'}External Scripts: {scrapeResult.js_content?.external_scripts?.length ?? 0}
                    {'\n'}\nExternal Script URLs:{'\n'}
                    {(scrapeResult.js_content?.external_scripts || []).join('\n')}
                  </div>
                </div>
                <div className="result-section">
                  <h3>📄 HTML Preview (First 1000 characters)</h3>
                  <div className="code-block">
                    {scrapeResult.html_content?.substring(0, 1000)}...
                  </div>
                </div>
              </div>
            )}
            {!scrapeResult && !alert && (
              <div className="alert alert-info">
                Enter a URL and click "Scrape Website" to get started. The results will appear here.
              </div>
            )}
          </div>
        </div>

        {/* Files Tab */}
        <div id="files" className={`tab-pane${activeTab === 'files' ? ' active' : ''}`}>
          <div className="result-section">
            <h3>📁 Saved Files</h3>
            <div className="input-group">
              <button className="btn btn-secondary" onClick={loadFiles}>🔄 Refresh Files</button>
            </div>
            <div id="filesContent">
              {filesData ? (
                <div className="result-section">
                  <h3>📄 Scraped Sites</h3>
                  {filesData.scraped_files.length > 0 ? (
                    <div className="file-list">
                      {filesData.scraped_files.map(file => (
                        <div className="file-item" key={file.name}>
                          <span className="file-name">{file.name}</span>
                          <span className="file-type">scraped</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="alert alert-info">No scraped files found.</div>
                  )}
                  <h3>🚀 Optimized Sites</h3>
                  {filesData.optimized_files.length > 0 ? (
                    <div className="file-list">
                      {filesData.optimized_files.map(file => (
                        <div className="file-item" key={file.name}>
                          <span className="file-name">{file.name}</span>
                          <span className="file-type">optimized</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="alert alert-info">No optimized files found.</div>
                  )}
                </div>
              ) : (
                <div className="alert alert-info">Click "Refresh Files" to see all saved scraped and optimized files.</div>
              )}
            </div>
          </div>
        </div>

        {/* Tracker Tab */}
        <div id="tracker" className={`tab-pane${activeTab === 'tracker' ? ' active' : ''}`}>
          <div className="result-section">
            <h3>📊 Site Tracker</h3>
            <div className="input-group">
              <button className="btn btn-secondary" onClick={loadTrackerStats}>📈 Load Stats</button>
              <button className="btn btn-secondary" onClick={loadTrackerSummary}>📋 Load Summary</button>
              <button className="btn btn-secondary" onClick={loadTrackedSites}>🔗 Load Sites</button>
            </div>
            <div id="trackerStats" className="stats-grid" ref={trackerStatsRef} style={{ display: 'none' }}>
              {trackerStats && (
                <>
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
                </>
              )}
            </div>
            <div id="trackerSummary" className="tracker-summary" ref={trackerSummaryRef} style={{ display: 'none' }}>
              {trackerSummary}
            </div>
            <div id="trackedSites" className="sites-list" ref={trackedSitesRef} style={{ display: 'none' }}>
              {trackedSites && Object.keys(trackedSites).length === 0 && (
                <div className="alert alert-info">No sites tracked yet.</div>
              )}
              {trackedSites && Object.values(trackedSites).map((site: any) => (
                <div className="site-card" key={site.domain}>
                  <div className="site-domain">🔗 {site.domain}</div>
                  <div className="site-stats">
                    <span>📄 Scrapes: {site.scrapes.length}</span>
                    <span>🚀 Optimizations: {site.optimizations.length}</span>
                    <span>📅 First: {new Date(site.first_scraped).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
            <div id="trackerContent">
              {!trackerStats && !trackerSummary && !trackedSites && (
                <div className="alert alert-info">
                  Click the buttons above to view tracking statistics, summary, or all tracked sites.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
