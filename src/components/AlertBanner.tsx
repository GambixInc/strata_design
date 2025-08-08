import React from 'react';

interface AlertBannerProps {
  title: string;
  description: string;
  time: string;
  priority: string;
  progress: number;
  onViewResults: () => void;
  onDismiss: () => void;
  onClose: () => void;
}

const AlertBanner: React.FC<AlertBannerProps> = ({
  title,
  description,
  time,
  priority,
  progress,
  onViewResults,
  onDismiss,
  onClose
}) => {
  return (
    <div className="alert-banner">
      <div className="alert-content">
        <div className="alert-icon">
          <i className="fas fa-exclamation-triangle"></i>
        </div>
        <div className="alert-text">
          <h3 className="alert-title">{title}</h3>
          <p className="alert-description">{description}</p>
          <div className="alert-meta">
            <span className="alert-time">{time}</span>
            <span className="alert-priority">{priority}</span>
          </div>
        </div>
        <div className="alert-actions">
          <button className="alert-btn primary" onClick={onViewResults}>View Results</button>
          <button className="alert-btn secondary" onClick={onDismiss}>Dismiss</button>
          <button className="alert-dismiss" onClick={onClose} aria-label="Close alert">
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>
      <div className="alert-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{width: `${progress}%`}}></div>
        </div>
        <span className="progress-text">{progress}% Site Health</span>
      </div>
    </div>
  );
};

export default AlertBanner;
