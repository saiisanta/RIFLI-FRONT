import React, { useState, useEffect } from 'react';
import { FiX, FiSave } from 'react-icons/fi';
import useForm from '../../../../hooks/useForm';
import './ProfileEditModal.scss';

const ProfileEditModal = ({ profile, onClose, onSave, loading, error }) => {
  const validationRules = {
    name: {
      required: { message: 'El nombre de usuario es requerido' },
      minLength: { value: 3, message: 'Mínimo 3 caracteres' }
    },
    email: {
      required: { message: 'El email es requerido' },
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Email inválido'
      }
    },
    firstName: {
      minLength: { value: 2, message: 'Mínimo 2 caracteres' }
    },
    lastName: {
      minLength: { value: 2, message: 'Mínimo 2 caracteres' }
    },
    phone: {
      pattern: {
        value: /^[0-9\s\-\+\(\)]*$/,
        message: 'Formato de teléfono inválido'
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
    setFieldValues
  } = useForm(
    {
      name: '',
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      street: '',
      city: '',
      zip: ''
    },
    validationRules
  );

  useEffect(() => {
    if (profile) {
      setFieldValues({
        name: profile.name || '',
        email: profile.email || '',
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phone: profile.phone || '',
        street: profile.address?.street || '',
        city: profile.address?.city || '',
        zip: profile.address?.zip || ''
      });
    }
  }, [profile, setFieldValues]);

  const onSubmit = async (formData) => {
    const { street, city, zip, ...userData } = formData;
    
    const updatedData = {
      ...userData,
      address: {
        street: street || '',
        city: city || '',
        zip: zip || ''
      }
    };

    await onSave(updatedData);
  };

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="profile-modal-header">
          <h2>Editar Perfil</h2>
          <button onClick={onClose} className="profile-modal-close" aria-label="Cerrar">
            <FiX />
          </button>
        </div>

        {error && (
          <div className="profile-modal-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="profile-modal-form">
          <div className="profile-modal-section">
            <h3 className="profile-modal-section-title">Información de Cuenta</h3>
            
            <div className="profile-form-row">
              <div className="profile-form-group">
                <label htmlFor="name">Nombre de Usuario *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting || loading}
                  className={errors.name && touched.name ? 'input-error' : ''}
                  placeholder="tu_usuario"
                />
                {errors.name && touched.name && (
                  <span className="profile-field-error">{errors.name}</span>
                )}
              </div>

              <div className="profile-form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting || loading}
                  className={errors.email && touched.email ? 'input-error' : ''}
                  placeholder="tu@email.com"
                />
                {errors.email && touched.email && (
                  <span className="profile-field-error">{errors.email}</span>
                )}
              </div>
            </div>
          </div>

          <div className="profile-modal-section">
            <h3 className="profile-modal-section-title">Información Personal</h3>
            
            <div className="profile-form-row">
              <div className="profile-form-group">
                <label htmlFor="firstName">Nombre</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting || loading}
                  className={errors.firstName && touched.firstName ? 'input-error' : ''}
                  placeholder="Juan"
                />
                {errors.firstName && touched.firstName && (
                  <span className="profile-field-error">{errors.firstName}</span>
                )}
              </div>

              <div className="profile-form-group">
                <label htmlFor="lastName">Apellido</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting || loading}
                  className={errors.lastName && touched.lastName ? 'input-error' : ''}
                  placeholder="Pérez"
                />
                {errors.lastName && touched.lastName && (
                  <span className="profile-field-error">{errors.lastName}</span>
                )}
              </div>
            </div>

            <div className="profile-form-group">
              <label htmlFor="phone">Teléfono</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting || loading}
                className={errors.phone && touched.phone ? 'input-error' : ''}
                placeholder="+54 9 11 1234-5678"
              />
              {errors.phone && touched.phone && (
                <span className="profile-field-error">{errors.phone}</span>
              )}
            </div>
          </div>

          <div className="profile-modal-section">
            <h3 className="profile-modal-section-title">Dirección</h3>
            
            <div className="profile-form-group">
              <label htmlFor="street">Calle</label>
              <input
                type="text"
                id="street"
                name="street"
                value={values.street}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting || loading}
                placeholder="Av. Corrientes 1234"
              />
            </div>

            <div className="profile-form-row">
              <div className="profile-form-group">
                <label htmlFor="city">Ciudad</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={values.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting || loading}
                  placeholder="Buenos Aires"
                />
              </div>

              <div className="profile-form-group">
                <label htmlFor="zip">Código Postal</label>
                <input
                  type="text"
                  id="zip"
                  name="zip"
                  value={values.zip}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting || loading}
                  placeholder="1000"
                />
              </div>
            </div>
          </div>

          <div className="profile-modal-actions">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting || loading}
              className="profile-modal-btn btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="profile-modal-btn btn-primary"
            >
              {isSubmitting || loading ? (
                <>
                  <span className="profile-spinner-small"></span>
                  Guardando...
                </>
              ) : (
                <>
                  <FiSave />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal;