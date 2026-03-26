import React, { useState, useEffect } from 'react';
import { FiX, FiSave, FiPlus, FiMapPin } from 'react-icons/fi';
import useForm from '../../../../hooks/useForm';
import './ProfileEditModal.scss';

const ProfileEditModal = ({ profile, onClose, onSave, onOpenAddressManager, loading, error }) => {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [cuilParts, setCuilParts] = useState({ prefix: '', middle: '', suffix: '' });

  const validationRules = {
    email: {
      required: { message: 'El email es requerido' },
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Email inválido'
      }
    },
    first_name: {
      required: { message: 'El nombre es requerido' },
      minLength: { value: 2, message: 'Mínimo 2 caracteres' }
    },
    last_name: {
      required: { message: 'El apellido es requerido' },
      minLength: { value: 2, message: 'Mínimo 2 caracteres' }
    },
    phone: {
      pattern: {
        value: /^\+?[0-9\s\-()]+$/,
        message: 'Formato de teléfono inválido'
      }
    },
    document_number: {
      pattern: {
        value: /^[0-9]{7,11}$/,
        message: 'Formato de documento inválido'
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
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      document_type: 'DNI',
      document_number: ''
    },
    validationRules
  );

  useEffect(() => {
    if (profile) {
      setFieldValues({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        document_type: profile.document_type || 'DNI',
        document_number: profile.document_number || ''
      });

     if (profile.document_number && profile.document_type !== 'DNI') {
      setCuilParts({
        prefix: profile.document_number.slice(0, 2),   // "20"
        middle: profile.document_number.slice(2, 10),  // "12345678"
        suffix: profile.document_number.slice(10, 11)  // "9"
      });
    }

      if (profile.Addresses && profile.Addresses.length > 0) {
        const defaultAddr = profile.Addresses.find(addr => addr.is_default) || profile.Addresses[0];
        setSelectedAddress(defaultAddr);
      }
    }
  }, [profile, setFieldValues]);

  const onSubmit = async (formData) => {
    await onSave(formData);
  };

  const handleCuilPartChange = (part, value) => {
    const updated = { ...cuilParts, [part]: value };
    setCuilParts(updated);
    // Combina como XX-XXXXXXXX-X y lo manda al campo document_number
    const combined = `${updated.prefix}${updated.middle}${updated.suffix}`;
    handleChange({ target: { name: 'document_number', value: combined } });
  };

  const handleDocumentTypeChange = (e) => {
    handleChange(e);
    // Resetea el número al cambiar de tipo
    handleChange({ target: { name: 'document_number', value: '' } });
    setCuilParts({ prefix: '', middle: '', suffix: '' });
  };

  const handleOpenAddressManagerClick = () => {
    if (onOpenAddressManager) {
      onOpenAddressManager();
    } else {
      console.warn('onOpenAddressManager no está definido');
    }
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
            <h3 className="profile-modal-section-title">Información Personal</h3>
            
            <div className="profile-form-row">
              <div className="profile-form-group">
                <label htmlFor="first_name">Nombre *</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={values.first_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting || loading}
                  className={errors.first_name && touched.first_name ? 'input-error' : ''}
                  placeholder="Juan"
                />
                {errors.first_name && touched.first_name && (
                  <span className="profile-field-error">{errors.first_name}</span>
                )}
              </div>

              <div className="profile-form-group">
                <label htmlFor="last_name">Apellido *</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={values.last_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting || loading}
                  className={errors.last_name && touched.last_name ? 'input-error' : ''}
                  placeholder="Pérez"
                />
                {errors.last_name && touched.last_name && (
                  <span className="profile-field-error">{errors.last_name}</span>
                )}
              </div>
            </div>

            <div className="profile-form-row">
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
          </div>

          <div className="profile-modal-section">
            <h3 className="profile-modal-section-title">Documentación</h3>
            
            <div className="profile-form-row">
              <div className="profile-form-group">
                <label htmlFor="document_type">Tipo de Documento</label>
                <select
                  id="document_type"
                  name="document_type"
                  value={values.document_type}
                  onChange={handleDocumentTypeChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting || loading}
                >
                  <option value="DNI">DNI</option>
                  <option value="CUIL">CUIL</option>
                  <option value="CUIT">CUIT</option>
                </select>
              </div>

              <div className="profile-form-group">
                <label htmlFor="document_number">Número de Documento</label>
                
                {values.document_type === 'DNI' ? (
                  // ── DNI: un solo campo ──────────────────────────────
                  <input
                    type="number"
                    id="document_number"
                    name="document_number"
                    value={values.document_number}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isSubmitting || loading}
                    className={errors.document_number && touched.document_number ? 'input-error' : ''}
                    placeholder="12345678"
                    maxLength="8"
                  />
                ) : (
                  // ── CUIL / CUIT: tres campos que se unifican ────────
                  <div className="cuil-input-group">
                    <input
                      type="number"
                      value={cuilParts.prefix}
                      onChange={(e) => handleCuilPartChange('prefix', e.target.value)}
                      onBlur={handleBlur}
                      disabled={isSubmitting || loading}
                      placeholder="12"
                      maxLength="2"
                      className={`cuil-part cuil-prefix${errors.document_number && touched.document_number ? ' input-error' : ''}`}
                    />
                    <span className="cuil-separator">-</span>
                    <input
                      type="number"
                      value={cuilParts.middle}
                      onChange={(e) => handleCuilPartChange('middle', e.target.value)}
                      onBlur={handleBlur}
                      disabled={isSubmitting || loading}
                      placeholder="12345678"
                      maxLength="8"
                      className={`cuil-part cuil-middle${errors.document_number && touched.document_number ? ' input-error' : ''}`}
                    />
                    <span className="cuil-separator">-</span>
                    <input
                      type="number"
                      value={cuilParts.suffix}
                      onChange={(e) => handleCuilPartChange('suffix', e.target.value)}
                      onBlur={handleBlur}
                      disabled={isSubmitting || loading}
                      placeholder="1"
                      maxLength="1"
                      className={`cuil-part cuil-suffix${errors.document_number && touched.document_number ? ' input-error' : ''}`}
                    />
                  </div>
                )}

                {errors.document_number && touched.document_number && (
                  <span className="profile-field-error">{errors.document_number}</span>
                )}
              </div>
            </div>
          </div>

          <div className="profile-modal-section">
            <div className="profile-section-header-with-action">
              <h3 className="profile-modal-section-title">
                <FiMapPin />
                Dirección Principal
              </h3>
              <button
                type="button"
                className="profile-modal-btn-small btn-secondary"
                onClick={handleOpenAddressManagerClick}
                disabled={isSubmitting || loading}
              >
                <FiPlus />
                Gestionar Direcciones
              </button>
            </div>

            {selectedAddress ? (
              <div className="profile-address-preview">
                <div className="address-preview-header">
                  <span className="address-alias">{selectedAddress.alias}</span>
                  {selectedAddress.is_default && (
                    <span className="address-default-badge">Principal</span>
                  )}
                </div>
                <p className="address-preview-text">
                  {selectedAddress.street} {selectedAddress.number}
                  {selectedAddress.floor && `, Piso ${selectedAddress.floor}`}
                  {selectedAddress.apartment && `, Depto ${selectedAddress.apartment}`}
                </p>
                <p className="address-preview-location">
                  {selectedAddress.city}, {selectedAddress.province} - CP {selectedAddress.postal_code}
                </p>
              </div>
            ) : (
              <div className="profile-address-empty">
                <p>No tienes direcciones guardadas</p>
                <small>Haz clic en "Gestionar Direcciones" para agregar una</small>
              </div>
            )}
          </div>

          {/* ACCIONES */}
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