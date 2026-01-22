import React from 'react';
import { Pencil, Trash3 } from 'react-bootstrap-icons';
import './BrandGrid.scss';

const BrandGrid = ({ marcas, onEdit, onDelete }) => {
  return (
    <div className="brand-grid">
      {marcas.map((b) => (
        <div key={b.id} className="brand-grid-card">
          <div className="brand-grid-card-header">
            <div className="brand-grid-logo">
              {b.logo_url ? (
                <img 
                  src={`http://localhost:4001${b.logo_url}`} 
                  alt={b.name}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="brand-grid-logo-placeholder"
                style={{ display: b.logo_url ? 'none' : 'flex' }}
              >
                {b.name?.charAt(0) || '?'}
              </div>
            </div>
            <div className="brand-grid-actions">
              <button 
                onClick={() => onEdit(b)}
                className="brand-grid-btn-icon brand-grid-btn-edit"
                title="Editar"
              >
                <Pencil size={16} />
              </button>
              <button 
                onClick={() => onDelete(b.id)}
                className="brand-grid-btn-icon brand-grid-btn-delete"
                title="Eliminar"
              >
                <Trash3 size={16} />
              </button>
            </div>
          </div>
          <div className="brand-grid-card-body">
            <h3>{b.name}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BrandGrid;