import React from 'react';
import { Search, Grid3x3Gap, ListUl } from 'react-bootstrap-icons';
import './BrandHeader.scss';

const BrandHeader = ({ 
  totalBrands, 
  searchTerm, 
  onSearchChange, 
  vistaGrid, 
  onViewChange 
}) => {
  return (
    <header className="brand-header">
      <div className="brand-header-left">
        <h1>Panel de Marcas</h1>
        <p className="brand-header-subtitle">
          {totalBrands} marca{totalBrands !== 1 ? 's' : ''} en total
        </p>
      </div>
      
      <div className="brand-header-actions">
        <div className="brand-header-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar marcas..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <div className="brand-header-view-toggle">
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

export default BrandHeader;