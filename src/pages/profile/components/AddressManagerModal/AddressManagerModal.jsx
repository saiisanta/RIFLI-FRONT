import React, { useState } from 'react';
import { FiX, FiMapPin, FiPlus, FiEdit2, FiTrash2, FiStar, FiAlertCircle } from 'react-icons/fi';
import useAddresses  from '../../../../hooks/useAddress';
import './AddressManagerModal.scss';

const EMPTY_FORM = {
  alias: '', street: '', number: '', floor: '', apartment: '',
  city: '', province: '', postal_code: '', country: 'Argentina',
  additional_info: '', is_default: false,
};

const AddressManagerModal = ({ onClose }) => {
  const {
    addresses,
    loading: fetchLoading,
    error: fetchError,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    isSubmitting,
  } = useAddresses();

  const [editingId, setEditingId]     = useState(null);
  const [formData, setFormData]       = useState(EMPTY_FORM);
  const [formError, setFormError]     = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setFormError(null);
    setFormSuccess(null);
  };

  const handleEdit = (address) => {
    setEditingId(address.id);
    setFormData({
      alias:           address.alias           || '',
      street:          address.street          || '',
      number:          address.number          || '',
      floor:           address.floor           || '',
      apartment:       address.apartment       || '',
      city:            address.city            || '',
      province:        address.province        || '',
      postal_code:     address.postal_code     || '',
      country:         address.country         || 'Argentina',
      additional_info: address.additional_info || '',
      is_default:      address.is_default      || false,
    });
    setFormError(null);
    setFormSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const required = ['alias', 'street', 'number', 'city', 'province', 'postal_code'];
    const missing = required.filter((f) => !formData[f]?.trim());
    if (missing.length) {
      setFormError('Completá todos los campos obligatorios (*)');
      return;
    }

    try {
      if (editingId) {
        await updateAddress(editingId, formData);
        setFormSuccess('Dirección actualizada correctamente');
      } else {
        await createAddress(formData);
        setFormSuccess('Dirección agregada correctamente');
      }
      resetForm();
    } catch (err) {
      setFormError(err.errors?.[0]?.msg || err.message || 'Error al guardar la dirección');
    }
  };

  const handleDelete = async (address) => {
    if (!window.confirm(`¿Eliminar "${address.alias}"?`)) return;
    try {
      await deleteAddress(address.id);
    } catch (err) {
      setFormError(err.message || 'Error al eliminar la dirección');
    }
  };

  const handleSetDefault = async (address) => {
    try {
      await setDefaultAddress(address.id);
    } catch (err) {
      setFormError(err.message || 'Error al establecer dirección principal');
    }
  };

  return (
    <div className="address-modal-overlay" onClick={onClose}>
      <div className="address-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="address-modal-header">
          <div className="address-modal-title">
            <FiMapPin />
            <h2>Gestionar Direcciones</h2>
          </div>
          <button onClick={onClose} className="address-modal-close" aria-label="Cerrar"><FiX /></button>
        </div>

        {formError && (
          <div className="address-modal-error">
            <FiAlertCircle />
            {formError}
          </div>
        )}

        <div className="address-modal-content">
          <div className="address-list-section">
            <h3>Tus Direcciones</h3>

            {fetchLoading ? (
              <div className="address-empty-state">
                <span className="address-spinner-small" style={{ margin: '0 auto 1rem' }} />
                <p>Cargando direcciones...</p>
              </div>
            ) : fetchError ? (
              <div className="address-empty-state">
                <FiAlertCircle style={{ color: '#ef4444' }} />
                <p>{fetchError}</p>
              </div>
            ) : addresses.length === 0 ? (
              <div className="address-empty-state">
                <FiMapPin />
                <p>No tenés direcciones guardadas</p>
                <small>Agregá tu primera dirección usando el formulario</small>
              </div>
            ) : (
              <div className="address-list">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={[
                      'address-item',
                      address.is_default   ? 'is-default'  : '',
                      editingId === address.id ? 'is-editing' : '',
                    ].filter(Boolean).join(' ')}
                  >
                    <div className="address-item-header">
                      <div className="address-item-title">
                        <span className="address-alias">{address.alias}</span>
                        {address.is_default && (
                          <span className="address-default-badge">
                            <FiStar />
                            Principal
                          </span>
                        )}
                      </div>
                      <div className="address-item-actions">
                        {!address.is_default && (
                          <button
                            onClick={() => handleSetDefault(address)}
                            className="address-action-btn btn-set-default"
                            title="Establecer como principal"
                            disabled={isSubmitting}
                          >
                            <FiStar />
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(address)}
                          className="address-action-btn btn-edit"
                          title="Editar"
                          disabled={isSubmitting}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDelete(address)}
                          className="address-action-btn btn-delete"
                          title="Eliminar"
                          disabled={isSubmitting || address.is_default}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>

                    <div className="address-item-content">
                      <p className="address-street">
                        {address.street} {address.number}
                        {address.floor     && `, Piso ${address.floor}`}
                        {address.apartment && `, Depto ${address.apartment}`}
                      </p>
                      <p className="address-location">
                        {address.city}, {address.province} — CP {address.postal_code}
                      </p>
                      {address.additional_info && (
                        <p className="address-additional">{address.additional_info}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="address-form-section">
            <div className="address-form-header">
              <h3>{editingId ? 'Editar Dirección' : 'Nueva Dirección'}</h3>
              {editingId && (
                <button onClick={resetForm} className="btn-cancel-edit">
                  Cancelar edición
                </button>
              )}
            </div>

            {formSuccess && (
              <div
                className="address-modal-error"
                style={{
                  background: 'rgba(16,185,129,0.1)',
                  borderColor: 'rgba(16,185,129,0.3)',
                  color: '#10b981',
                  marginBottom: '1rem',
                }}
              >
                {formSuccess}
              </div>
            )}

            <form onSubmit={handleSubmit} className="address-form" noValidate>
              <div className="address-form-row">
                <div className="address-form-group">
                  <label htmlFor="alias">Alias *</label>
                  <input type="text" id="alias" name="alias" value={formData.alias}
                    onChange={handleInputChange} placeholder="Casa, Trabajo, Oficina…" maxLength={50} />
                </div>
              </div>

              <div className="address-form-row">
                <div className="address-form-group flex-3">
                  <label htmlFor="street">Calle *</label>
                  <input type="text" id="street" name="street" value={formData.street}
                    onChange={handleInputChange} placeholder="Av. Corrientes" />
                </div>
                <div className="address-form-group flex-1">
                  <label htmlFor="number">Número *</label>
                  <input type="text" id="number" name="number" value={formData.number}
                    onChange={handleInputChange} placeholder="1234" />
                </div>
              </div>

              <div className="address-form-row">
                <div className="address-form-group">
                  <label htmlFor="floor">Piso</label>
                  <input type="text" id="floor" name="floor" value={formData.floor}
                    onChange={handleInputChange} placeholder="5" />
                </div>
                <div className="address-form-group">
                  <label htmlFor="apartment">Departamento</label>
                  <input type="text" id="apartment" name="apartment" value={formData.apartment}
                    onChange={handleInputChange} placeholder="A" />
                </div>
              </div>

              <div className="address-form-row">
                <div className="address-form-group">
                  <label htmlFor="city">Ciudad *</label>
                  <input type="text" id="city" name="city" value={formData.city}
                    onChange={handleInputChange} placeholder="Buenos Aires" />
                </div>
                <div className="address-form-group">
                  <label htmlFor="province">Provincia *</label>
                  <input type="text" id="province" name="province" value={formData.province}
                    onChange={handleInputChange} placeholder="Buenos Aires" />
                </div>
              </div>

              <div className="address-form-row">
                <div className="address-form-group">
                  <label htmlFor="postal_code">Código Postal *</label>
                  <input type="text" id="postal_code" name="postal_code" value={formData.postal_code}
                    onChange={handleInputChange} placeholder="1000" />
                </div>
                <div className="address-form-group">
                  <label htmlFor="country">País</label>
                  <input type="text" id="country" name="country" value={formData.country} disabled />
                </div>
              </div>

              <div className="address-form-group">
                <label htmlFor="additional_info">Información Adicional</label>
                <textarea id="additional_info" name="additional_info" value={formData.additional_info}
                  onChange={handleInputChange} placeholder="Timbre, entre calles, referencias…" rows={3} />
              </div>

              <div className="address-form-checkbox">
                <input type="checkbox" id="is_default" name="is_default"
                  checked={formData.is_default} onChange={handleInputChange} />
                <label htmlFor="is_default">Establecer como dirección principal</label>
              </div>

              <button type="submit" className="address-submit-btn" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="address-spinner-small" />
                    {editingId ? 'Actualizando…' : 'Guardando…'}
                  </>
                ) : (
                  <>
                    <FiPlus />
                    {editingId ? 'Actualizar Dirección' : 'Agregar Dirección'}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressManagerModal;