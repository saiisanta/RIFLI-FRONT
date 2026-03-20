import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  PersonFill,
  ShieldFill,
  Tools,
  Pencil,
  Trash3,
  CheckCircleFill,
  XCircleFill,
  GeoAltFill,
  EnvelopeFill,
  PhoneFill,
  PersonBadgeFill,
} from 'react-bootstrap-icons';
import './UserTable.scss';

const API_URL = import.meta.env.VITE_API_URL;

const ROLE_CONFIG = {
  ADMIN:      { label: 'Admin',    cls: 'yellow', Icon: ShieldFill },
  CLIENT:     { label: 'Cliente',  cls: 'blue',   Icon: PersonFill },
  TECHNICIAN: { label: 'Técnico',  cls: 'orange', Icon: Tools },
};

const RoleBadge = ({ role }) => {
  const cfg = ROLE_CONFIG[role] || { label: role, cls: 'gray', Icon: PersonFill };
  const { Icon } = cfg;
  return (
    <span className={`ut-role-badge ut-role--${cfg.cls}`}>
      <Icon size={11} />
      {cfg.label}
    </span>
  );
};

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';

// ── Expandable user row ───────────────────────────────────────

const UserRow = ({ user, onChangeRole, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const fullName = `${user.first_name} ${user.last_name}`;
  const addresses = user.addresses || [];

  return (
    <>
      <tr
        className={`ut-row ${expanded ? 'expanded' : ''}`}
        onClick={() => setExpanded(!expanded)}
      >
        {/* Avatar + nombre */}
        <td>
          <div className="ut-user-cell">
            <div className="ut-avatar">
              {user.avatar_url ? (
                <img src={`${API_URL}${user.avatar_url}`} alt={fullName} />
              ) : (
                <span className="ut-avatar-initials">
                  {user.first_name?.[0]}{user.last_name?.[0]}
                </span>
              )}
            </div>
            <div className="ut-user-info">
              <span className="ut-user-name">{fullName}</span>
              <span className="ut-user-email">{user.email}</span>
            </div>
          </div>
        </td>

        {/* Rol */}
        <td><RoleBadge role={user.role} /></td>

        {/* Verificado */}
        <td>
          {user.is_verified
            ? <span className="ut-verified ut-verified--yes"><CheckCircleFill size={14} /> Verificado</span>
            : <span className="ut-verified ut-verified--no"><XCircleFill size={14} /> Sin verificar</span>
          }
        </td>

        {/* Fecha */}
        <td className="ut-date">{formatDate(user.createdAt)}</td>

        {/* Acciones */}
        <td onClick={e => e.stopPropagation()}>
          <div className="ut-actions">
            <button
              className="ut-btn-icon ut-btn-role"
              onClick={() => onChangeRole(user)}
              title="Cambiar rol"
            >
              <Pencil size={14} />
            </button>
            <button
              className="ut-btn-icon ut-btn-delete"
              onClick={() => onDelete(user.id, fullName)}
              title="Eliminar usuario"
            >
              <Trash3 size={14} />
            </button>
          </div>
        </td>

        {/* Expand toggle */}
        <td className="ut-expand-cell">
          <button className="ut-expand-btn" type="button" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </td>
      </tr>

      {/* ── Expanded panel ── */}
      {expanded && (
        <tr className="ut-detail-row">
          <td colSpan={6}>
            <div className="ut-detail-panel">

              {/* Contact info */}
              <div className="ut-detail-group">
                <div className="ut-detail-group-title">Información de contacto</div>
                <div className="ut-detail-grid">
                  <div className="ut-detail-item">
                    <EnvelopeFill size={13} />
                    <div>
                      <span className="ut-detail-label">Email</span>
                      <span className="ut-detail-val">{user.email}</span>
                    </div>
                  </div>
                  {user.phone && (
                    <div className="ut-detail-item">
                      <PhoneFill size={13} />
                      <div>
                        <span className="ut-detail-label">Teléfono</span>
                        <span className="ut-detail-val">{user.phone}</span>
                      </div>
                    </div>
                  )}
                  {user.document_number && (
                    <div className="ut-detail-item">
                      <PersonBadgeFill size={13} />
                      <div>
                        <span className="ut-detail-label">
                          {user.document_type || 'Documento'}
                        </span>
                        <span className="ut-detail-val">{user.document_number}</span>
                      </div>
                    </div>
                  )}
                  <div className="ut-detail-item">
                    <PersonFill size={13} />
                    <div>
                      <span className="ut-detail-label">Usuario desde</span>
                      <span className="ut-detail-val">{formatDate(user.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Addresses */}
              {addresses.length > 0 && (
                <div className="ut-detail-group">
                  <div className="ut-detail-group-title">
                    Direcciones ({addresses.length})
                  </div>
                  <div className="ut-addresses">
                    {addresses.map(addr => (
                      <div key={addr.id} className={`ut-address-chip ${addr.is_default ? 'default' : ''}`}>
                        <GeoAltFill size={12} />
                        <span>
                          {addr.street} — {addr.city}, {addr.province}
                          {addr.is_default && <em> (principal)</em>}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </td>
        </tr>
      )}
    </>
  );
};

// ── Main table ────────────────────────────────────────────────

const UserTable = ({ users, loading, onChangeRole, onDelete }) => {
  if (!loading && users.length === 0) {
    return (
      <div className="ut-empty">
        <PersonFill size={40} />
        <p>No hay usuarios que coincidan con los filtros aplicados.</p>
      </div>
    );
  }

  return (
    <div className="ut-wrapper">
      <table className="ut-table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Registrado</th>
            <th>Acciones</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <UserRow
              key={user.id}
              user={user}
              onChangeRole={onChangeRole}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;