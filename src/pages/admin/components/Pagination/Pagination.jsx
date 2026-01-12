import React from 'react';
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons';
import './Pagination.scss';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    onPageChange(Math.max(currentPage - 1, 1));
  };

  const handleNext = () => {
    onPageChange(Math.min(currentPage + 1, totalPages));
  };

  return (
    <div className="admin-pagination">
      <button 
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="admin-pagination-btn"
      >
        <ChevronLeft size={18} />
        Anterior
      </button>
      
      <div className="admin-pagination-info">
        Página {currentPage} de {totalPages}
      </div>

      <button 
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="admin-pagination-btn"
      >
        Siguiente
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;