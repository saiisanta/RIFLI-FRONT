import React from 'react';
import { Pencil, Trash3 } from 'react-bootstrap-icons';
import './ProductsTable.scss';

const ProductsTable = ({ productos, onEdit, onDelete }) => {
  return (
    <div className="products-table-wrapper">
      <table className="products-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>SKU</th>
            <th>Marca</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => {
            const category = p.Category || p.category;
            const brand = p.Brand || p.brand;
            const hasDiscount = p.discount_percentage > 0;
            const finalPrice = hasDiscount 
              ? (p.price * (1 - p.discount_percentage / 100)).toFixed(2)
              : p.price;

            return (
              <tr key={p.id}>
                <td className="products-table-name">{p.name}</td>
                <td>{p.sku || '-'}</td>
                <td>{brand?.name || 'Sin marca'}</td>
                <td className="products-table-price">
                  {hasDiscount ? (
                    <>
                      <span style={{ textDecoration: 'line-through', fontSize: '0.85em', opacity: 0.6 }}>
                        ${p.price}
                      </span>{' '}
                      ${finalPrice}
                    </>
                  ) : (
                    `$${p.price}`
                  )}
                </td>
                <td>
                  <span className="products-table-badge">
                    {category?.name || 'Sin categoría'}
                  </span>
                </td>
                <td>
                  <span className={`products-table-stock ${p.stock <= (p.min_stock || 5) ? 'low' : ''}`}>
                    {p.stock}
                  </span>
                </td>
                <td>
                  <div className="products-table-actions">
                    <button 
                      onClick={() => onEdit(p)}
                      className="products-table-btn-icon products-table-btn-edit"
                      title="Editar"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete(p.id)}
                      className="products-table-btn-icon products-table-btn-delete"
                      title="Eliminar"
                    >
                      <Trash3 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTable;