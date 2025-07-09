import React, { useEffect, useState } from 'react';

interface AnalysisData {
  title?: string;
  original_url?: string;
  word_count?: number;
  top_keywords?: Record<string, number>;
  page_speed_indicators?: any;
  seo_metadata?: any;
}

interface AnalyticsData {
  detailed_analytics?: any;
  analytics?: any[];
}

const Dashboard: React.FC = () => {
  const [sites, setSites] = useState<string[]>([]);
  const [selectedSite, setSelectedSite] = useState<string>('');
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loadingSites, setLoadingSites] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoadingSites(true);
    fetch('http://localhost:8080/api/sites')
      .then(res => res.json())
      .then(data => {
        setSites(data.sites || []);
        setLoadingSites(false);
      })
      .catch(() => {
        setError('Failed to load sites');
        setLoadingSites(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedSite) return;
    setLoadingData(true);
    setError(null);
    Promise.all([
      fetch(`http://localhost:8080/api/report/${encodeURIComponent(selectedSite)}/analysis`).then(res => res.json()),
      fetch(`http://localhost:8080/api/report/${encodeURIComponent(selectedSite)}/analytics`).then(res => res.json()),
    ])
      .then(([analysisData, analyticsData]) => {
        setAnalysis(analysisData);
        setAnalytics(analyticsData);
        setLoadingData(false);
      })
      .catch(() => {
        setError('Failed to load report data');
        setLoadingData(false);
      });
  }, [selectedSite]);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <h1>SEO & Analytics Dashboard</h1>
      {loadingSites ? (
        <div>Loading sites...</div>
      ) : sites.length === 0 ? (
        <div>No scraped sites found. Please scrape a site first.</div>
      ) : (
        <div style={{ marginBottom: 24 }}>
          <label htmlFor="siteSelect"><strong>Select Scraped Site:</strong></label>
          <select
            id="siteSelect"
            value={selectedSite}
            onChange={e => setSelectedSite(e.target.value)}
            style={{ marginLeft: 12 }}
          >
            <option value="">-- Choose a site --</option>
            {sites.map(site => (
              <option key={site} value={site}>{site}</option>
            ))}
          </select>
        </div>
      )}
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      {loadingData && selectedSite && <div>Loading data for {selectedSite}...</div>}
      {selectedSite && !loadingData && analysis && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ background: '#f8f9fa', borderRadius: 12, padding: 24 }}>
            <h2>SEO Overview</h2>
            <div><strong>Title:</strong> {analysis.title}</div>
            <div><strong>URL:</strong> <a href={analysis.original_url} target="_blank" rel="noopener noreferrer">{analysis.original_url}</a></div>
            <div><strong>Word Count:</strong> {analysis.word_count}</div>
            <div><strong>Top Keywords:</strong>
              <ul>
                {analysis.top_keywords && Object.entries(analysis.top_keywords).map(([kw, count]) => (
                  <li key={kw}>{kw}: {count}</li>
                ))}
              </ul>
            </div>
          </div>
          <div style={{ background: '#f8f9fa', borderRadius: 12, padding: 24 }}>
            <h2>Performance Metrics</h2>
            {analysis.page_speed_indicators ? (
              <ul>
                {Object.entries(analysis.page_speed_indicators).map(([k, v]) => (
                  <li key={k}><strong>{k.replace(/_/g, ' ')}:</strong> {v}</li>
                ))}
              </ul>
            ) : (
              <div>No performance data.</div>
            )}
          </div>
          <div style={{ background: '#f8f9fa', borderRadius: 12, padding: 24, gridColumn: 'span 2' }}>
            <h2>Analytics Tracking</h2>
            {analytics && analytics.detailed_analytics ? (
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{JSON.stringify(analytics.detailed_analytics, null, 2)}</pre>
            ) : (
              <div>No analytics data.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 