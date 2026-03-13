import React from 'react';
import { Search, Grid3x3Gap, ListUl } from 'react-bootstrap-icons';
import './ServicesHeader.scss';

const ServicesHeader = ({
  totalServices,
  searchTerm,
  onSearchChange,
  vistaGrid,
  onViewChange,
}) => {
  return (
    <header className="service-header">
      <div className="service-header-left">
        <h1>Panel de Servicios</h1>
        <p className="service-header-subtitle">
          {totalServices} servicio{totalServices !== 1 ? 's' : ''} en total
        </p>
      </div>

      <div className="service-header-actions">
        <div className="service-header-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar servicios..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="service-header-view-toggle">
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

export default ServicesHeader;