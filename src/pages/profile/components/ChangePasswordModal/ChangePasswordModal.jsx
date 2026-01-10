import React from 'react';
import { FiX, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import useForm from '../../../../hooks/useForm';
import './ChangePasswordModal.scss';

const ChangePasswordModal = ({ onClose, onSave, loading, error }) => {
  const [showPasswords, setShowPasswords] = React.useState({
    current: false,
    new: false,
    confirm: false
  });

  const validationRules = {
    currentPassword: {
      required: { message: 'La contraseña actual es requerida' },
      minLength: { value: 6, message: 'Mínimo 6 caracteres' }
    },
    newPassword: {
      required: { message: 'La nueva contraseña es requerida' },
      minLength: { value: 8, message: 'Mínimo 8 caracteres' },
      pattern: {
        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        message: 'Debe contener mayúsculas, minúsculas y números'
      }
    },
    confirmPassword: {
      required: { message: 'Confirma tu nueva contraseña' },
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
    {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    validationRules
  );

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const onSubmit = async (formData) => {
    await onSave({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword
    });
  };

  return (
    <div className="password-modal-overlay" onClick={onClose}>
      <div className="password-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="password-modal-header">
          <div className="password-modal-header-content">
            <FiLock className="password-modal-icon" />
            <h2>Cambiar Contraseña</h2>
          </div>
          <button onClick={onClose} className="password-modal-close" aria-label="Cerrar">
            <FiX />
          </button>
        </div>

        {error && (
          <div className="password-modal-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="password-modal-form">
          <div className="password-info-box">
            <h3>Requisitos de seguridad:</h3>
            <ul>
              <li>Mínimo 8 caracteres</li>
              <li>Al menos una letra mayúscula</li>
              <li>Al menos una letra minúscula</li>
              <li>Al menos un número</li>
            </ul>
          </div>

          <div className="password-form-group">
            <label htmlFor="currentPassword">Contraseña Actual *</label>
            <div className="password-input-wrapper">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                id="currentPassword"
                name="currentPassword"
                value={values.currentPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting || loading}
                className={errors.currentPassword && touched.currentPassword ? 'input-error' : ''}
                placeholder="Ingresa tu contraseña actual"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="password-toggle-btn"
                aria-label={showPasswords.current ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPasswords.current ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.currentPassword && touched.currentPassword && (
              <span className="password-field-error">{errors.currentPassword}</span>
            )}
          </div>

          <div className="password-divider"></div>

          <div className="password-form-group">
            <label htmlFor="newPassword">Nueva Contraseña *</label>
            <div className="password-input-wrapper">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                id="newPassword"
                name="newPassword"
                value={values.newPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting || loading}
                className={errors.newPassword && touched.newPassword ? 'input-error' : ''}
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="password-toggle-btn"
                aria-label={showPasswords.new ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPasswords.new ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.newPassword && touched.newPassword && (
              <span className="password-field-error">{errors.newPassword}</span>
            )}
          </div>

          <div className="password-form-group">
            <label htmlFor="confirmPassword">Confirmar Nueva Contraseña *</label>
            <div className="password-input-wrapper">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting || loading}
                className={errors.confirmPassword && touched.confirmPassword ? 'input-error' : ''}
                placeholder="Repite tu nueva contraseña"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="password-toggle-btn"
                aria-label={showPasswords.confirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPasswords.confirm ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.confirmPassword && touched.confirmPassword && (
              <span className="password-field-error">{errors.confirmPassword}</span>
            )}
          </div>

          <div className="password-modal-actions">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting || loading}
              className="password-modal-btn btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="password-modal-btn btn-primary"
            >
              {isSubmitting || loading ? (
                <>
                  <span className="password-spinner-small"></span>
                  Cambiando...
                </>
              ) : (
                <>
                  <FiLock />
                  Cambiar Contraseña
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;