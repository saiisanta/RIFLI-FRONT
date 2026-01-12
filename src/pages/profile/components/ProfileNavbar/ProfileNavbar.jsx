import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSignOutAlt } from 'react-icons/fa';
import './ProfileNavbar.scss';

const ProfileNavbar = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="profile-navbar">
      <button
        className="profile-navbar-back-btn"
        onClick={() => navigate('/dashboard')}
        aria-label="Volver al dashboard"
      >
        <FaArrowLeft />
        <span>Dashboard</span>
      </button>

      <button
        className="profile-navbar-logout-btn"
        onClick={onLogout}
        aria-label="Cerrar sesión"
      >
        <FaSignOutAlt />
        <span>Salir</span>
      </button>
    </div>
  );
};

export default ProfileNavbar;