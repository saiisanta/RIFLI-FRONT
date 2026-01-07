import React, { useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import useForm from '../../hooks/useForm';
import { useNavigate } from 'react-router-dom';
import './authModal.scss';

export default function AuthModal({ show, onClose }) {
  const { login, register, loading: authLoading, error: authError, clearError } = useAuthContext();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login');

  const getValidationRules = () => {
    const rules = {
      email: {
        required: { message: 'El email es requerido' },
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: 'Email inválido'
        }
      },
      password: {
        required: { message: 'La contraseña es requerida' },
        minLength: { 
          value: 6, 
          message: 'La contraseña debe tener al menos 6 caracteres' 
        }
      }
    };

    if (mode === 'register') {
      rules.name = {
        required: { message: 'El nombre es requerido' },
        minLength: { 
          value: 2, 
          message: 'El nombre debe tener al menos 2 caracteres' 
        }
      };
    }

    return rules;
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset
  } = useForm(
    { name: '', email: '', password: '' },
    getValidationRules()
  );

  const onSubmit = async (formData) => {
    try {
      if (mode === 'login') {
        await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
      }
      
      reset();
      onClose();
      navigate('/dashboard');
    } catch (err) {
      console.error('Error en autenticación:', err);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    reset();
    clearError();
  };

  const handleClose = () => {
    reset();
    clearError();
    onClose();
  };

  if (!show) return null;

  return (
    <div className="auth-modal-overlay" onClick={handleClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={handleClose} aria-label="Cerrar">
          &times;
        </button>
        
        <h2>{mode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}</h2>

        {authError && (
          <div className="error-message" role="alert">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <input
                type="text"
                id="name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting || authLoading}
                className={errors.name && touched.name ? 'input-error' : ''}
                placeholder="Tu nombre completo"
              />
              {errors.name && touched.name && (
                <span className="field-error">{errors.name}</span>
              )}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting || authLoading}
              className={errors.email && touched.email ? 'input-error' : ''}
              placeholder="tu@email.com"
            />
            {errors.email && touched.email && (
              <span className="field-error">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting || authLoading}
              className={errors.password && touched.password ? 'input-error' : ''}
              placeholder="Mínimo 6 caracteres"
            />
            {errors.password && touched.password && (
              <span className="field-error">{errors.password}</span>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting || authLoading}
            className="submit-btn"
          >
            {isSubmitting || authLoading ? (
              <>
                <span className="spinner"></span>
                {mode === 'login' ? 'Iniciando sesión...' : 'Registrando...'}
              </>
            ) : (
              mode === 'login' ? 'Iniciar Sesión' : 'Registrarse'
            )}
          </button>
        </form>

        <div className="switch-mode">
          {mode === 'login' ? (
            <p>
              ¿No tienes cuenta?{' '}
              <span 
                onClick={switchMode} 
                className="switch-link"
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && switchMode()}
              >
                Regístrate
              </span>
            </p>
          ) : (
            <p>
              ¿Ya tienes cuenta?{' '}
              <span 
                onClick={switchMode} 
                className="switch-link"
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && switchMode()}
              >
                Inicia Sesión
              </span>
            </p>
          )}
        </div>

        {mode === 'login' && (
          <div className="forgot-password">
            <span 
              onClick={() => navigate('/forgot-password')}
              className="forgot-link"
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && navigate('/forgot-password')}
            >
              ¿Olvidaste tu contraseña?
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
