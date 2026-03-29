import React from 'react';
import { Search } from 'react-bootstrap-icons';
import './UserFilters.scss';

const ROLES = [
  { value: '',          label: 'Todos los roles' },
  { value: 'ADMIN',     label: 'Admin' },
  { value: 'CLIENT',    label: 'Cliente' },
  { value: 'TECHNICIAN',label: 'Técnico' },
];

const VERIFIED_OPTIONS = [
  { value: '',      label: 'Verificación: todos' },
  { value: 'true',  label: 'Verificados' },
  { value: 'false', label: 'Sin verificar' },
];

const UserFilters = ({
  total,
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  verifiedFilter,
  onVerifiedFilterChange,
  addressFilter,
  onAddressFilterChange,
  users,
}) => {
  const countByRole = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});

  return (
    <header className="user-filters-header">
      <div className="user-filters-left">
        <h1>Panel de Usuarios</h1>
        <p className="user-filters-subtitle">
          {total} usuario{total !== 1 ? 's' : ''} en total
        </p>
      </div>

      <div className="user-filters-actions">

        {/* Search by name / email */}
        <div className="user-filters-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>

        {/* Search by address */}
        <div className="user-filters-search-box user-filters-search-box--address">
          <Search size={18} />
          <input
            type="text"
            placeholder="Filtrar por dirección..."
            value={addressFilter}
            onChange={e => onAddressFilterChange(e.target.value)}
          />
        </div>

        {/* Role filter */}
        <div className="user-filters-select-wrapper">
          <select
            value={roleFilter}
            onChange={e => onRoleFilterChange(e.target.value)}
          >
            {ROLES.map(r => (
              <option key={r.value} value={r.value}>
                {r.label}{r.value && countByRole[r.value] ? ` (${countByRole[r.value]})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Verified filter */}
        <div className="user-filters-select-wrapper">
          <select
            value={verifiedFilter}
            onChange={e => onVerifiedFilterChange(e.target.value)}
          >
            {VERIFIED_OPTIONS.map(v => (
              <option key={v.value} value={v.value}>{v.label}</option>
            ))}
          </select>
        </div>

      </div>
    </header>
  );
};

export default UserFilters;