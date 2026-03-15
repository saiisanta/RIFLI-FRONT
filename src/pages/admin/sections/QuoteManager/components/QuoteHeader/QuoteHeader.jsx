import React from 'react';
import { Search } from 'react-bootstrap-icons';
import './QuoteHeader.scss';

const STATUSES = [
  { value: '',            label: 'Todos' },
  { value: 'PENDING',     label: 'Pendiente' },
  { value: 'QUOTED',      label: 'Presupuestado' },
  { value: 'ACCEPTED',    label: 'Aceptado' },
  { value: 'REJECTED',    label: 'Rechazado' },
  { value: 'IN_PROGRESS', label: 'En progreso' },
  { value: 'COMPLETED',   label: 'Completado' },
  { value: 'CANCELLED',   label: 'Cancelado' },
];

const QuoteHeader = ({
  total,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  quotes,
}) => {
  // Count per status for the badges
  const countByStatus = quotes.reduce((acc, q) => {
    acc[q.status] = (acc[q.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <header className="quote-header">
      <div className="quote-header-left">
        <h1>Panel de Cotizaciones</h1>
        <p className="quote-header-subtitle">
          {total} cotizaci{total !== 1 ? 'ones' : 'ón'} en total
        </p>
      </div>

      <div className="quote-header-actions">
        <div className="quote-header-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar por número, cliente o servicio..."
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>

        <div className="quote-header-status-filter">
          <select
            value={statusFilter}
            onChange={e => onStatusFilterChange(e.target.value)}
          >
            {STATUSES.map(s => (
              <option key={s.value} value={s.value}>
                {s.label}{s.value && countByStatus[s.value] ? ` (${countByStatus[s.value]})` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};

export default QuoteHeader;