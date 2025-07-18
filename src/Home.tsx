import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import CreateProjectModal from './components/CreateProjectModal';
import './App.css';
import './Home.css';

interface ProjectData {
  websiteUrl: string;
  category: string;
  description: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    navigate('/login');
  };

  const handleCreateProject = async (projectData: ProjectData) => {
    setIsLoading(true);
    try {
      // Make API call to backend scraping service
      const response = await fetch('http://localhost:8080/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: projectData.websiteUrl,
          user_email: 'olivia@strata.com', // This should come from user authentication
          category: projectData.category,
          description: projectData.description
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to scrape website');
      }

      const result = await response.json();
      
      if (result.success) {
        // Show success message or redirect to results
        alert('Website successfully scraped! Check the scraper page for results.');
        navigate('/scraper');
      } else {
        throw new Error(result.error || 'Failed to scrape website');
      }
    } catch (error) {
      console.error('Error scraping website:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to scrape website'}`);
    } finally {
      setIsLoading(false);
    }
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
        <div className="home-content">
          <div className="home-header">
            <h1>Welcome back, Olivia</h1>
            <p>Get started by creating a new project to analyze your website.</p>
          </div>

          <div className="home-actions">
            <div className="create-project-card">
              <div className="project-card-icon">
                <i className="fas fa-plus"></i>
              </div>
              <h3>Create New Project</h3>
              <p>Start by entering your website URL to analyze and optimize your site's performance.</p>
              <button 
                className="create-project-btn"
                onClick={() => setIsModalOpen(true)}
                disabled={isLoading}
              >
                <i className="fas fa-folder-plus"></i>
                New Project
              </button>
            </div>

            <div className="quick-stats">
              <div className="stat-item">
                <div className="stat-number">12</div>
                <div className="stat-label">Projects Created</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">847</div>
                <div className="stat-label">Pages Analyzed</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">98%</div>
                <div className="stat-label">Success Rate</div>
              </div>
            </div>
          </div>

          <div className="recent-projects">
            <h2>Recent Projects</h2>
            <div className="projects-list">
              <div className="project-item">
                <div className="project-info">
                  <h4>healthtech.com</h4>
                  <p>Health Tech • Created 2 days ago</p>
                </div>
                <div className="project-status">
                  <span className="status-badge completed">Completed</span>
                </div>
              </div>
              <div className="project-item">
                <div className="project-info">
                  <h4>ecommerce-store.com</h4>
                  <p>E-commerce • Created 5 days ago</p>
                </div>
                <div className="project-status">
                  <span className="status-badge completed">Completed</span>
                </div>
              </div>
              <div className="project-item">
                <div className="project-info">
                  <h4>saas-platform.io</h4>
                  <p>SaaS • Created 1 week ago</p>
                </div>
                <div className="project-status">
                  <span className="status-badge completed">Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleCreateProject}
      />
    </div>
  );
};

export default Home; 