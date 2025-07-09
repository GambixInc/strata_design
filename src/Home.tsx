import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => (
  <>
    <header className="header">
      <a href="#" className="logo">STRATA</a>
      <div className="nav-container">
        <nav className="nav-menu">
          <Link to="/" className="active">HOME</Link>
          <a href="#features">FEATURES</a>
          <a href="#about">ABOUT</a>
          <a href="#pricing">PRICING</a>
          <a href="#contact">CONTACT</a>
        </nav>
        <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      </div>
      <Link to="/login" className="login-btn">Login</Link>
    </header>

    <main className="main-content">
      <h1 className="hero-title">
        <span className="gradient-text">Strata</span> <span className="black-text">optimizes websites</span>
      </h1>
      <p className="hero-subtitle">
        AI-powered platform that helps businesses optimize their websites' SEO, A/B testing, and UI/UX for maximum performance and conversion rates.
      </p>
      <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/login" className="cta-button">
          Get Started
          <span className="arrow">→</span>
        </Link>
        <a href="/scraper_frontend.html" className="cta-button" style={{ background: 'linear-gradient(135deg, #28a745, #20c997)' }}>
          <i className="fas fa-spider"></i> Try Scraper
          <span className="arrow">→</span>
        </a>
      </div>
    </main>

    <section className="features-section" id="features">
      <div className="feature-card">
        <div className="feature-icon">🔍</div>
        <div className="feature-title">SEO Optimization</div>
        <div className="feature-description">AI-powered SEO analysis and recommendations to improve search rankings</div>
      </div>
      <div className="feature-card">
        <div className="feature-icon">🧪</div>
        <div className="feature-title">A/B Testing</div>
        <div className="feature-description">Intelligent A/B testing to optimize conversion rates and user experience</div>
      </div>
      <div className="feature-card">
        <div className="feature-icon">🎨</div>
        <div className="feature-title">UI/UX Design</div>
        <div className="feature-description">AI-driven design suggestions to enhance user interface and experience</div>
      </div>
      <div className="feature-card">
        <div className="feature-icon">📊</div>
        <div className="feature-title">Analytics</div>
        <div className="feature-description">Comprehensive analytics and insights to track performance metrics</div>
      </div>
      <div className="feature-card">
        <div className="feature-icon">🚀</div>
        <div className="feature-title">Performance</div>
        <div className="feature-description">Website performance optimization for faster loading and better user experience</div>
      </div>
    </section>
  </>
);

export default Home; 