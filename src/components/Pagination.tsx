import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="pagination">
      <div className="pagination-left">
        <span className="pagination-summary">
          Showing {startItem}-{endItem} of {totalItems} results
        </span>
      </div>
      
      <div className="pagination-center">
        <button 
          className="pagination-btn" 
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        
        <div className="page-numbers">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`page-number ${page === currentPage ? 'active' : ''}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>
        
        <button 
          className="pagination-btn" 
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
      
      <div className="pagination-right">
        <div className="page-size-selector">
          <span className="page-size-label">Show:</span>
          <select 
            className="page-size-select"
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="page-size-suffix">per page</span>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
