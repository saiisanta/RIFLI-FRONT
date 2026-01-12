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
            <th>Marca</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td className="products-table-name">{p.name}</td>
              <td>{p.marca}</td>
              <td className="products-table-price">${p.price}</td>
              <td>
                <span className="products-table-badge">{p.categoria}</span>
              </td>
              <td>
                <span className={`products-table-stock ${p.stock < 10 ? 'low' : ''}`}>
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTable;