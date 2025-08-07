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
            <Link to="/scraper" className="text-sm font-medium text-slate-600 hover:text-slate-900">Web Scraper</Link>
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
          <header className="relative isolate overflow-hidden bg-gradient-to-br from-violet-600 via-fuchsia-600 to-rose-500 text-white">
            <div className="absolute inset-0 -z-10 opacity-30 blur-3xl" aria-hidden="true" />
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium ring-1 ring-inset ring-white/20">
                    <span className="h-2 w-2 rounded-full bg-white" />
                    New: AI‑powered site insights
                  </span>
                  <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight">
                    Enhance your digital presence with <span className="text-white/90">Strata</span>
                  </h1>
                  <p className="mt-4 text-lg leading-8 text-white/80">
                    Audit, analyze and improve with modern tools for SEO, analytics and CRO — all in one place.
                  </p>
                  <ul className="mt-6 space-y-3 text-white/85">
                    <li className="flex items-center gap-3"><span className="h-5 w-5 rounded-full bg-white/20 grid place-items-center">✓</span> One-click audits and health checks</li>
                    <li className="flex items-center gap-3"><span className="h-5 w-5 rounded-full bg-white/20 grid place-items-center">✓</span> Keyword and content insights</li>
                    <li className="flex items-center gap-3"><span className="h-5 w-5 rounded-full bg-white/20 grid place-items-center">✓</span> Clear analytics that drive action</li>
                  </ul>
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Link to="/login" className="inline-flex items-center rounded-md bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-100">
                      Get started for free
                    </Link>
                    <a href="#features" className="text-sm font-semibold text-white/90 hover:text-white">Learn more →</a>
                  </div>
                </div>
                <div className="relative">
                  <div className="rounded-2xl bg-white/10 backdrop-blur shadow-xl ring-1 ring-white/20 p-4">
                    <div className="h-64 sm:h-80 rounded-lg bg-gradient-to-br from-white/20 to-white/0 flex items-center justify-center text-white text-2xl font-bold">
                      Dashboard Preview
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* FEATURES */}
          <main id="features" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
            <section className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'CRO & A/B Testing', desc: 'Experiment with UI and copy to lift conversions with confidence.', color: 'from-violet-600 to-fuchsia-600', icon: '⟲' },
                { title: 'SEO & Content', desc: 'Generate content, fix technical issues and track search impact.', color: 'from-emerald-600 to-teal-600', icon: '⚙' },
                { title: 'Analytics', desc: 'Unified tracking insights to understand what drives results.', color: 'from-amber-500 to-orange-500', icon: '📊' },
              ].map((f) => (
                <div key={f.title} className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                  <div className={`h-10 w-10 rounded-lg text-white flex items-center justify-center bg-gradient-to-br ${f.color}`}>{f.icon}</div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">{f.title}</h3>
                  <p className="mt-2 text-slate-600">{f.desc}</p>
                </div>
              ))}
            </section>

            {/* CTA */}
            <section className="mt-16 rounded-2xl bg-slate-900 p-8 sm:p-12 text-white">
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold">Ready to optimize your online presence?</h2>
                  <p className="mt-3 text-slate-300">Join Strata today and start with a free account. No credit card required.</p>
                </div>
                <div className="flex lg:justify-end">
                  <Link to="/login" className="inline-flex items-center rounded-md bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-100">
                    Create your free account
                  </Link>
                </div>
              </div>
            </section>
          </main>
        </div>
      )}
    </div>
  );
};

export default Home;
