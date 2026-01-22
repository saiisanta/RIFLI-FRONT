import React from 'react';
import { Pencil, Trash3 } from 'react-bootstrap-icons';
import './BrandTable.scss';

const BrandTable = ({ marcas, onEdit, onDelete }) => {
  return (
    <div className="brand-table-wrapper">
      <table className="brand-table">
        <thead>
          <tr>
            <th>Logo</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {marcas.map((b) => (
            <tr key={b.id}>
              <td className="brand-table-logo">
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
                  className="brand-table-logo-placeholder"
                  style={{ display: b.logo_url ? 'none' : 'flex' }}
                >
                  {b.name?.charAt(0) || '?'}
                </div>
              </td>
              <td className="brand-table-name">{b.name}</td>
              <td>
                <div className="brand-table-actions">
                  <button 
                    onClick={() => onEdit(b)}
                    className="brand-table-btn-icon brand-table-btn-edit"
                    title="Editar"
                  >
                    <Pencil size={16} />
                  </button>
                  <button 
                    onClick={() => onDelete(b.id)}
                    className="brand-table-btn-icon brand-table-btn-delete"
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

export default BrandTable;