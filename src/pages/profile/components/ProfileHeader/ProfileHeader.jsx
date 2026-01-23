import React from "react";
import { FiUser, FiEdit3 } from "react-icons/fi";
import "./ProfileHeader.scss";

const ProfileHeader = ({ profile, onEditProfile }) => {
  const getInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return "U";
    const firstInitial = firstName ? firstName[0] : "";
    const lastInitial = lastName ? lastName[0] : "";
    return (firstInitial + lastInitial).toUpperCase() || "U";
  };

  const getRoleBadge = (role) => {
    const badges = {
      ADMIN: { label: "Administrador", className: "role-admin" },
      TECHNICIAN: { label: "Técnico", className: "role-technician" },
      CLIENT: { label: "Cliente", className: "role-client" },
    };
    return badges[role] || badges.CLIENT;
  };

  const roleBadge = getRoleBadge(profile?.role);

  return (
    <div className="profile-header-card">
      <div className="profile-header-bg"></div>

      <div className="profile-header-content">
        <div className="profile-avatar-section">
          <div className="profile-avatar">
            {profile?.avatar_url ? (
              <img
                src={`http://localhost:4001${profile.avatar_url}`}
                alt={`${profile.first_name} ${profile.last_name}`}
                onError={(e) => {
                  console.error('Error cargando avatar:', profile.avatar_url);
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className="profile-avatar-placeholder"
              style={{ display: profile?.avatar_url ? 'none' : 'flex' }}
            >
              <FiUser />
            </div>
          </div>

          <div className="profile-avatar-initials">
            {getInitials(profile?.first_name, profile?.last_name)}
          </div>
        </div>

        <div className="profile-header-info">
          <div className="profile-header-top">
            <div className="profile-name-section">
              <h1 className="profile-name">
                {profile?.first_name} {profile?.last_name}
              </h1>
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

          {profile?.last_login_at && (
            <p className="profile-last-login">
              Último acceso:{" "}
              {new Date(profile.last_login_at).toLocaleDateString("es-AR", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;