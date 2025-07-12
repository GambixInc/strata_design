// Dashboard.tsx - Dashboard layout with sidebar navigation and user info
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import './App.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add logout logic here
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <Sidebar
        userName="Olivia Rhye"
        userEmail="olivia@strata.com"
        userAvatar="https://randomuser.me/api/portraits/women/44.jpg"
        onLogout={handleLogout}
      />
      <main className="dashboard-main-content">
        {/* Main dashboard content goes here */}
      </main>
    </div>
  );
};

export default Dashboard; 