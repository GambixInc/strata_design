import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import './CreateProjectModal.css';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (projectData: ProjectData) => void;
}

interface ProjectData {
  websiteUrl: string;
  category: string;
  description: string;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
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
      await onConfirm(formData);
      // Reset form after successful submission
      setFormData({
        websiteUrl: '',
        category: '',
        description: ''
      });
      onClose();
    } catch (error) {
      console.error('Error creating project:', error);
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

            <div className="form-field">
              <label htmlFor="category">Website Category</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="e.g. Health Tech"
              />
            </div>

            <div className="form-field">
              <label htmlFor="description">About Website</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Write a brief information about your website and goal"
                rows={4}
              />
            </div>

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