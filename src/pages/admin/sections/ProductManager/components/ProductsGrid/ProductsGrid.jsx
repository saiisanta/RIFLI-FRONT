import React from 'react';
import { Pencil, Trash3 } from 'react-bootstrap-icons';
import './ProductsGrid.scss';

const ProductsGrid = ({ productos, onEdit, onDelete }) => {
  return (
    <div className="products-grid">
      {productos.map((p) => {
        const category = p.Category || p.category;
        const brand = p.Brand || p.brand;
        const hasDiscount = p.discount_percentage > 0;
        const finalPrice = hasDiscount 
          ? (p.price * (1 - p.discount_percentage / 100)).toFixed(2)
          : p.price;

        return (
          <div key={p.id} className="products-grid-card">
            <div className="products-grid-card-header">
              <span className="products-grid-badge">
                {category?.name || 'Sin categoría'}
              </span>
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
              {p.sku && <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', marginBottom: '0.5rem' }}>SKU: {p.sku}</p>}
              <p className="products-grid-marca">{brand?.name || 'Sin marca'}</p>
              <div className="products-grid-card-footer">
                <div>
                  {hasDiscount ? (
                    <>
                      <span style={{ 
                        fontSize: '1rem', 
                        textDecoration: 'line-through', 
                        opacity: 0.6,
                        display: 'block'
                      }}>
                        ${p.price}
                      </span>
                      <span className="products-grid-price">${finalPrice}</span>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        color: 'var(--admin-danger)',
                        marginLeft: '0.5rem'
                      }}>
                        -{p.discount_percentage}%
                      </span>
                    </>
                  ) : (
                    <span className="products-grid-price">${p.price}</span>
                  )}
                </div>
                <span className="products-grid-stock">Stock: {p.stock}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductsGrid;