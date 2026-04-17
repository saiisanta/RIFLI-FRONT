import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuthContext } from '../../context/AuthContext';
import useForm from '../../hooks/useForm';
import useApiError from '../../hooks/useApiError';
import RateLimitToast from '../../components/RateLimitToast/RateLimitToast';
import AuthPageLayout from './components/AuthPageLayout';
import './auth.scss';

const PASSWORD_REQUIREMENTS = [
  { id: 'length',  label: 'Mínimo 8 caracteres',          test: (v) => v.length >= 8 },
  { id: 'upper',   label: 'Al menos una mayúscula',        test: (v) => /[A-Z]/.test(v) },
  { id: 'lower',   label: 'Al menos una minúscula',        test: (v) => /[a-z]/.test(v) },
  { id: 'number',  label: 'Al menos un número',            test: (v) => /\d/.test(v) },
  { id: 'special', label: 'Al menos un carácter especial', test: (v) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(v) },
];

const ResetPassword = () => {
  const { token } = useParams();
  const navigate  = useNavigate();
  const { resetPassword, clearError } = useAuthContext();
  const [success, setSuccess]               = useState(false);
  const [showPassword, setShowPassword]     = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    generalError,
    rateLimitError,
    handleApiError,
    clearApiError,
    clearRateLimitError,
    getFieldError,
  } = useApiError(['newPassword', 'confirmPassword']);

  const validationRules = {
    newPassword: {
      required:  { message: 'La contraseña es requerida' },
      minLength: { value: 8, message: 'La contraseña debe tener al menos 8 caracteres' },
      pattern: {
        value:   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/,
        message: 'Debe contener mayúsculas, minúsculas, número y carácter especial',
      },
    },
    confirmPassword: {
      required: { message: 'Confirmá tu contraseña' },
      validate: {
        matchPassword: (value, formValues) =>
          value === formValues.newPassword || 'Las contraseñas no coinciden',
      },
    },
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm({ newPassword: '', confirmPassword: '' }, validationRules);

  const onSubmit = async (formData) => {
    clearApiError();
    try {
      await resetPassword({ token, newPassword: formData.newPassword });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      handleApiError(err);
    }
  };

  useEffect(() => {
    if (!token) navigate('/forgot-password');
  }, [token, navigate]);

  useEffect(() => {
    return () => {
      clearError();
      clearApiError();
    };
  }, []);

  if (success) {
    return (
      <AuthPageLayout>
        <div className="auth-header">
          <h2>¡Contraseña Restablecida! ✓</h2>
          <p className="auth-subtitle">Tu contraseña ha sido actualizada exitosamente</p>
        </div>
        <div className="success-message">Redirigiendo al inicio de sesión en 3 segundos...</div>
        <div className="switch-mode">
          <p>¿No querés esperar? <Link to="/login" className="switch-link">Ir al Login ahora</Link></p>
        </div>
      </AuthPageLayout>
    );
  }

  const passwordValue = values.newPassword || '';

  return (
    <>
      <RateLimitToast message={rateLimitError} onClose={clearRateLimitError} />

      <AuthPageLayout>
        <div className="auth-header">
          <h2>Restablecer Contraseña</h2>
          <p className="auth-subtitle">Ingresá tu nueva contraseña</p>
        </div>

        {generalError && (
          <div className="error-message" role="alert">{generalError}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>

          <div className="form-group">
            <label htmlFor="newPassword">Nueva Contraseña</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="newPassword"
                name="newPassword"
                value={values.newPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                className={
                  (errors.newPassword && touched.newPassword) || getFieldError('newPassword')
                    ? 'input-error'
                    : ''
                }
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.newPassword && touched.newPassword && (
              <span className="field-error">{errors.newPassword}</span>
            )}
            {getFieldError('newPassword') && (
              <span className="field-error">{getFieldError('newPassword')}</span>
            )}
          </div>

          <div className="password-requirements">
            <p className="password-requirements__title">Requisitos de la contraseña</p>
            <ul className="password-requirements__list">
              {PASSWORD_REQUIREMENTS.map(({ id, label, test }) => {
                const met = passwordValue.length > 0 && test(passwordValue);
                return (
                  <li
                    key={id}
                    className={`password-requirements__item ${
                      passwordValue.length === 0
                        ? ''
                        : met
                        ? 'password-requirements__item--met'
                        : 'password-requirements__item--unmet'
                    }`}
                  >
                    <span className="password-requirements__icon">
                      {passwordValue.length === 0 ? '○' : met ? '✓' : '✕'}
                    </span>
                    {label}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                className={
                  (errors.confirmPassword && touched.confirmPassword) || getFieldError('confirmPassword')
                    ? 'input-error'
                    : ''
                }
                placeholder="Repetí tu contraseña"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isSubmitting}
                aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && touched.confirmPassword && (
              <span className="field-error">{errors.confirmPassword}</span>
            )}
            {getFieldError('confirmPassword') && (
              <span className="field-error">{getFieldError('confirmPassword')}</span>
            )}
          </div>

          <button type="submit" disabled={isSubmitting} className="submit-btn">
            {isSubmitting
              ? <><span className="login-spinner" />Restableciendo...</>
              : 'Restablecer Contraseña'
            }
          </button>
        </form>

        <div className="switch-mode">
          <p>
            ¿Recordaste tu contraseña?{' '}
            <Link to="/login" className="switch-link">Iniciar Sesión</Link>
          </p>
        </div>
      </AuthPageLayout>
    </>
  );
};

export default ResetPassword;