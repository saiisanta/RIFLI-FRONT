import React from 'react';
import { Pencil, Trash3 } from 'react-bootstrap-icons';
import './ServicesTable.scss';

const API_URL = import.meta.env.VITE_API_URL;

const ServicesTable = ({ servicios, onEdit, onDelete }) => {
  return (
    <div className="services-table-wrapper">
      <table className="services-table">
        <thead>
          <tr>
            <th>Icono</th>
            <th>Tipo</th>
            <th>Descripción corta</th>
            <th>Características</th>
            <th>Campos de cotización</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {servicios.map((s) => {
            const featuresCount = Array.isArray(s.features) ? s.features.length : 0;
            const schemeFieldsCount = (s.form_schema || s.form_scheme)?.fields?.length ?? 0;

            return (
              <tr key={s.id}>
                <td>
                  {s.icon ? (
                    <img
                      src={`${API_URL}${s.icon}`}
                      alt="Icono"
                      className="services-table-icon-img"
                    />
                  ) : (
                    <span className="services-table-empty">—</span>
                  )}
                </td>

                <td>
                  <span className="services-table-type-badge">
                    {s.type || <span className="services-table-empty">—</span>}
                  </span>
                </td>

                <td className="services-table-description">
                  {s.short_description
                    ? s.short_description.length > 60
                      ? `${s.short_description.slice(0, 60)}…`
                      : s.short_description
                    : <span className="services-table-empty">Sin descripción</span>}
                </td>

                <td>
                  <span className="services-table-count-badge">
                    {featuresCount} {featuresCount === 1 ? 'característica' : 'características'}
                  </span>
                </td>

                <td>
                  <span className={`services-table-count-badge ${schemeFieldsCount === 0 ? 'empty' : ''}`}>
                    {schemeFieldsCount} {schemeFieldsCount === 1 ? 'campo' : 'campos'}
                  </span>
                </td>

                <td>
                  <div className="services-table-actions">
                    <button
                      onClick={() => onEdit(s)}
                      className="services-table-btn-icon services-table-btn-edit"
                      title="Editar"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(s.id)}
                      className="services-table-btn-icon services-table-btn-delete"
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

export default ServicesTable;