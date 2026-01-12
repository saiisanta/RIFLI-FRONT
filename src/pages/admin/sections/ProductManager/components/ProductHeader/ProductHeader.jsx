import React from 'react';
import { Search, Grid3x3Gap, ListUl } from 'react-bootstrap-icons';
import './ProductHeader.scss';

const ProductHeader = ({ 
  totalProducts, 
  searchTerm, 
  onSearchChange, 
  vistaGrid, 
  onViewChange 
}) => {
  return (
    <header className="product-header">
      <div className="product-header-left">
        <h1>Panel de Productos</h1>
        <p className="product-header-subtitle">
          {totalProducts} producto{totalProducts !== 1 ? 's' : ''} en total
        </p>
      </div>
      
      <div className="product-header-actions">
        <div className="product-header-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <div className="product-header-view-toggle">
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

export default ProductHeader;