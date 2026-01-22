import React from 'react';
import { Search, Grid3x3Gap, ListUl } from 'react-bootstrap-icons';
import './CategoryHeader.scss';

const CategoryHeader = ({ 
  totalCategories, 
  searchTerm, 
  onSearchChange, 
  vistaGrid, 
  onViewChange 
}) => {
  return (
    <header className="category-header">
      <div className="category-header-left">
        <h1>Panel de Categorías</h1>
        <p className="category-header-subtitle">
          {totalCategories} categoría{totalCategories !== 1 ? 's' : ''} en total
        </p>
      </div>
      
      <div className="category-header-actions">
        <div className="category-header-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar categorías..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <div className="category-header-view-toggle">
          <button 
            className={!vistaGrid ? 'active' : ''}
            onClick={() => onViewChange(false)}
            title="Vista de lista"
          >
            <ListUl size={18} />
          </button>
          <button 
            className={vistaGrid ? 'active' : ''}
            onClick={() => onViewChange(true)}
            title="Vista de cuadrícula"
          >
            <Grid3x3Gap size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default CategoryHeader;