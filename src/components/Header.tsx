import React from 'react';

interface HeaderProps {
  userName: string;
  userRole: string;
}

const Header: React.FC<HeaderProps> = ({ userName, userRole }) => {
  return (
    <header className="main-header">
      <div className="header-left">
        <div className="welcome-section">
          <h1 className="welcome-text">Welcome back, {userName}</h1>
          <p className="welcome-subtitle">Here's what's happening with your projects today.</p>
        </div>
      </div>
      <div className="header-right">
        <div className="header-actions">
          <button className="notification-btn" aria-label="Notifications">
            <i className="fas fa-bell"></i>
            <span className="notification-badge">3</span>
          </button>
          <div className="user-profile">
            <div className="profile-info">
              <span className="profile-name">{userName}</span>
              <span className="profile-role">{userRole}</span>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face" 
              alt="Profile" 
              className="profile-image"
            />
            <button className="profile-dropdown" aria-label="Profile menu">
              <i className="fas fa-chevron-down"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
