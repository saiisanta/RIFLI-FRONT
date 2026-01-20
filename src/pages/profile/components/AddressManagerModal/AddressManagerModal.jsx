import React, { useState } from 'react';
import { FiX, FiMapPin, FiPlus, FiEdit2, FiTrash2, FiStar } from 'react-icons/fi';
import './AddressManagerModal.scss';

const AddressManagerModal = ({ addresses = [], onClose, onSave, loading, error }) => {
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
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
    is_default: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEdit = (address) => {
    setEditingAddress(address.id);
    setFormData({
      alias: address.alias || '',
      street: address.street || '',
      number: address.number || '',
      floor: address.floor || '',
      apartment: address.apartment || '',
      city: address.city || '',
      province: address.province || '',
      postal_code: address.postal_code || '',
      country: address.country || 'Argentina',
      additional_info: address.additional_info || '',
      is_default: address.is_default || false
    });
  };

  const handleCancel = () => {
    setEditingAddress(null);
    setFormData({
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
      is_default: false
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.alias || !formData.street || !formData.number || !formData.city || !formData.province || !formData.postal_code) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      if (editingAddress) {
        await onSave({ ...formData, id: editingAddress }, 'update');
      } else {
        await onSave(formData, 'create');
      }
      handleCancel();
    } catch (err) {
      console.error('Error al guardar dirección:', err);
    }
  };

  const handleDelete = async (addressId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta dirección?')) return;
    
    try {
      await onSave({ id: addressId }, 'delete');
    } catch (err) {
      console.error('Error al eliminar dirección:', err);
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await onSave({ id: addressId }, 'set-default');
    } catch (err) {
      console.error('Error al establecer dirección principal:', err);
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
          <button onClick={onClose} className="address-modal-close" aria-label="Cerrar">
            <FiX />
          </button>
        </div>

        {error && (
          <div className="address-modal-error">
            {error}
          </div>
        )}

        <div className="address-modal-content">
          <div className="address-list-section">
            <h3>Tus Direcciones</h3>
            
            {addresses.length === 0 ? (
              <div className="address-empty-state">
                <FiMapPin />
                <p>No tienes direcciones guardadas</p>
                <small>Agrega tu primera dirección usando el formulario</small>
              </div>
            ) : (
              <div className="address-list">
                {addresses.map((address) => (
                  <div 
                    key={address.id} 
                    className={`address-item ${address.is_default ? 'is-default' : ''} ${editingAddress === address.id ? 'is-editing' : ''}`}
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
                            onClick={() => handleSetDefault(address.id)}
                            className="address-action-btn btn-set-default"
                            title="Establecer como principal"
                            disabled={loading}
                          >
                            <FiStar />
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(address)}
                          className="address-action-btn btn-edit"
                          title="Editar"
                          disabled={loading}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDelete(address.id)}
                          className="address-action-btn btn-delete"
                          title="Eliminar"
                          disabled={loading || address.is_default}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>

                    <div className="address-item-content">
                      <p className="address-street">
                        {address.street} {address.number}
                        {address.floor && `, Piso ${address.floor}`}
                        {address.apartment && `, Depto ${address.apartment}`}
                      </p>
                      <p className="address-location">
                        {address.city}, {address.province} - CP {address.postal_code}
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
              <h3>{editingAddress ? 'Editar Dirección' : 'Nueva Dirección'}</h3>
              {editingAddress && (
                <button onClick={handleCancel} className="btn-cancel-edit">
                  Cancelar edición
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="address-form">
              <div className="address-form-row">
                <div className="address-form-group">
                  <label htmlFor="alias">Alias *</label>
                  <input
                    type="text"
                    id="alias"
                    name="alias"
                    value={formData.alias}
                    onChange={handleInputChange}
                    placeholder="Casa, Trabajo, Oficina..."
                    maxLength="50"
                    required
                  />
                </div>
              </div>

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
                    required
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
                    required
                  />
                </div>
              </div>

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
                    required
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
                    required
                  />
                </div>
              </div>

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
                    required
                  />
                </div>

                <div className="address-form-group">
                  <label htmlFor="country">País</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>
              </div>

              <div className="address-form-group">
                <label htmlFor="additional_info">Información Adicional</label>
                <textarea
                  id="additional_info"
                  name="additional_info"
                  value={formData.additional_info}
                  onChange={handleInputChange}
                  placeholder="Timbre, entre calles, referencias..."
                  rows="3"
                />
              </div>

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
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="address-spinner-small"></span>
                    {editingAddress ? 'Actualizando...' : 'Guardando...'}
                  </>
                ) : (
                  <>
                    <FiPlus />
                    {editingAddress ? 'Actualizar Dirección' : 'Agregar Dirección'}
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