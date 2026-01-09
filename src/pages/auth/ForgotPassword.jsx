import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import useForm from '../../hooks/useForm';
import AuthPageLayout from './components/AuthPageLayout';
import './auth.scss';

const ForgotPassword = () => {
  const { forgotPassword, loading: authLoading, error: authError, clearError } = useAuthContext();
  const [emailSent, setEmailSent] = useState(false);

  const validationRules = {
    email: {
      required: { message: 'El email es requerido' },
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Email inválido'
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
    handleSubmit,
    reset
  } = useForm(
    { email: '' },
    validationRules
  );

  const onSubmit = async (formData) => {
    try {
      await forgotPassword(formData.email);
      setEmailSent(true);
      reset();
    } catch (err) {
      console.error('Error al enviar email:', err);
    }
  };

  React.useEffect(() => {
    return () => clearError();
  }, [clearError]);

  return (
    <AuthPageLayout>
      <div className="auth-header">
        <h2>¿Olvidaste tu Contraseña?</h2>
        <p className="auth-subtitle">
          {emailSent 
            ? 'Revisa tu email para continuar' 
            : 'Ingresa tu email para recuperarla'}
        </p>
      </div>

      {emailSent ? (
        <div className="success-message">
          Te enviamos un email con instrucciones para restablecer tu contraseña.
          Revisa tu bandeja de entrada y spam.
        </div>
      ) : (
        <>
          {authError && (
            <div className="error-message" role="alert">
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
                autoComplete="email"
              />
              {errors.email && touched.email && (
                <span className="field-error">{errors.email}</span>
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
                  Enviando...
                </>
              ) : (
                'Enviar Instrucciones'
              )}
            </button>
          </form>
        </>
      )}

      <div className="switch-mode">
        <p>
          <Link to="/login" className="switch-link">
            Volver a Iniciar Sesión
          </Link>
        </p>
      </div>
    </AuthPageLayout>
  );
};

export default ForgotPassword;