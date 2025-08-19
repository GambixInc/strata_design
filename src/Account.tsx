import React, { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

import './App.css';
import './Account.css';
import Sidebar from './components/Sidebar';
import { handleApiError } from './services/api';

import { useAuth } from './hooks/useAuth';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  company: string;
  photo: string;
}

const Account: React.FC = () => {

  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('details');
  
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    role: 'user',
    company: '',
    photo: 'https://via.placeholder.com/60'
  });

  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [id]: value
    }));
    setIsDirty(true);
  };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({
          ...prev,
          photo: reader.result as string
        }));
        setIsDirty(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // Note: User profile management is not supported in the current unified Lambda API
      alert('User profile management is not supported in the current API. Profile changes will not be saved.');
      setIsDirty(false);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Error updating profile:', errorMessage);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      if (window.confirm('Are you sure you want to discard your changes?')) {
        // Reset form to initial values
        setProfile({
          firstName: 'Oliva',
          lastName: 'Rhye',
          email: 'olivia@untitledui.com',
          role: 'Product Designer',
          company: 'Strata',
          photo: 'https://via.placeholder.com/60'
        });
        setIsDirty(false);
      }
    }
  };

  const handleLogout = () => {
    logout();
  };

  // Load user profile from backend
  useEffect(() => {
    const loadUserProfile = async () => {
      // Since this component is protected by ProtectedRoute, we can assume user is authenticated
      try {
        setLoading(true);
        setError(null);
        
        // Note: User profile management is not supported in the current unified Lambda API
        // Using default profile data for now
        const defaultProfile = {
          firstName: 'User',
          lastName: 'Account',
          email: 'user@example.com',
          role: 'User',
          company: '',
          photo: 'https://via.placeholder.com/60'
        };
        
        setProfile(defaultProfile);
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);
        console.error('Error loading profile:', errorMessage);
        
        // If it's an authentication error, let the auth system handle it
        if (errorMessage.includes('Authentication required') || 
            errorMessage.includes('Token expired') ||
            errorMessage.includes('Invalid or expired token')) {
          console.error('Authentication error:', errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar
        userName={`${profile.firstName} ${profile.lastName}`}
        onLogout={handleLogout}
      />

      <main className="dashboard-main-content">
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your profile...</p>
          </div>
        )}

        {error && !loading && (
          <div className="error-container">
            <div className="error-message">
              <i className="fas fa-exclamation-triangle"></i>
              <p>Error loading profile: {error}</p>
              <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          </div>
        )}

        {!loading && !error && (
          <form onSubmit={handleSave}>
          <header className="account-header">
            <h1>Account</h1>
            <div className="header-buttons">
              <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
              <button type="submit" className="save-button" disabled={!isDirty}>Save</button>
            </div>
          </header>

          <nav className="account-tabs">
            <button 
              type="button"
              className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              My details
            </button>
            <button 
              type="button"
              className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
              onClick={() => setActiveTab('password')}
            >
              Password
            </button>
            <button 
              type="button"
              className={`tab-button ${activeTab === 'api' ? 'active' : ''}`}
              onClick={() => setActiveTab('api')}
            >
              API
            </button>
          </nav>

          {activeTab === 'details' && (
            <section className="personal-info-section">
              <h2>Personal info</h2>
              <p className="section-description">Update your photo and personal details here.</p>

              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="firstName">Name</label>
                  <div className="name-inputs">
                    <input
                      type="text"
                      id="firstName"
                      value={profile.firstName}
                      onChange={handleInputChange}
                      placeholder="First name"
                    />
                    <input
                      type="text"
                      id="lastName"
                      value={profile.lastName}
                      onChange={handleInputChange}
                      placeholder="Last name"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <div className="input-with-icon">
                  <i className="fas fa-envelope"></i>
                  <input
                    type="email"
                    id="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                  />
                </div>
              </div>

              <div className="form-group photo-upload-group">
                <label>Your photo <i className="fas fa-question-circle"></i></label>
                <p className="section-description">This will be displayed on your profile.</p>
                <div className="photo-upload-area">
                  <img src={profile.photo} alt="Profile" className="current-photo" />
                  <label className="upload-box" htmlFor="photo-upload">
                    <input
                      type="file"
                      id="photo-upload"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      style={{ display: 'none' }}
                    />
                    <i className="fas fa-cloud-upload-alt"></i>
                    <p>Click to upload or drag and drop</p>
                    <p className="upload-info">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                    <div className="file-icon">
                      <i className="fas fa-file-image"></i> JPG
                    </div>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="role">Role</label>
                <input
                  type="text"
                  id="role"
                  value={profile.role}
                  onChange={handleInputChange}
                  placeholder="Your role"
                />
              </div>

              <div className="form-group">
                <label htmlFor="company">Company</label>
                <input
                  type="text"
                  id="company"
                  value={profile.company}
                  onChange={handleInputChange}
                  placeholder="Company name"
                />
              </div>
            </section>
          )}

          {activeTab === 'password' && (
            <section className="personal-info-section">
              <h2>Password</h2>
              <p className="section-description">Update your password here.</p>
              {/* Password update form would go here */}
            </section>
          )}

          {activeTab === 'api' && (
            <section className="personal-info-section">
              <h2>API Settings</h2>
              <p className="section-description">Manage your API keys and settings.</p>
              {/* API settings would go here */}
            </section>
          )}

          <footer className="account-footer">
            <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
            <button type="submit" className="save-button" disabled={!isDirty}>Save</button>
          </footer>
        </form>
        )}
      </main>
    </div>
  );
};

export default Account; 