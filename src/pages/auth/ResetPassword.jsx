import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import useForm from '../../hooks/useForm';
import AuthPageLayout from './components/AuthPageLayout';
import './auth.scss';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword, clearError } = useAuthContext();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const validationRules = {
    newPassword: {
      required: { message: 'La contraseña es requerida' },
      minLength: {
        value: 8,
        message: 'La contraseña debe tener al menos 8 caracteres'
      },
      pattern: {
        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        message: 'Debe contener mayúsculas, minúsculas y números'
      }
    },
    confirmPassword: {
      required: { message: 'Confirma tu contraseña' },
      validate: {
        matchPassword: (value, formValues) => 
          value === formValues.newPassword || 'Las contraseñas no coinciden'
      }
    }
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit
  } = useForm(
    { newPassword: '', confirmPassword: '' },
    validationRules
  );

  const onSubmit = async (formData) => {
    try {
      setError('');
      await resetPassword(token, formData.newPassword);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.error || err.message || 'Error al restablecer contraseña');
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/forgot-password');
    }
    return () => clearError();
  }, [token, navigate, clearError]);

  if (success) {
    return (
      <AuthPageLayout>
        <div className="auth-header">
          <h2>¡Contraseña Restablecida! ✓</h2>
          <p className="auth-subtitle">Tu contraseña ha sido actualizada exitosamente</p>
        </div>

        <div className="success-message">
          Redirigiendo al inicio de sesión en 3 segundos...
        </div>

        <div className="switch-mode">
          <p>
            ¿No quieres esperar?{' '}
            <Link to="/login" className="switch-link">
              Ir al Login ahora
            </Link>
          </p>
        </div>
      </AuthPageLayout>
    );
  }

  return (
    <AuthPageLayout>
      <div className="auth-header">
        <h2>Restablecer Contraseña</h2>
        <p className="auth-subtitle">Ingresa tu nueva contraseña</p>
      </div>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-group">
          <label htmlFor="newPassword">Nueva Contraseña</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={values.newPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            className={errors.newPassword && touched.newPassword ? 'input-error' : ''}
            placeholder="Mínimo 8 caracteres"
            autoComplete="new-password"
          />
          {errors.newPassword && touched.newPassword && (
            <span className="field-error">{errors.newPassword}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            className={
              errors.confirmPassword && touched.confirmPassword ? 'input-error' : ''
            }
            placeholder="Repite tu contraseña"
            autoComplete="new-password"
          />
          {errors.confirmPassword && touched.confirmPassword && (
            <span className="field-error">{errors.confirmPassword}</span>
          )}
        </div>

        <div className="info-message">
          <strong>Requisitos:</strong>
          <ul>
            <li>Mínimo 8 caracteres</li>
            <li>Al menos una mayúscula</li>
            <li>Al menos una minúscula</li>
            <li>Al menos un número</li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="submit-btn"
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              Restableciendo...
            </>
          ) : (
            'Restablecer Contraseña'
          )}
        </button>
      </form>

      <div className="switch-mode">
        <p>
          ¿Recordaste tu contraseña?{' '}
          <Link to="/login" className="switch-link">
            Iniciar Sesión
          </Link>
        </p>
      </div>
    </AuthPageLayout>
  );
};

export default ResetPassword;