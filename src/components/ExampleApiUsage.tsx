// src/components/ExampleApiUsage.tsx

import React, { useState, useEffect } from 'react';
import ApiService, { useApiCall, handleApiError } from '../services/api';

// Example 1: Using the useApiCall hook
export const ProjectsList: React.FC = () => {
  const { data, loading, error, execute } = useApiCall(ApiService.getProjects);

  useEffect(() => {
    execute();
  }, [execute]);

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data?.success) return <div>Failed to load projects</div>;

  return (
    <div>
      <h3>Projects</h3>
      {data.data?.map((project: any) => (
        <div key={project.id}>{project.name}</div>
      ))}
    </div>
  );
};

// Example 2: Manual API calls with error handling
export const CreateProjectForm: React.FC = () => {
  const [formData, setFormData] = useState({
    websiteUrl: '',
    category: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await ApiService.createProject(formData);
      
      if (result.success) {
        setSuccess(true);
        setFormData({ websiteUrl: '', category: '', description: '' });
      } else {
        setError(result.error || 'Failed to create project');
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create New Project</h3>
      
      <div>
        <label>Website URL:</label>
        <input
          type="url"
          value={formData.websiteUrl}
          onChange={(e) => setFormData(prev => ({ ...prev, websiteUrl: e.target.value }))}
          required
        />
      </div>

      <div>
        <label>Category:</label>
        <input
          type="text"
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          required
        />
      </div>

      <div>
        <label>Description:</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>Project created successfully!</div>}

      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Project'}
      </button>
    </form>
  );
};

// Example 3: Dashboard data with multiple API calls
export const DashboardExample: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [dashboard, projects] = await Promise.all([
          ApiService.getDashboardData(),
          ApiService.getProjects()
        ]);

        if (dashboard.success && projects.success) {
          setDashboardData({
            dashboard: dashboard.data,
            projects: projects.data
          });
        } else {
          setError('Failed to load dashboard data');
        }
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!dashboardData) return <div>No data available</div>;

  return (
    <div>
      <h3>Dashboard</h3>
      <div>
        <h4>Projects ({dashboardData.projects?.length || 0})</h4>
        {dashboardData.projects?.map((project: any) => (
          <div key={project.id}>{project.name}</div>
        ))}
      </div>
    </div>
  );
};

// Example 4: File upload with progress
export const FileUploadExample: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress
      const interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(interval);
      setProgress(100);

      if (response.ok) {
        console.log('File uploaded successfully');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <form onSubmit={handleFileUpload}>
      <h3>File Upload</h3>
      
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        required
      />

      {uploading && (
        <div>
          <div>Uploading... {progress}%</div>
          <div style={{ width: '100%', backgroundColor: '#ddd' }}>
            <div 
              style={{ 
                width: `${progress}%`, 
                height: '20px', 
                backgroundColor: '#4CAF50' 
              }}
            />
          </div>
        </div>
      )}

      <button type="submit" disabled={uploading || !file}>
        {uploading ? 'Uploading...' : 'Upload File'}
      </button>
    </form>
  );
};

export default {
  ProjectsList,
  CreateProjectForm,
  DashboardExample,
  FileUploadExample,
};
