import React from 'react';
import { Pencil, Trash3 } from 'react-bootstrap-icons';
import './CategoryTable.scss';

const CategoryTable = ({ categorias, onEdit, onDelete }) => {
  return (
    <div className="category-table-wrapper">
      <table className="category-table">
        <thead>
          <tr>
            <th>Ícono</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((c) => (
            <tr key={c.id}>
              <td className="category-table-icon">
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
                  className="category-table-icon-placeholder"
                  style={{ display: c.icon ? 'none' : 'flex' }}
                >
                  {c.name?.charAt(0) || '?'}
                </div>
              </td>
              <td className="category-table-name">{c.name}</td>
              <td className="category-table-description">
                {c.description || '-'}
              </td>
              <td>
                <div className="category-table-actions">
                  <button 
                    onClick={() => onEdit(c)}
                    className="category-table-btn-icon category-table-btn-edit"
                    title="Editar"
                  >
                    <Pencil size={16} />
                  </button>
                  <button 
                    onClick={() => onDelete(c.id)}
                    className="category-table-btn-icon category-table-btn-delete"
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

export default CategoryTable;