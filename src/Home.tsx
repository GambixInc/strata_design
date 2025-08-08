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
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-100 text-slate-800">
      <nav className="sticky top-0 z-20 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold text-slate-900">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white">S</span>
            <span>Strata</span>
          </Link>
          <div className="flex items-center gap-4">
            {/* <Link to="/scraper" className="text-sm font-medium text-slate-600 hover:text-slate-900">Web Scraper</Link> */}
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">Home</Link>
            {currentUser ? (
              <button onClick={handleLogout} className="inline-flex items-center rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-700">Logout</button>
            ) : (
              <Link to="/login" className="inline-flex items-center rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500">Login</Link>
            )}
          </div>
        </div>
      </nav>

      {currentUser ? (
        // Logged-in user dashboard
        <div className="dashboard-container px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8">
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
        // Guest user marketing page styled with Tailwind
        <div>
          {/* HERO */}
          <header className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700">
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative mx-auto max-w-7xl px-6 lg:px-8 pt-16 pb-20">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-4 py-2 text-sm font-medium text-white ring-1 ring-white/25">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  New: AI‑powered site insights
                </div>
                <h1 className="mt-8 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                  Enhance your digital presence with{' '}
                  <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    Strata
                  </span>
                </h1>
                <p className="mt-6 max-w-2xl mx-auto text-xl leading-8 text-white/90">
                  Audit, analyze and improve with modern tools for SEO, analytics and CRO — all in one place.
                </p>
                
                <div className="mt-8 flex flex-wrap justify-center gap-6 text-white/85">
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    One-click audits and health checks
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Keyword and content insights
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Clear analytics that drive action
                  </div>
                </div>
                
                <div className="mt-10 flex flex-wrap justify-center gap-4">
                  <Link 
                    to="/login" 
                    className="inline-flex items-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-lg hover:bg-slate-50 hover:shadow-xl transition-all duration-200"
                  >
                    Get started for free
                  </Link>
                  <a 
                    href="#features" 
                    className="inline-flex items-center rounded-lg border border-white/30 px-6 py-3 text-base font-semibold text-white hover:bg-white/10 transition-all duration-200"
                  >
                    Learn more
                  </a>
                </div>
              </div>
              
              {/* Dashboard Preview */}
              <div className="mt-16 relative">
                <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-6 shadow-2xl">
                  <div className="h-64 sm:h-80 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white text-2xl font-bold mb-4">
                        S
                      </div>
                      <p className="text-slate-600 font-medium">Dashboard Preview</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* FEATURES */}
          <main className="bg-slate-50 py-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Everything you need to grow
                </h2>
                <p className="mt-4 text-lg text-slate-600">
                  Powerful tools to analyze, optimize, and scale your digital presence
                </p>
              </div>
              
              <div id="features" className="grid md:grid-cols-3 gap-8">
                {[
                  { 
                    title: 'CRO & A/B Testing', 
                    desc: 'Experiment with UI and copy to lift conversions with confidence. Run tests that matter.',
                    color: 'from-violet-600 to-purple-600',
                    icon: (
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                      </svg>
                    )
                  },
                  { 
                    title: 'SEO & Content', 
                    desc: 'Generate content, fix technical issues and track search impact with AI-powered insights.',
                    color: 'from-emerald-600 to-teal-600',
                    icon: (
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>
                    )
                  },
                  { 
                    title: 'Analytics', 
                    desc: 'Unified tracking insights to understand what drives results and optimize for growth.',
                    color: 'from-amber-500 to-orange-500',
                    icon: (
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                      </svg>
                    )
                  },
                ].map((feature) => (
                  <div key={feature.title} className="group relative rounded-2xl bg-white p-8 shadow-sm hover:shadow-lg transition-all duration-200 border border-slate-200">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white`}>
                      {feature.icon}
                    </div>
                    <h3 className="mt-6 text-xl font-semibold text-slate-900">{feature.title}</h3>
                    <p className="mt-2 text-slate-600 leading-7">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </main>

          {/* CTA */}
          <section className="bg-slate-900">
            <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Ready to optimize your online presence?
                </h2>
                <p className="mt-4 text-lg text-slate-300">
                  Join Strata today and start with a free account. No credit card required.
                </p>
                <div className="mt-8">
                  <Link 
                    to="/login" 
                    className="inline-flex items-center rounded-lg bg-white px-8 py-4 text-base font-semibold text-slate-900 shadow-lg hover:bg-slate-50 hover:shadow-xl transition-all duration-200"
                  >
                    Create your free account
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Home;
