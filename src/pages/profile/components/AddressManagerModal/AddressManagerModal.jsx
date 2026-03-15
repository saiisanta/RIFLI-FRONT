import React, { useState, useEffect, useCallback } from 'react';
import { FiX, FiMapPin, FiPlus, FiEdit2, FiTrash2, FiStar, FiAlertCircle } from 'react-icons/fi';
import addressService from '../../../../services/addressService';
import './AddressManagerModal.scss';

const EMPTY_FORM = {
  alias: '',
  street: '',
  number: '',
  floor: '',
  apartment: '',
  city: '',
  province: '',
  postal_code: '',
  country: 'Argentina',
  additional_info: '',
  is_default: false,
};

const AddressManagerModal = ({ onClose }) => {
  // ── Local address state ───────────────────────────────────
  const [addresses, setAddresses]     = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError]   = useState(null);

  // ── Form state ────────────────────────────────────────────
  const [editingId, setEditingId]     = useState(null);
  const [formData, setFormData]       = useState(EMPTY_FORM);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError]     = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  // ── Fetch addresses on mount ──────────────────────────────
  const fetchAddresses = useCallback(async () => {
    try {
      setFetchLoading(true);
      setFetchError(null);
      const data = await addressService.getMyAddresses();
      setAddresses(Array.isArray(data) ? data : data.addresses || []);
    } catch (err) {
      setFetchError(err.message || 'Error al cargar direcciones');
    } finally {
      setFetchLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  // ── Form helpers ──────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
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

  // ── Submit (create / update) ──────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const required = ['alias', 'street', 'number', 'city', 'province', 'postal_code'];
    const missing = required.filter(f => !formData[f]?.trim());
    if (missing.length) {
      setFormError('Completá todos los campos obligatorios (*)');
      return;
    }

    setFormLoading(true);
    try {
      if (editingId) {
        const updated = await addressService.updateAddress(editingId, formData);
        setAddresses(prev =>
          prev.map(a => a.id === editingId ? (updated.address || updated) : a)
        );
        // Si se marcó como default, desmarcar las demás localmente
        if (formData.is_default) {
          setAddresses(prev =>
            prev.map(a => ({ ...a, is_default: a.id === editingId }))
          );
        }
        setFormSuccess('Dirección actualizada correctamente');
      } else {
        const created = await addressService.createAddress(formData);
        const newAddr = created.address || created;
        // Si es default o es la primera, desmarcar las demás
        if (newAddr.is_default || addresses.length === 0) {
          setAddresses(prev => [
            newAddr,
            ...prev.map(a => ({ ...a, is_default: false })),
          ]);
        } else {
          setAddresses(prev => [newAddr, ...prev]);
        }
        setFormSuccess('Dirección agregada correctamente');
      }
      resetForm();
    } catch (err) {
      setFormError(
        err.errors?.[0]?.msg ||
        err.message ||
        'Error al guardar la dirección'
      );
    } finally {
      setFormLoading(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────
  const handleDelete = async (address) => {
    if (!window.confirm(`¿Eliminar "${address.alias}"?`)) return;
    setFormLoading(true);
    try {
      await addressService.deleteAddress(address.id);
      const remaining = addresses.filter(a => a.id !== address.id);
      // Si era default y quedan otras, marcar la primera como default localmente
      // (el back ya lo hace, pero actualizamos el estado)
      if (address.is_default && remaining.length > 0) {
        remaining[0] = { ...remaining[0], is_default: true };
      }
      setAddresses(remaining);
    } catch (err) {
      setFormError(err.message || 'Error al eliminar la dirección');
    } finally {
      setFormLoading(false);
    }
  };

  // ── Set default ───────────────────────────────────────────
  const handleSetDefault = async (address) => {
    setFormLoading(true);
    try {
      await addressService.setDefaultAddress(address.id);
      setAddresses(prev =>
        prev.map(a => ({ ...a, is_default: a.id === address.id }))
      );
    } catch (err) {
      setFormError(err.message || 'Error al establecer dirección principal');
    } finally {
      setFormLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="address-modal-overlay" onClick={onClose}>
      <div
        className="address-modal-container"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="address-modal-header">
          <div className="address-modal-title">
            <FiMapPin />
            <h2>Gestionar Direcciones</h2>
          </div>
          <button onClick={onClose} className="address-modal-close" aria-label="Cerrar">
            <FiX />
          </button>
        </div>

        {/* Global form error banner */}
        {formError && (
          <div className="address-modal-error">
            <FiAlertCircle />
            {formError}
          </div>
        )}

        <div className="address-modal-content">

          {/* ── Address list ── */}
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
                <button
                  className="address-submit-btn"
                  style={{ width: 'auto', marginTop: '1rem' }}
                  onClick={fetchAddresses}
                >
                  Reintentar
                </button>
              </div>
            ) : addresses.length === 0 ? (
              <div className="address-empty-state">
                <FiMapPin />
                <p>No tenés direcciones guardadas</p>
                <small>Agregá tu primera dirección usando el formulario</small>
              </div>
            ) : (
              <div className="address-list">
                {addresses.map(address => (
                  <div
                    key={address.id}
                    className={[
                      'address-item',
                      address.is_default  ? 'is-default'  : '',
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
                            disabled={formLoading}
                          >
                            <FiStar />
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(address)}
                          className="address-action-btn btn-edit"
                          title="Editar"
                          disabled={formLoading}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDelete(address)}
                          className="address-action-btn btn-delete"
                          title="Eliminar"
                          disabled={formLoading || address.is_default}
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

          {/* ── Form ── */}
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

              {/* Alias */}
              <div className="address-form-row">
                <div className="address-form-group">
                  <label htmlFor="alias">Alias *</label>
                  <input
                    type="text"
                    id="alias"
                    name="alias"
                    value={formData.alias}
                    onChange={handleInputChange}
                    placeholder="Casa, Trabajo, Oficina…"
                    maxLength={50}
                  />
                </div>
              </div>

              {/* Street + number */}
              <div className="address-form-row">
                <div className="address-form-group flex-3">
                  <label htmlFor="street">Calle *</label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder="Av. Corrientes"
                  />
                </div>
                <div className="address-form-group flex-1">
                  <label htmlFor="number">Número *</label>
                  <input
                    type="text"
                    id="number"
                    name="number"
                    value={formData.number}
                    onChange={handleInputChange}
                    placeholder="1234"
                  />
                </div>
              </div>

              {/* Floor + apartment */}
              <div className="address-form-row">
                <div className="address-form-group">
                  <label htmlFor="floor">Piso</label>
                  <input
                    type="text"
                    id="floor"
                    name="floor"
                    value={formData.floor}
                    onChange={handleInputChange}
                    placeholder="5"
                  />
                </div>
                <div className="address-form-group">
                  <label htmlFor="apartment">Departamento</label>
                  <input
                    type="text"
                    id="apartment"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleInputChange}
                    placeholder="A"
                  />
                </div>
              </div>

              {/* City + province */}
              <div className="address-form-row">
                <div className="address-form-group">
                  <label htmlFor="city">Ciudad *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Buenos Aires"
                  />
                </div>
                <div className="address-form-group">
                  <label htmlFor="province">Provincia *</label>
                  <input
                    type="text"
                    id="province"
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    placeholder="Buenos Aires"
                  />
                </div>
              </div>

              {/* Postal code + country */}
              <div className="address-form-row">
                <div className="address-form-group">
                  <label htmlFor="postal_code">Código Postal *</label>
                  <input
                    type="text"
                    id="postal_code"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleInputChange}
                    placeholder="1000"
                  />
                </div>
                <div className="address-form-group">
                  <label htmlFor="country">País</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    disabled
                  />
                </div>
              </div>

              {/* Additional info */}
              <div className="address-form-group">
                <label htmlFor="additional_info">Información Adicional</label>
                <textarea
                  id="additional_info"
                  name="additional_info"
                  value={formData.additional_info}
                  onChange={handleInputChange}
                  placeholder="Timbre, entre calles, referencias…"
                  rows={3}
                />
              </div>

              {/* Default checkbox */}
              <div className="address-form-checkbox">
                <input
                  type="checkbox"
                  id="is_default"
                  name="is_default"
                  checked={formData.is_default}
                  onChange={handleInputChange}
                />
                <label htmlFor="is_default">Establecer como dirección principal</label>
              </div>

              <button
                type="submit"
                className="address-submit-btn"
                disabled={formLoading}
              >
                {formLoading ? (
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