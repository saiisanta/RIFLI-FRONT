import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import logoUrl from '../../../assets/img/rifli/icono_color.svg';

const AuthPageLayout = ({ children, showBackButton = true }) => {
  const navigate = useNavigate();

  return (
    <div className="auth-page-wrapper">
      <div className="auth-bg-decoration">
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
        <div className="decoration-circle circle-3"></div>
      </div>

      {showBackButton && (
        <button 
          className="back-to-home"
          onClick={() => navigate('/')}
          aria-label="Volver al inicio"
        >
          <FaArrowLeft />
          <span>Volver al Inicio</span>
        </button>
      )}

      <div className="auth-page-container">


        <div className="auth-page-card">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthPageLayout;