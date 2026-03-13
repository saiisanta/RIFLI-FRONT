import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSignOutAlt } from 'react-icons/fa';
import './QuotesNavbar.scss';

const QuotesNavBar = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="quote-navbar">
      <button
        className="quote-navbar-back-btn"
        onClick={() => navigate('/dashboard')}
        aria-label="Volver al dashboard"
      >
        <FaArrowLeft />
        <span>Dashboard</span>
      </button>

      <button
        className="quote-navbar-logout-btn"
        onClick={onLogout}
        aria-label="Cerrar sesión"
      >
        <FaSignOutAlt />
        <span>Salir</span>
      </button>
    </div>
  );
};

export default QuotesNavBar;