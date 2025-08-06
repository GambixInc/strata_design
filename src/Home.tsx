// src/Home.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

ChartJS.register(ArcElement, Tooltip, Legend);

// Interfaces for our data structures
interface User {
  name: string;
  role: string;
}

interface SeoMetadata {
  meta_tags: { [key: string]: string };
  headings: { [key: string]: string[] };
  internal_links: string[];
}

interface PageSpeedIndicators {
  total_images: number;
  images_without_alt: number;
  total_scripts: number;
  total_stylesheets: number;
  total_links: number;
}

interface AnalysisReport {
  title: string;
  original_url: string;
  seo_metadata: SeoMetadata;
  page_speed_indicators: PageSpeedIndicators;
  word_count: number;
  top_keywords: { [key: string]: number };
}

interface AnalyticsReport {
  detailed_analytics: {
    google_analytics: { version: string; measurement_id?: string; tracking_id?: string }[];
    facebook_pixel: any[];
    google_tag_manager: any[];
    hotjar: any[];
    mixpanel: any[];
    other_tracking: { type: string }[];
    social_media_tracking: { type: string }[];
    ecommerce_tracking: any[];
  };
}

const API_BASE = 'http://localhost:8080/api';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [sites, setSites] = useState<string[]>([]);
  const [selectedSite, setSelectedSite] = useState<string>('');
  const [analysisReport, setAnalysisReport] = useState<AnalysisReport | null>(null);
  const [analyticsReport, setAnalyticsReport] = useState<AnalyticsReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const chartRef = useRef<ChartJS<'doughnut'>>(null);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchSites();
    }
  }, [currentUser]);

  const fetchSites = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/sites`);
      if (response.ok) {
        const data = await response.json();
        setSites(data.success ? data.sites : []);
      } else {
        setError('Failed to fetch sites.');
      }
    } catch (err) {
      setError('Error fetching sites.');
    } finally {
      setLoading(false);
    }
  };

  const fetchReport = async (site: string, type: 'analysis' | 'analytics') => {
    try {
      const response = await fetch(`${API_BASE}/report/${encodeURIComponent(site)}/${type}`);
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleSiteChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const site = event.target.value;
    setSelectedSite(site);
    if (site) {
      setLoading(true);
      setError(null);
      setAnalysisReport(null);
      setAnalyticsReport(null);

      try {
        const [analysis, analytics] = await Promise.all([
          fetchReport(site, 'analysis'),
          fetchReport(site, 'analytics'),
        ]);

        if (analysis) setAnalysisReport(analysis);
        if (analytics) setAnalyticsReport(analytics);

        if (!analysis && !analytics) {
          setError(`No reports found for ${site}.`);
        }
      } catch (err) {
        setError(`Failed to load reports for ${site}.`);
      } finally {
        setLoading(false);
      }
    } else {
      setAnalysisReport(null);
      setAnalyticsReport(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    navigate('/');
  };

  const renderSeoChart = () => {
    if (!analysisReport) return null;

    const { page_speed_indicators, word_count = 0, seo_metadata } = analysisReport;
    const h1Count = seo_metadata.headings.h1?.length || 0;

    const data = {
      labels: ['Total Links', 'Images without Alt', 'Word Count/100', 'H1 Headings*50'],
      datasets: [
        {
          data: [
            page_speed_indicators.total_links,
            page_speed_indicators.images_without_alt,
            word_count / 100,
            h1Count * 50,
          ],
          backgroundColor: ['#4CAF50', '#FFC107', '#2196F3', '#9C27B0'],
          hoverOffset: 4,
        },
      ],
    };

    return (
      <div className="chart-container">
        <Doughnut ref={chartRef} data={data} options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'SEO Key Metrics Distribution', font: { size: 18 } },
          },
        }} />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="main-nav">
        <div className="logo">Strata</div>
        <div className="nav-links">
          <Link to="/scraper" className="nav-link">Web Scraper</Link>
          <Link to="/" className="nav-link">Home</Link>
          {currentUser ? (
             <button className="logout-btn-nav" onClick={handleLogout}>Logout</button>
          ) : (
            <Link to="/login" className="nav-link-login">Login</Link>
          )}
        </div>
      </div>

      {currentUser ? (
        // Logged-in user dashboard
        <div className="dashboard-container">
           <div className="header">
                <h1><i className="fas fa-chart-line"></i> Welcome, {currentUser.name}</h1>
                <p>Comprehensive analysis and insights for your scraped websites</p>
            </div>
          {sites.length > 0 ? (
            <div className="site-selector">
              <label htmlFor="siteSelect"><strong>Select Scraped Site:</strong></label>
              <select id="siteSelect" value={selectedSite} onChange={handleSiteChange}>
                <option value="">Choose a site to analyze...</option>
                {sites.map(site => (
                  <option key={site} value={site}>{site}</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="no-sites-message">
              <div className="card">
                <div className="card-header">
                  <div className="card-icon" style={{ background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)' }}>
                    <i className="fas fa-info-circle"></i>
                  </div>
                  <div className="card-title">No Sites Available</div>
                </div>
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '20px' }}>
                    No scraped sites found for your account.
                  </p>
                  <p style={{ color: '#888', marginBottom: '30px' }}>
                    To see analytics and SEO insights, you need to scrape some websites first.
                  </p>
                  <Link to="/scraper" className="cta-button" style={{ display: 'inline-block', textDecoration: 'none' }}>
                    <i className="fas fa-spider"></i> Start Scraping Websites
                  </Link>
                </div>
              </div>
            </div>
          )}

          {selectedSite && (
            <div className="dashboard-grid">
              {loading && (
                <div className="loading full-width">
                  <i className="fas fa-spinner fa-spin"></i>
                  <p>Loading reports...</p>
                </div>
              )}
              {error && <div className="error full-width">{error}</div>}

              {analysisReport && (
                <>
                  <div className="card">
                    <div className="card-header">
                      <div className="card-icon" style={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' }}>
                        <i className="fas fa-search"></i>
                      </div>
                      <div className="card-title">SEO Overview</div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header">
                      <div className="card-icon" style={{ background: 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)' }}>
                        <i className="fas fa-tachometer-alt"></i>
                      </div>
                      <div className="card-title">Performance Metrics</div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header">
                      <div className="card-icon" style={{ background: 'linear-gradient(135deg, #17a2b8 0%, #6f42c1 100%)' }}>
                        <i className="fas fa-file-alt"></i>
                      </div>
                      <div className="card-title">Content Analysis</div>
                    </div>
                  </div>
                  <div className="card full-width">
                    <div className="card-header">
                      <div className="card-icon" style={{ background: 'linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%)' }}>
                        <i className="fas fa-chart-pie"></i>
                      </div>
                      <div className="card-title">SEO Score Breakdown</div>
                    </div>
                    {renderSeoChart()}
                  </div>
                </>
              )}

              {analyticsReport && (
                <div className="card">
                  <div className="card-header">
                    <div className="card-icon" style={{ background: 'linear-gradient(135deg, #dc3545 0%, #e83e8c 100%)' }}>
                      <i className="fas fa-chart-bar"></i>
                    </div>
                    <div className="card-title">Analytics Tracking</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        // Guest user marketing page
        <div className="marketing-page">
            <header className="hero-section">
                <div className="hero-content">
                    <h1>Enhance Your Digital Presence with Strata</h1>
                    <p>Advanced solutions for digital optimization, marketing, CRO, and SEO to boost your online growth.</p>
                    <Link to="/login" className="cta-button-hero">Get Started for Free</Link>
                </div>
            </header>

            <main>
                <section className="services-overview">
                    <h2>Our Core Services</h2>
                    <div className="service-cards">
                        <div className="service-card">
                            <div className="service-icon"><i className="fas fa-chart-line"></i></div>
                            <h3>Conversion Rate Optimization (CRO) & A/B Testing</h3>
                            <p>Experiment with website elements, copy, and UI to improve conversion rates and user experience. Features include automated experimentation, personalized testing, and detailed analytics.</p>
                        </div>
                        <div className="service-card">
                            <div className="service-icon"><i className="fas fa-search-dollar"></i></div>
                            <h3>SEO & Content Marketing</h3>
                            <p>Boost your organic search rankings with AI-powered content creation, technical SEO audits, keyword research, and content generation for blogs, social media, and more.</p>
                        </div>
                    </div>
                </section>

                <section className="features-section">
                    <h2>Why Strata?</h2>
                    <div className="feature-list">
                        <div className="feature-item">
                            <div className="feature-icon"><i className="fas fa-robot"></i></div>
                            <h4>AI-Powered Insights</h4>
                            <p>Leverage artificial intelligence to automate content creation and gain deep insights into user behavior.</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon"><i className="fas fa-vials"></i></div>
                            <h4>Data-Driven Experimentation</h4>
                            <p>Run A/B tests and personalized experiments to find what truly works for your audience.</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon"><i className="fas fa-tachometer-alt"></i></div>
                            <h4>Comprehensive Analytics</h4>
                            <p>Track your performance with detailed analytics and see the real impact of your optimizations.</p>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="marketing-footer">
                <div className="footer-content">
                    <h2>Ready to Optimize Your Online Presence?</h2>
                    <p>Join Strata today and take the first step towards a better digital strategy.</p>
                    <Link to="/login" className="cta-button-footer">Sign Up Now</Link>
                </div>
            </footer>
        </div>
      )}
    </div>
  );
};

export default Home;
