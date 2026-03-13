import React from 'react';
import { Pencil, Trash3, CheckCircle } from 'react-bootstrap-icons';
import './ServicesGrid.scss';

const ServicesGrid = ({ servicios, onEdit, onDelete }) => {
  return (
    <div className="services-grid">
      {servicios.map((s) => {
        const featuresCount = Array.isArray(s.features) ? s.features.length : 0;
        const schemeFieldsCount = (s.form_schema || s.form_scheme)?.fields?.length ?? 0;
        const features = Array.isArray(s.features) ? s.features : [];

        return (
          <div key={s.id} className="services-grid-card">
            <div className="services-grid-card-header">
              <span className="services-grid-type-badge">
                {s.type || '—'}
              </span>
              <div className="services-grid-actions">
                <button
                  onClick={() => onEdit(s)}
                  className="services-grid-btn-icon services-grid-btn-edit"
                  title="Editar"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => onDelete(s.id)}
                  className="services-grid-btn-icon services-grid-btn-delete"
                  title="Eliminar"
                >
                  <Trash3 size={16} />
                </button>
              </div>
            </div>

            <div className="services-grid-card-body">
              {s.icon && (
                <img
                  src={`http://localhost:4001${s.icon}`}
                  alt="Icono del servicio"
                  className="services-grid-icon-img"
                />
              )}

              <p className="services-grid-description">
                {s.short_description || (
                  <span className="services-grid-empty">Sin descripción</span>
                )}
              </p>

              {features.length > 0 && (
                <ul className="services-grid-features">
                  {features.slice(0, 3).map((feat, i) => (
                    <li key={i}>
                      <CheckCircle size={13} />
                      {feat}
                    </li>
                  ))}
                  {features.length > 3 && (
                    <li className="services-grid-features-more">
                      +{features.length - 3} más
                    </li>
                  )}
                </ul>
              )}
            </div>

            <div className="services-grid-card-footer">
              <span className="services-grid-stat">
                {featuresCount} {featuresCount === 1 ? 'característica' : 'características'}
              </span>
              <span className={`services-grid-stat ${schemeFieldsCount === 0 ? 'empty' : ''}`}>
                {schemeFieldsCount} {schemeFieldsCount === 1 ? 'campo' : 'campos'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ServicesGrid;