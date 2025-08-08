import React from 'react';

interface PageStatus {
  type: 'healthy' | 'broken' | 'issues';
  count: number;
  label: string;
}

interface CrawledPagesSummaryProps {
  pageStatuses: PageStatus[];
}

const CrawledPagesSummary: React.FC<CrawledPagesSummaryProps> = ({ pageStatuses }) => {
  return (
    <div className="crawled-pages-section">
      <h2>Crawled Pages</h2>
      <div className="pages-summary">
        {pageStatuses.map((status, index) => (
          <div key={index} className="page-status">
            <div className={`status-indicator ${status.type}`}></div>
            <span>{status.label} {status.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CrawledPagesSummary;
