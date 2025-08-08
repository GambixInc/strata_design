import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

interface SidebarProps {
  sidebarOpen: boolean;
  activePage: string;
  onNavigation: (navItem: NavItem) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, activePage, onNavigation }) => {
  const navigate = useNavigate();

  const navigationItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: 'fas fa-home', path: '/' },
    { id: 'project', label: 'Project', icon: 'fas fa-folder', path: '/project' },
    { id: 'team', label: 'Team', icon: 'fas fa-users', path: '/team' },
  ];

  const bottomNavItems: NavItem[] = [
    { id: 'support', label: 'Support', icon: 'fas fa-headset', path: '/support' },
    { id: 'settings', label: 'Settings', icon: 'fas fa-cog', path: '/settings' },
  ];

  const handleLogout = async () => {
    try {
      // Mock logout - just navigate to login
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <aside className={`sidebar ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-brand-container">
          <div className="sidebar-logo">
            <span className="logo-icon">G</span>
          </div>
          {sidebarOpen && <h1 className="sidebar-brand">Gambix Strata</h1>}
        </div>
      </div>

            {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activePage === item.id ? 'nav-item-active' : ''}`}
              onClick={() => onNavigation(item)}
            >
              <i className={item.icon}></i>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </button>
          ))}
        </div>

        {/* Bottom Navigation */}
        <div className="nav-section-bottom">
          {bottomNavItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activePage === item.id ? 'nav-item-active' : ''}`}
              onClick={() => onNavigation(item)}
            >
              <i className={item.icon}></i>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </button>
          ))}
          
          <button className="nav-item nav-item-logout" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            {sidebarOpen && <span className="nav-label">Logout</span>}
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar; 