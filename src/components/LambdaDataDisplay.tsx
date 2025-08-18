import React from 'react';

interface LambdaDataDisplayProps {
  data: any;
  isVisible: boolean;
  onClose: () => void;
}

const LambdaDataDisplay: React.FC<LambdaDataDisplayProps> = ({ data, isVisible, onClose }) => {
  if (!isVisible || !data) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '800px', maxHeight: '80vh', overflow: 'auto' }}>
        <div className="modal-header">
          <h2>Website Scraped Data</h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="modal-body">
          <div style={{ marginBottom: '20px' }}>
            <h3>Basic Information</h3>
            <p><strong>URL:</strong> {data.url}</p>
            <p><strong>Title:</strong> {data.title}</p>
            <p><strong>Description:</strong> {data.description}</p>
            <p><strong>Keywords:</strong> {data.keywords}</p>
            <p><strong>Content Length:</strong> {data.content_length} characters</p>
            <p><strong>Links Count:</strong> {data.links_count}</p>
            <p><strong>Status Code:</strong> {data.status_code}</p>
            <p><strong>Scraped At:</strong> {new Date(data.scraped_at * 1000).toLocaleString()}</p>
            <p><strong>Scraper Version:</strong> {data.scraper_version}</p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3>Scraper Features Used</h3>
            <ul>
              {data.scraper_features?.map((feature: string, index: number) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3>Links Found</h3>
            <ul>
              {data.links?.map((link: string, index: number) => (
                <li key={index}>
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3>Content Preview</h3>
            <div style={{ 
              maxHeight: '200px', 
              overflow: 'auto', 
              border: '1px solid #ddd', 
              padding: '10px',
              backgroundColor: '#f9f9f9',
              fontSize: '14px',
              lineHeight: '1.4'
            }}>
              {data.content?.substring(0, 1000)}...
            </div>
          </div>

          <div className="modal-actions">
            <button className="btn-confirm" onClick={onClose}>
              Create Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LambdaDataDisplay;
