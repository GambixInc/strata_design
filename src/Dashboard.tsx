import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AnalysisData {
  title?: string;
  original_url?: string;
  word_count?: number;
  top_keywords?: Record<string, number>;
  page_speed_indicators?: any;
  seo_metadata?: any;
  [key: string]: any; // Allow for additional properties
}

interface AnalyticsData {
  detailed_analytics?: any;
  analytics?: any[];
  [key: string]: any; // Allow for additional properties
}

const Dashboard: React.FC = () => {
  const [sites, setSites] = useState<string[]>([]);
  const [selectedSite, setSelectedSite] = useState<string>('');
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loadingSites, setLoadingSites] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugMode, setDebugMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoadingSites(true);
    fetch('/api/sites')
      .then(res => res.json())
      .then(data => {
        const sitesList = data.sites || [];
        setSites(sitesList);
        // Auto-select first site if available
        if (sitesList.length > 0 && !selectedSite) {
          setSelectedSite(sitesList[0]);
        }
        setLoadingSites(false);
      })
      .catch((e) => {
        setError('Failed to load sites');
        setLoadingSites(false);
      });
  }, [selectedSite]);

  useEffect(() => {
    if (!selectedSite) return;
    setLoadingData(true);
    setError(null);
    Promise.all([
      fetch(`/api/report/${encodeURIComponent(selectedSite)}/analysis`).then(res => res.json()),
      fetch(`/api/report/${encodeURIComponent(selectedSite)}/analytics`).then(res => res.json()),
    ])
      .then(([analysisData, analyticsData]) => {
        console.log('Analysis data received:', analysisData);
        console.log('Analytics data received:', analyticsData);
        setAnalysis(analysisData);
        setAnalytics(analyticsData);
        setLoadingData(false);
      })
      .catch((e) => {
        console.error('Error loading report data:', e);
        setError('Failed to load report data');
        setLoadingData(false);
      });
  }, [selectedSite]);

  const renderValue = (value: any): string => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  };

  const renderKeywords = (keywords: any): React.ReactNode => {
    if (!keywords || typeof keywords !== 'object') return <div>No keywords available</div>;
    
    const keywordEntries = Object.entries(keywords);
    if (keywordEntries.length === 0) return <div>No keywords found</div>;
    
    return (
      <ul>
        {keywordEntries.slice(0, 10).map(([kw, count]) => (
          <li key={kw}>{kw}: {String(count)}</li>
        ))}
      </ul>
    );
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1>SEO & Analytics Dashboard</h1>
        <button 
          onClick={() => setDebugMode(!debugMode)}
          style={{ 
            padding: '8px 16px', 
            fontSize: '12px', 
            background: '#6c757d', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {debugMode ? 'Hide' : 'Show'} Debug Info
        </button>
      </div>
      
      {loadingSites ? (
        <div>Loading sites...</div>
      ) : sites.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          background: '#f8f9fa',
          borderRadius: '12px',
          margin: '40px 0'
        }}>
          <h2 style={{ color: '#666', marginBottom: '16px' }}>No Websites Scraped Yet</h2>
          <p style={{ color: '#666', marginBottom: '32px', fontSize: '16px' }}>
            Get started by scraping your first website to see detailed SEO analysis and performance metrics.
          </p>
          <button 
            onClick={() => navigate('/scraper')}
            style={{
              background: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)',
              color: 'white',
              border: 'none',
              padding: '16px 32px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 107, 107, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.3)';
            }}
          >
            🕷️ Start Scraping
          </button>
        </div>
      ) : (
        <div style={{ marginBottom: 24 }}>
          <label htmlFor="siteSelect"><strong>Select Scraped Site:</strong></label>
          <select
            id="siteSelect"
            value={selectedSite}
            onChange={e => setSelectedSite(e.target.value)}
            style={{ marginLeft: 12, padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="">-- Choose a site --</option>
            {sites.map(site => (
              <option key={site} value={site}>{site}</option>
            ))}
          </select>
        </div>
      )}
      
      {error && <div style={{ color: 'red', marginBottom: 16, padding: '12px', background: '#fee', borderRadius: '8px' }}>{error}</div>}
      {loadingData && selectedSite && <div style={{ padding: '20px', textAlign: 'center' }}>Loading data for {selectedSite}...</div>}
      
      {debugMode && selectedSite && (analysis || analytics) && (
        <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 8, marginBottom: 24 }}>
          <h3>Debug Information</h3>
          <div style={{ marginBottom: 16 }}>
            <strong>Raw Analysis Data:</strong>
            <pre style={{ background: 'white', padding: 10, borderRadius: 4, fontSize: '12px', overflow: 'auto', maxHeight: '200px' }}>
              {JSON.stringify(analysis, null, 2)}
            </pre>
          </div>
          <div>
            <strong>Raw Analytics Data:</strong>
            <pre style={{ background: 'white', padding: 10, borderRadius: 4, fontSize: '12px', overflow: 'auto', maxHeight: '200px' }}>
              {JSON.stringify(analytics, null, 2)}
            </pre>
          </div>
        </div>
      )}
      
      {selectedSite && !loadingData && (analysis || analytics) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ background: '#f8f9fa', borderRadius: 12, padding: 24 }}>
            <h2>SEO Overview</h2>
            <div style={{ marginBottom: 12 }}><strong>Title:</strong> {renderValue(analysis?.title)}</div>
            <div style={{ marginBottom: 12 }}><strong>URL:</strong> {analysis?.original_url ? (
              <a href={analysis.original_url} target="_blank" rel="noopener noreferrer">{analysis.original_url}</a>
            ) : renderValue(analysis?.original_url)}</div>
            <div style={{ marginBottom: 12 }}><strong>Word Count:</strong> {renderValue(analysis?.word_count)}</div>
            <div><strong>Top Keywords:</strong>
              {renderKeywords(analysis?.top_keywords)}
            </div>
          </div>
          
          <div style={{ background: '#f8f9fa', borderRadius: 12, padding: 24 }}>
            <h2>Performance Metrics</h2>
            {analysis?.page_speed_indicators ? (
              <ul>
                {Object.entries(analysis.page_speed_indicators).map(([k, v]) => (
                  <li key={k} style={{ marginBottom: 8 }}>
                    <strong>{k.replace(/_/g, ' ')}:</strong> {renderValue(v)}
                  </li>
                ))}
              </ul>
            ) : (
              <div>No performance data available.</div>
            )}
          </div>
          
          <div style={{ background: '#f8f9fa', borderRadius: 12, padding: 24, gridColumn: 'span 2' }}>
            <h2>Analytics Tracking</h2>
            {analytics?.detailed_analytics ? (
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: '14px', background: 'white', padding: 16, borderRadius: 8 }}>
                {JSON.stringify(analytics.detailed_analytics, null, 2)}
              </pre>
            ) : analytics?.analytics && analytics.analytics.length > 0 ? (
              <div>
                <strong>Analytics found:</strong>
                <ul>
                  {analytics.analytics.map((item, index) => (
                    <li key={index}>{renderValue(item)}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div>No analytics data available.</div>
            )}
          </div>
        </div>
      )}
      
      {selectedSite && !loadingData && !analysis && !analytics && (
        <div style={{ textAlign: 'center', padding: '40px', background: '#fff3cd', borderRadius: '8px', color: '#856404' }}>
          <h3>No Data Available</h3>
          <p>No analysis or analytics data found for this site. The scraping may have failed or the data format may be different than expected.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 