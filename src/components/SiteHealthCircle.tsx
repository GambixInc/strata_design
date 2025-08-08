import React from 'react';

interface SiteHealthCircleProps {
  percentage: number;
  label: string;
}

const SiteHealthCircle: React.FC<SiteHealthCircleProps> = ({ percentage, label }) => {
  return (
    <div className="site-health-card">
      <div className="health-circle">
        <div 
          className="health-progress" 
          style={{ '--progress': `${percentage}%` } as React.CSSProperties}
        >
          <div className="health-circle-inner">
            <span className="health-percentage">{percentage}%</span>
            <span className="health-label">{label}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteHealthCircle;
