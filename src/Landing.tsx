// src/Landing.tsx

import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Landing: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    const elements = [heroRef.current, servicesRef.current, featuresRef.current, ctaRef.current];
    elements.forEach(el => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 animate-fade-in">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 font-bold text-slate-900 group">
            <div className="relative">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-violet-700 text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 animate-bounce-in">S</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-400 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <span className="text-xl animate-slide-in-left">Strata</span>
          </Link>
          <div className="flex items-center gap-6 animate-slide-in-right">
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200">Home</Link>
            <Link to="/login" className="inline-flex items-center rounded-xl bg-gradient-to-r from-violet-600 to-violet-700 px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div ref={heroRef} className="relative overflow-hidden animate-section">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-100/30 via-transparent to-blue-100/20"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <span className="inline-flex items-center rounded-full bg-violet-100 px-4 py-2 text-sm font-medium text-violet-800 mb-6 animate-pulse">
                <i className="fas fa-star text-violet-600 mr-2"></i>
                Trusted by 10,000+ businesses worldwide
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              Welcome to{' '}
              <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
                Strata
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-4xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              Your comprehensive SEO and website optimization platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
              <Link to="/login" className="inline-flex items-center rounded-xl bg-gradient-to-r from-violet-600 to-violet-700 px-8 py-4 text-lg font-semibold text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-bounce-in">
                <i className="fas fa-rocket mr-2"></i>
                Get Started Free
              </Link>
              <button className="inline-flex items-center rounded-xl border-2 border-slate-300 px-8 py-4 text-lg font-semibold text-slate-700 hover:border-violet-300 hover:text-violet-700 transition-all duration-300 animate-bounce-in" style={{ animationDelay: '0.1s' }}>
                <i className="fas fa-play mr-2"></i>
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Services Overview */}
      <div ref={servicesRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 animate-section">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-slide-in-left">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                Advanced Digital{' '}
                <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
                  Optimization
                </span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Offering advanced solutions to enhance online presence and user engagement through digital optimization and marketing. 
                Our platform provides comprehensive tools designed to transform your digital strategy and maximize your online impact.
              </p>
            </div>
            <div className="flex items-center space-x-4 animate-fade-in-up">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-violet-600 border-2 border-white animate-bounce-in" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 border-2 border-white animate-bounce-in" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 border-2 border-white animate-bounce-in" style={{ animationDelay: '0.3s' }}></div>
              </div>
              <span className="text-sm text-slate-600">Join 10,000+ businesses optimizing with Strata</span>
            </div>
          </div>
          
          <div className="space-y-8 animate-slide-in-right">
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200/50 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center mr-4 animate-bounce-in">
                  <i className="fas fa-chart-line text-white text-lg"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Conversion Rate Optimization</h3>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Services centered around Conversion Rate Optimization (CRO) and A/B Testing, enabling businesses to experiment with 
                different website elements, copy, and user interfaces to improve conversion rates and overall user experience.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Services */}
      <div ref={featuresRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 animate-section">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Comprehensive{' '}
            <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
              Solutions
            </span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Everything you need to optimize your digital presence and drive results
          </p>
        </div>

        <div className="space-y-8">
          {/* CRO & A/B Testing Section */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200/50 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center mr-4 animate-bounce-in">
                <i className="fas fa-chart-line text-white text-xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">CRO & A/B Testing</h3>
            </div>
            <p className="text-slate-600 leading-relaxed mb-6 text-lg">
              Our platform includes features for automated experimentation, personalized testing, and detailed analytics to track 
              performance and gain insights into user behavior. Test different layouts, headlines, call-to-actions, and user flows 
              to discover what drives the best results for your business.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <ul className="text-slate-600 space-y-3 animate-slide-in-left">
                <li className="flex items-start animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5 animate-bounce-in">
                    <i className="fas fa-check text-green-600 text-xs"></i>
                  </div>
                  Automated experimentation workflows
                </li>
                <li className="flex items-start animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5 animate-bounce-in">
                    <i className="fas fa-check text-green-600 text-xs"></i>
                  </div>
                  Personalized testing scenarios
                </li>
              </ul>
              <ul className="text-slate-600 space-y-3 animate-slide-in-right">
                <li className="flex items-start animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5 animate-bounce-in">
                    <i className="fas fa-check text-green-600 text-xs"></i>
                  </div>
                  Detailed performance analytics
                </li>
                <li className="flex items-start animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5 animate-bounce-in">
                    <i className="fas fa-check text-green-600 text-xs"></i>
                  </div>
                  User behavior insights
                </li>
              </ul>
            </div>
          </div>

          {/* SEO & Content Marketing Section */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200/50 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-4 animate-bounce-in">
                <i className="fas fa-search text-white text-xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">SEO & Content Marketing</h3>
            </div>
            <p className="text-slate-600 leading-relaxed mb-6 text-lg">
              Beyond conversion-focused tools, a significant emphasis is placed on Search Engine Optimization (SEO) and Content Marketing. 
              Our offerings in this domain typically involve AI-powered content creation, technical SEO audits and fixes, comprehensive 
              keyword research, and the generation of various content types.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 animate-slide-in-left">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center">
                  <i className="fas fa-pen-fancy text-blue-600 mr-2"></i>
                  Content Creation
                </h4>
                <ul className="text-slate-600 space-y-2 text-sm">
                  <li className="flex items-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <i className="fas fa-arrow-right text-blue-500 mr-2 text-xs"></i>
                    AI-powered blog generation
                  </li>
                  <li className="flex items-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <i className="fas fa-arrow-right text-blue-500 mr-2 text-xs"></i>
                    Social media content creation
                  </li>
                  <li className="flex items-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <i className="fas fa-arrow-right text-blue-500 mr-2 text-xs"></i>
                    AI-generated images and graphics
                  </li>
                  <li className="flex items-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <i className="fas fa-arrow-right text-blue-500 mr-2 text-xs"></i>
                    Email marketing campaigns
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-6 animate-slide-in-right">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center">
                  <i className="fas fa-cogs text-violet-600 mr-2"></i>
                  Technical SEO
                </h4>
                <ul className="text-slate-600 space-y-2 text-sm">
                  <li className="flex items-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <i className="fas fa-arrow-right text-violet-500 mr-2 text-xs"></i>
                    Comprehensive site audits
                  </li>
                  <li className="flex items-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <i className="fas fa-arrow-right text-violet-500 mr-2 text-xs"></i>
                    Technical SEO fixes
                  </li>
                  <li className="flex items-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <i className="fas fa-arrow-right text-violet-500 mr-2 text-xs"></i>
                    Keyword research & optimization
                  </li>
                  <li className="flex items-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <i className="fas fa-arrow-right text-violet-500 mr-2 text-xs"></i>
                    Performance monitoring
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="bg-gradient-to-br from-slate-50 to-violet-50 rounded-2xl p-8 shadow-xl border border-slate-200/50 animate-fade-in-up">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mr-4 animate-bounce-in">
                <i className="fas fa-rocket text-white text-xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Key Benefits</h3>
            </div>
            <p className="text-slate-600 leading-relaxed mb-8 text-lg">
              These services aim to boost organic search rankings, streamline content production, and ensure a strong, visible 
              digital footprint across different online channels.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 animate-bounce-in">
                  <i className="fas fa-arrow-up text-white text-xl"></i>
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Boost Rankings</h4>
                <p className="text-slate-600 text-sm">Improve your search engine visibility and organic traffic</p>
              </div>
              <div className="text-center group animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 animate-bounce-in">
                  <i className="fas fa-cogs text-white text-xl"></i>
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Streamline Production</h4>
                <p className="text-slate-600 text-sm">Automate content creation and optimization processes</p>
              </div>
              <div className="text-center group animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 animate-bounce-in">
                  <i className="fas fa-globe text-white text-xl"></i>
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Digital Footprint</h4>
                <p className="text-slate-600 text-sm">Build a strong presence across all online channels</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div ref={ctaRef} className="relative overflow-hidden bg-gradient-to-br from-violet-600 to-blue-700 animate-section">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in-up">
              Ready to Transform Your Digital Strategy?
            </h2>
            <p className="text-violet-100 mb-8 max-w-2xl mx-auto text-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Join thousands of businesses that have already improved their online presence with Strata's comprehensive optimization platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Link to="/login" className="inline-flex items-center rounded-xl bg-white px-8 py-4 text-lg font-semibold text-violet-700 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-bounce-in">
                <i className="fas fa-rocket mr-2"></i>
                Start Your Free Trial
              </Link>
              <button className="inline-flex items-center rounded-xl border-2 border-white/30 px-8 py-4 text-lg font-semibold text-white hover:bg-white/10 transition-all duration-300 animate-bounce-in" style={{ animationDelay: '0.1s' }}>
                <i className="fas fa-play mr-2"></i>
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.8s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.8s ease-out forwards;
        }

        .animate-bounce-in {
          animation: bounceIn 0.8s ease-out forwards;
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-section {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease-out;
        }

        .animate-section.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        .animate-fade-in-up,
        .animate-slide-in-left,
        .animate-slide-in-right,
        .animate-bounce-in,
        .animate-fade-in {
          opacity: 0;
        }

        .animate-section.animate-in .animate-fade-in-up,
        .animate-section.animate-in .animate-slide-in-left,
        .animate-section.animate-in .animate-slide-in-right,
        .animate-section.animate-in .animate-bounce-in,
        .animate-section.animate-in .animate-fade-in {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default Landing;
