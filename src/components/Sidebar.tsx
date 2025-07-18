import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

interface SidebarProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  userName = 'Olivia Rhye',
  userEmail = 'olivia@strata.com',
  userAvatar = 'https://via.placeholder.com/40',
  onLogout
}) => {
  const location = useLocation();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-header">
        <h2 className="logo">Strata</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              <i className="fas fa-home"></i> Home
            </Link>
          </li>
          {/* <li>
            <Link to="/project" className={location.pathname === '/project' ? 'active' : ''}>
              <i className="fas fa-folder"></i> Project
            </Link>
          </li> */}
          {/* <li>
            <Link to="/team" className={location.pathname === '/team' ? 'active' : ''}>
              <i className="fas fa-users"></i> Team
            </Link>
          </li> */}
          <li>
            <Link to="/account" className={location.pathname === '/account' ? 'active' : ''}>
              <i className="fas fa-user-circle"></i> Account
            </Link>
          </li>
        </ul>
        <ul className="sidebar-bottom-nav">
          {/* <li>
            <Link to="/support" className={location.pathname === '/support' ? 'active' : ''}>
              <i className="fas fa-life-ring"></i> Support
            </Link>
          </li> */}
          {/* <li>
            <Link to="/settings" className={location.pathname === '/settings' ? 'active' : ''}>
              <i className="fas fa-cog"></i> Settings
            </Link>
          </li> */}
        </ul>
      </nav>
      <div className="sidebar-profile">
        <img src={userAvatar} alt="User Avatar" className="profile-avatar" />
        <div className="profile-info">
          <div className="profile-name">{userName}</div>
          <div className="profile-email">{userEmail}</div>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar; 