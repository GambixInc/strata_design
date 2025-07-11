import React from 'react';
import './Dashboard.css';

const Sidebar = () => (
  <aside className="sidebar">
    <div className="sidebar-header">
      <span className="sidebar-logo">Strata</span>
    </div>
    <nav className="sidebar-nav">
      <a href="#" className="sidebar-link active">
        <span className="sidebar-icon">{/* Home icon */}
          <svg width="28" height="28" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12L12 4l9 8"/><path d="M9 21V9h6v12"/></svg>
        </span>
        Home
      </a>
      <a href="#" className="sidebar-link">
        <span className="sidebar-icon">
          <svg width="28" height="28" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/></svg>
        </span>
        Project
      </a>
      <a href="#" className="sidebar-link">
        <span className="sidebar-icon">
          <svg width="28" height="28" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a7.5 7.5 0 0 1 13 0"/></svg>
        </span>
        Team
      </a>
      <a href="#" className="sidebar-link">
        <span className="sidebar-icon">
          <svg width="28" height="28" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a7.5 7.5 0 0 1 13 0"/></svg>
        </span>
        Account
      </a>
    </nav>
    <div className="sidebar-bottom">
      <a href="#" className="sidebar-link">
        <span className="sidebar-icon">
          <svg width="28" height="28" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v.01"/><path d="M12 8v4"/></svg>
        </span>
        Support
      </a>
      <a href="#" className="sidebar-link">
        <span className="sidebar-icon">
          <svg width="28" height="28" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M8 12h8"/></svg>
        </span>
        Settings
      </a>
      <div className="sidebar-user">
        <img className="sidebar-avatar" src="https://randomuser.me/api/portraits/women/44.jpg" alt="Olivia Rhye" />
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">Olivia Rhye</div>
          <div className="sidebar-user-email">olivia@strata.com</div>
        </div>
        <span className="sidebar-user-action">
          <svg width="20" height="20" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
        </span>
      </div>
    </div>
  </aside>
);

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        {/* Main dashboard content goes here */}
      </main>
    </div>
  );
};

export default Dashboard; 