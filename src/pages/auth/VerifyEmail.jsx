import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import AuthPageLayout from './components/AuthPageLayout';
import './auth.scss';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { verifyEmail } = useAuthContext();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(5);
  const hasVerified = useRef(false);

  useEffect(() => {
    const verify = async () => {
      if (hasVerified.current) {
        return;
      }

      if (!token) {
        setStatus('error');
        setMessage('Token de verificación inválido');
        return;
      }

      hasVerified.current = true;

      try {
        const response = await verifyEmail(token);
        setStatus('success');
        setMessage(response.message || 'Email verificado correctamente');
        
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              navigate('/login?verified=true');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(timer);
      } catch (error) {
        setStatus('error');
        setMessage(
          error.error || 
          error.message || 
          'Token de verificación inválido o expirado'
        );
      }
    };

    verify();
  }, [token, verifyEmail, navigate]);

  return (
    <AuthPageLayout>
      <div className="auth-header">
        <h2>Verificación de Email</h2>
        <p className="auth-subtitle">
          {status === 'verifying' && 'Verificando tu cuenta'}
          {status === 'success' && 'Cuenta verificada exitosamente'}
          {status === 'error' && 'No se pudo verificar tu cuenta'}
        </p>
      </div>

      {status === 'verifying' && (
        <div className="verification-loading">
          <div className="verification-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          <p className="verification-text">Verificando tu email</p>
          <p className="verification-subtext">Por favor espera un momento</p>
        </div>
      )}

      {status === 'success' && (
        <div className="verification-success">
          <div className="success-animation">
          <div className="verified-checkmark" style={{justifySelf:"center"}}>
            <div className="check-icon-small">
              <span className="icon-line-small line-tip-small"></span>
              <span className="icon-line-small line-long-small"></span>
              <div className="icon-circle-small"></div>
            </div>
          </div>
          </div>

          <div className="success-content">
            <h3 className="success-title">{message}</h3>
            <p className="success-description">
              Ya podés iniciar sesión con tu cuenta
            </p>
          </div>

          <div className="countdown-container">
            <div className="countdown-circle">
              <svg className="countdown-svg" viewBox="0 0 100 100">
                <circle className="countdown-bg" cx="50" cy="50" r="45"></circle>
                <circle 
                  className="countdown-progress" 
                  cx="50" 
                  cy="50" 
                  r="45"
                  style={{
                    strokeDashoffset: `${283 - (283 * (5 - countdown)) / 5}`
                  }}
                ></circle>
              </svg>
              <div className="countdown-number">{countdown}</div>
            </div>
            <p className="countdown-text">
              Redirigiendo al login automáticamente
            </p>
          </div>

          <Link to="/login" className="btn-link-primary">
            Ir al Login ahora
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="verification-error">
          <div className="error-animation">
            <div className="error-icon-wrapper">
              <div className="error-icon">
                <span className="error-line error-line-1"></span>
                <span className="error-line error-line-2"></span>
              </div>
            </div>
          </div>

          <div className="error-content">
            <h3 className="error-title">{message}</h3>
          </div>

          <div className="error-solutions">
            <p className="solutions-title">Posibles soluciones</p>
            <ul className="solutions-list">
              <li>
                <span className="solution-bullet"></span>
                <span>El enlace puede haber expirado (válido por 24 horas)</span>
              </li>
              <li>
                <span className="solution-bullet"></span>
                <span>Ya verificaste tu cuenta anteriormente</span>
              </li>
              <li>
                <span className="solution-bullet"></span>
                <span>El enlace fue copiado incorrectamente</span>
              </li>
            </ul>
          </div>

          <div className="error-actions">
            <Link to="/register" className="btn-outline">
              Solicitar nuevo enlace
            </Link>
            <Link to="/login" className="btn-primary">
              Ir al Login
            </Link>
          </div>
        </div>
      )}
    </AuthPageLayout>
  );
};

export default VerifyEmail;