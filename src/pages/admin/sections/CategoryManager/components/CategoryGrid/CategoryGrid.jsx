import React from 'react';
import { Pencil, Trash3 } from 'react-bootstrap-icons';
import './CategoryGrid.scss';

const CategoryGrid = ({ categorias, onEdit, onDelete }) => {
  return (
    <div className="category-grid">
      {categorias.map((c) => (
        <div key={c.id} className="category-grid-card">
          <div className="category-grid-card-header">
            <div className="category-grid-icon">
              {c.icon ? (
                <img 
                  src={`http://localhost:4001${c.icon}`} 
                  alt={c.name}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="category-grid-icon-placeholder"
                style={{ display: c.icon ? 'none' : 'flex' }}
              >
                {c.name?.charAt(0) || '?'}
              </div>
            </div>
            <div className="category-grid-actions">
              <button 
                onClick={() => onEdit(c)}
                className="category-grid-btn-icon category-grid-btn-edit"
                title="Editar"
              >
                <Pencil size={16} />
              </button>
              <button 
                onClick={() => onDelete(c.id)}
                className="category-grid-btn-icon category-grid-btn-delete"
                title="Eliminar"
              >
                <Trash3 size={16} />
              </button>
            </div>
          </div>
          <div className="category-grid-card-body">
            <h3>{c.name}</h3>
            <p className="category-grid-description">
              {c.description || 'Sin descripción'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryGrid;