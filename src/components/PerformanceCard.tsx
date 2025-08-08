import React from 'react';

interface PerformanceCardProps {
  title: string;
  score: number;
  onViewRecommendation: () => void;
}

const PerformanceCard: React.FC<PerformanceCardProps> = ({ title, score, onViewRecommendation }) => {
  return (
    <div className="performance-card">
      <div className="performance-score">
        <div 
          className="score-circle" 
          style={{ '--score': `${score}%` } as React.CSSProperties}
        >
          <span>{score}%</span>
        </div>
      </div>
      <h3>{title}</h3>
      <button className="view-recommendation-btn" onClick={onViewRecommendation}>
        View Recommendation
      </button>
    </div>
  );
};

export default PerformanceCard;
