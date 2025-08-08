import React from 'react';

interface Website {
  id: string;
  url: string;
  icon: string;
  status: string;
  healthScore: number;
  recommendations: number;
  autoOptimize: boolean;
  lastUpdated: string;
}

interface SitesTableProps {
  websites: Website[];
  onViewResults: (website: Website) => void;
  onEdit: (website: Website) => void;
  onDelete: (website: Website) => void;
  onToggleAutoOptimize: (website: Website) => void;
}

const SitesTable: React.FC<SitesTableProps> = ({
  websites,
  onViewResults,
  onEdit,
  onDelete,
  onToggleAutoOptimize
}) => {
  return (
    <div className="sites-table-container">
      <div className="table-header">
        <h2 className="table-title">Your Websites</h2>
        <div className="table-actions">
          <button className="table-action-btn">
            <i className="fas fa-filter"></i>
            Filter
          </button>
          <button className="table-action-btn">
            <i className="fas fa-download"></i>
            Export
          </button>
        </div>
      </div>
      <table className="sites-table">
        <thead>
          <tr>
            <th>Website</th>
            <th>Site Health</th>
            <th>Recommendations</th>
            <th>Auto-Optimize</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {websites.map((website) => (
            <tr key={website.id}>
              <td>
                <div className="website-info">
                  <div className="website-icon">
                    <i className={website.icon}></i>
                  </div>
                  <div className="website-details">
                    <span className="website-url">{website.url}</span>
                    <span className={`website-status ${website.status === 'Needs Attention' ? 'status-warning' : ''}`}>
                      {website.status}
                    </span>
                  </div>
                </div>
              </td>
              <td>
                <div className="health-score">
                  <span className={`score ${website.healthScore < 70 ? 'score-warning' : ''}`}>
                    {website.healthScore}%
                  </span>
                  <div className="health-bar">
                    <div 
                      className={`health-fill ${website.healthScore < 70 ? 'health-fill-warning' : ''}`} 
                      style={{width: `${website.healthScore}%`}}
                    ></div>
                  </div>
                </div>
              </td>
              <td>
                <span className={`recommendations-count ${website.recommendations > 50 ? 'recommendations-warning' : ''}`}>
                  {website.recommendations}
                </span>
              </td>
              <td>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={website.autoOptimize}
                    onChange={() => onToggleAutoOptimize(website)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </td>
              <td>
                <div className="action-buttons">
                  <button className="action-btn view-btn" onClick={() => onViewResults(website)}>
                    View Results
                  </button>
                  <button className="action-btn delete-btn" onClick={() => onDelete(website)} title="Delete">
                    <i className="fas fa-trash"></i>
                  </button>
                  <button className="action-btn edit-btn" onClick={() => onEdit(website)} title="Edit">
                    <i className="fas fa-pencil-alt"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SitesTable;
