// Scraper.tsx - Web scraper and optimizer tool UI
import React, { useState, useEffect } from 'react';
import './Scraper.css';

// Type definitions for data structures
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

const Scraper: React.FC = () => {
  // State for tabs, form fields, and data
  const [activeTab, setActiveTab] = useState<string>('results');
  const [url, setUrl] = useState<string>('');
  const [userProfile, setUserProfile] = useState<string>('general');
  const [loading, setLoading] = useState<boolean>(false);
  const [scrapedData, setScrapedData] = useState<ScrapedData | null>(null);
  const [files, setFiles] = useState<FileData | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Utility: show alert message
  const showAlert = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  // Scrape website handler
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

  // Optimize website handler
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

  // Load files from backend
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

  // Effect: load files when tab changes to 'files'
  useEffect(() => {
    if (activeTab === 'files') {
      loadFiles();
    }
  }, [activeTab]);

  return (
    <div className="scraper-container">
      {/* Header section */}
      <div className="scraper-header">
        <h1>🌐 Web Scraper & Optimizer</h1>
        <p>Extract, analyze, and optimize web content with AI-powered insights</p>
        <div className="nav-buttons">
          <button className="btn btn-secondary" onClick={() => window.open('/dashboard', '_blank')}>
            📊 View SEO & Analytics Dashboard
          </button>
        </div>
      </div>

      {/* Input section for URL and profile */}
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

      {/* Alert message */}
      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.message}
        </div>
      )}

      {/* Tabs for results and files */}
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
          🗂️ Files
        </button>
      </div>

      {/* Content for different tabs */}
      <div className="tab-content">
        {/* Results Tab */}
        {activeTab === 'results' && scrapedData && (
          <div className="result-section">
            <h3>Scraped Data</h3>
            <pre className="code-block">{JSON.stringify(scrapedData, null, 2)}</pre>
          </div>
        )}
        {/* Files Tab */}
        {activeTab === 'files' && files && (
          <div className="file-list">
            <h3>Files</h3>
            {files.scraped_files.map((file: { name: string }, index: number) => (
              <div className="file-item" key={index}>
                <span className="file-name">{file.name}</span>
                <span className="file-type">Scraped</span>
              </div>
            ))}
            {files.optimized_files.map((file: { name: string }, index: number) => (
              <div className="file-item" key={index}>
                <span className="file-name">{file.name}</span>
                <span className="file-type">Optimized</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Scraper; 