import React, { useState } from 'react';
import { X, ShieldFill, PersonFill, Tools } from 'react-bootstrap-icons';
import './UserForm.scss';

const ROLES = [
  {
    value: 'CLIENT',
    label: 'Cliente',
    description: 'Puede solicitar presupuestos y gestionar sus pedidos.',
    Icon: PersonFill,
    cls: 'blue',
  },
  {
    value: 'TECHNICIAN',
    label: 'Técnico',
    description: 'Puede ser asignado a trabajos y ver las órdenes activas.',
    Icon: Tools,
    cls: 'orange',
  },
  {
    value: 'ADMIN',
    label: 'Administrador',
    description: 'Acceso completo al panel de administración.',
    Icon: ShieldFill,
    cls: 'yellow',
  },
];

const UserForm = ({ user, onClose, onSave, loading }) => {
  const [selectedRole, setSelectedRole] = useState(user.role);

  const fullName = `${user.first_name} ${user.last_name}`;
  const hasChanged = selectedRole !== user.role;

  const handleSave = () => {
    if (!hasChanged) return;
    onSave(user.id, selectedRole);
  };

  return (
    <div className="uf-overlay" onClick={onClose}>
      <div className="uf-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="uf-header">
          <div className="uf-header-left">
            <h2>Cambiar rol</h2>
            <p className="uf-header-sub">{fullName}</p>
          </div>
          <button className="uf-close-btn" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        {/* Role selector */}
        <div className="uf-body">
          <p className="uf-body-label">Seleccioná el nuevo rol para este usuario:</p>

          <div className="uf-role-options">
            {ROLES.map(role => {
              const { Icon } = role;
              const isSelected = selectedRole === role.value;
              const isCurrent  = user.role === role.value;
              return (
                <button
                  key={role.value}
                  type="button"
                  className={`uf-role-option uf-role-option--${role.cls} ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedRole(role.value)}
                >
                  <div className="uf-role-icon">
                    <Icon size={20} />
                  </div>
                  <div className="uf-role-info">
                    <div className="uf-role-name">
                      {role.label}
                      {isCurrent && <span className="uf-current-tag">actual</span>}
                    </div>
                    <p className="uf-role-desc">{role.description}</p>
                  </div>
                  <div className="uf-role-check" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="uf-footer">
          <button className="uf-btn-cancel" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button
            className="uf-btn-save"
            onClick={handleSave}
            disabled={!hasChanged || loading}
          >
            {loading ? 'Guardando...' : 'Guardar cambio'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default UserForm;