import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSignOutAlt } from 'react-icons/fa';
import './ServicesNavbar.scss';

const ServicesNavBar = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="service-navbar">
      <button
        className="service-navbar-back-btn"
        onClick={() => navigate('/dashboard')}
        aria-label="Volver al dashboard"
      >
        <FaArrowLeft />
        <span>Dashboard</span>
      </button>

      <button
        className="service-navbar-logout-btn"
        onClick={onLogout}
        aria-label="Cerrar sesión"
      >
        <FaSignOutAlt />
        <span>Salir</span>
      </button>
    </div>
  );
};

export default ServicesNavBar;