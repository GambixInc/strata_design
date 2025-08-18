import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateProjectModal.css';
import { ApiService } from '../services/api';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (projectData: ProjectData) => void;
}

interface ProjectData {
  websiteUrl: string;
  category: string;
  description: string;
  scrapedData?: any; // Optional scraped data from lambda
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProjectData>({
    websiteUrl: '',
    category: '',
    description: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.websiteUrl.trim()) return;

    setIsLoading(true);
    try {
      console.log('Starting lambda call for URL:', formData.websiteUrl);
      // Call the lambda function to scrape the website
      const lambdaResponse = await ApiService.callLambdaScraper(formData.websiteUrl);
      
      if (lambdaResponse.success) {
        console.log('Lambda response successful:', lambdaResponse);
        console.log('Scraped data to pass:', lambdaResponse.data);
        
        // Navigate to the lambda results page with the scraped data
        navigate('/lambda-results', { 
          state: { scrapedData: lambdaResponse.data } 
        });
        
        // Reset form and close modal
        setFormData({
          websiteUrl: '',
          category: '',
          description: ''
        });
        onClose();
      } else {
        throw new Error('Failed to scrape website data');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        type: error?.constructor?.name || 'Unknown type'
      });
      // You might want to show an error message to the user here
      alert('Error scraping website. Please check the URL and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      websiteUrl: '',
      category: '',
      description: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-icon">
            <i className="fas fa-folder-plus"></i>
          </div>
          <button className="modal-close" onClick={handleCancel}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body">
          <h2>Create a new project</h2>
          <p className="modal-description">Enter your product information below</p>

          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="websiteUrl">Website Url</label>
              <input
                type="url"
                id="websiteUrl"
                name="websiteUrl"
                value={formData.websiteUrl}
                onChange={handleInputChange}
                placeholder="e.g. website.com"
                required
              />
            </div>

            {/* <div className="form-field">
              <label htmlFor="category">Website Category</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="e.g. Health Tech"
              />
            </div> */}

            {/* <div className="form-field">
              <label htmlFor="description">About Website</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Write a brief information about your website and goal"
                rows={4}
              />
            </div> */}

            <div className="modal-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-confirm"
                disabled={isLoading || !formData.websiteUrl.trim()}
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Processing...
                  </>
                ) : (
                  'Confirm'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal; 