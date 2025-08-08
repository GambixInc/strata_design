import React from 'react';
import './RecommendationDetail.css';

interface RecommendationDetailProps {
  category: string;
  issue: string;
  recommendation: string;
  guidelines: string[];
  onAcceptRecommendations: () => void;
  onViewAndEdit: () => void;
  onBack: () => void;
  currentIssue: number;
  totalIssues: number;
  onPrevious: () => void;
  onNext: () => void;
  optimizationProgress: number;
  optimizedIssues: number;
}

const RecommendationDetail: React.FC<RecommendationDetailProps> = ({
  category,
  issue,
  recommendation,
  guidelines,
  onAcceptRecommendations,
  onViewAndEdit,
  onBack,
  currentIssue,
  totalIssues,
  onPrevious,
  onNext,
  optimizationProgress,
  optimizedIssues
}) => {
  return (
    <div className="recommendation-detail-page">
      {/* Header */}
      <header className="recommendation-header">
        <div className="recommendation-header-left">
          <button className="back-btn" onClick={onBack}>
            <i className="fas fa-arrow-left"></i>
            Dashboard
          </button>
          <div className="recommendation-title">
            <h1>Auto Optimize</h1>
            <p>{category}</p>
          </div>
        </div>
        <div className="recommendation-header-right">
          <div className="user-profile">
            <img 
              src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face" 
              alt="Profile" 
              className="profile-image"
            />
            <span className="profile-name">Olivia Rhye</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="recommendation-content">
        {/* Recommendation Card */}
        <div className="recommendation-card">
          <div className="recommendation-card-header">
            <h2>Home Page</h2>
            <div className="issue-navigation">
              <button 
                className="nav-btn" 
                onClick={onPrevious}
                disabled={currentIssue === 1}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <span className="issue-counter">{currentIssue} of {totalIssues}</span>
              <button 
                className="nav-btn" 
                onClick={onNext}
                disabled={currentIssue === totalIssues}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>

          <div className="recommendation-sections">
            {/* Issue Section */}
            <div className="issue-section">
              <h3>Issue</h3>
              <p>{issue}</p>
            </div>

            {/* Recommendation Section */}
            <div className="recommendation-section">
              <h3>Recommendation</h3>
              <p>{recommendation}</p>
              
              {guidelines.length > 0 && (
                <div className="guidelines">
                  <ul>
                    {guidelines.map((guideline, index) => (
                      <li key={index}>{guideline}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="recommendation-actions">
            <button className="action-btn secondary" onClick={onAcceptRecommendations}>
              Accept Recommendations
            </button>
            <button className="action-btn primary" onClick={onViewAndEdit}>
              View & Edit
            </button>
          </div>
        </div>

        {/* Optimization Status */}
        <div className="optimization-status">
          <div className="optimization-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${optimizationProgress}%` }}
              ></div>
            </div>
            <span className="progress-text">Applying optimizations...</span>
          </div>
          
          <div className="optimization-summary">
            <div className="summary-card">
              <i className="fas fa-cog"></i>
              <span>{optimizedIssues} issues auto-optimized</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationDetail;
