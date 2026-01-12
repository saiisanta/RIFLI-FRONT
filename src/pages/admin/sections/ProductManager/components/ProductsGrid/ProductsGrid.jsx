import React from 'react';
import { Pencil, Trash3 } from 'react-bootstrap-icons';
import './ProductsGrid.scss';

const ProductsGrid = ({ productos, onEdit, onDelete }) => {
  return (
    <div className="products-grid">
      {productos.map((p) => (
        <div key={p.id} className="products-grid-card">
          <div className="products-grid-card-header">
            <span className="products-grid-badge">{p.categoria}</span>
            <div className="products-grid-actions">
              <button 
                onClick={() => onEdit(p)}
                className="products-grid-btn-icon products-grid-btn-edit"
                title="Editar"
              >
                <Pencil size={16} />
              </button>
              <button 
                onClick={() => onDelete(p.id)}
                className="products-grid-btn-icon products-grid-btn-delete"
                title="Eliminar"
              >
                <Trash3 size={16} />
              </button>
            </div>
          </div>
          <div className="products-grid-card-body">
            <h3>{p.name}</h3>
            <p className="products-grid-marca">{p.marca}</p>
            <div className="products-grid-card-footer">
              <span className="products-grid-price">${p.price}</span>
              <span className="products-grid-stock">Stock: {p.stock}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsGrid;