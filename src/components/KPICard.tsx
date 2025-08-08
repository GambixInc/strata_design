import React from 'react';

interface KPICardProps {
  title: string;
  value: string;
  trend: {
    value: string;
    isPositive: boolean;
  };
}

const KPICard: React.FC<KPICardProps> = ({ title, value, trend }) => {
  return (
    <div className="kpi-card">
      <div className="kpi-header">
        <h3>{title}</h3>
        <div className={`kpi-trend ${trend.isPositive ? 'positive' : 'negative'}`}>
          <i className={`fas fa-arrow-${trend.isPositive ? 'up' : 'down'}`}></i>
          <span>{trend.value}</span>
        </div>
      </div>
      <div className="kpi-value">{value}</div>
    </div>
  );
};

export default KPICard;
