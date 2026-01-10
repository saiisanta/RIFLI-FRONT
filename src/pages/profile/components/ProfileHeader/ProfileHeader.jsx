import React from 'react';
import { FiUser, FiEdit3 } from 'react-icons/fi';
import './ProfileHeader.scss';

const ProfileHeader = ({ profile, onEditProfile }) => {
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadge = (role) => {
    const badges = {
      ADMIN: { label: 'Administrador', className: 'role-admin' },
      TECNICO: { label: 'Técnico', className: 'role-tecnico' },
      CLIENTE: { label: 'Cliente', className: 'role-cliente' }
    };
    return badges[role] || badges.CLIENTE;
  };

  const roleBadge = getRoleBadge(profile?.role);

  return (
    <div className="profile-header-card">
      <div className="profile-header-bg"></div>
      
      <div className="profile-header-content">
        <div className="profile-avatar-section">
          <div className="profile-avatar">
            {profile?.avatar ? (
              <img src={profile.avatar} alt={profile.name} />
            ) : (
              <div className="profile-avatar-placeholder">
                <FiUser />
              </div>
            )}
          </div>
          
          <div className="profile-avatar-initials">
            {getInitials(profile?.name)}
          </div>
        </div>

        <div className="profile-header-info">
          <div className="profile-header-top">
            <div className="profile-name-section">
              <h1 className="profile-name">{profile?.name || 'Sin nombre'}</h1>
              <span className={`profile-role-badge ${roleBadge.className}`}>
                {roleBadge.label}
              </span>
            </div>
            
            <button onClick={onEditProfile} className="profile-edit-btn">
              <FiEdit3 />
              <span>Editar Perfil</span>
            </button>
          </div>

          <p className="profile-email">{profile?.email}</p>
          
          {profile?.lastLogin && (
            <p className="profile-last-login">
              Último acceso: {new Date(profile.lastLogin).toLocaleDateString('es-AR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;