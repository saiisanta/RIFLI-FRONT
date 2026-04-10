import React, { useState, useRef } from 'react';
import { FiMail, FiPhone, FiMapPin, FiLock, FiAlertTriangle, FiCamera, FiTrash2, FiFileText } from 'react-icons/fi';
import useAddresses  from '../../../../hooks/useAddress';;
import './ProfileInfo.scss';

const ProfileInfo = ({ profile, onChangePassword, onDeleteAccount, onAvatarChange, onAvatarDelete }) => {
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  const { addresses, loading: addressLoading } = useAddresses();
  const selectedAddress = addresses.find((a) => a.is_default) ?? addresses[0] ?? null;

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Solo se permiten imágenes JPG, PNG o WEBP');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar los 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setAvatarPreview(e.target.result);
    reader.readAsDataURL(file);

    try {
      setUploadingAvatar(true);
      await onAvatarChange(file);
      setAvatarPreview(null);
    } catch (error) {
      console.error(error);
      setAvatarPreview(null);
      alert('Error al subir la imagen');
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const formatDocumentNumber = (number) => {
    if (!number) return 'No especificado';
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const displayAvatar = avatarPreview || profile?.avatar_url;

  return (
    <div className="profile-info-grid">
      <div className="profile-info-card profile-avatar-card">
        <div className="profile-info-header">
          <div className="profile-info-icon-label"><FiCamera /><h2>Foto de Perfil</h2></div>
        </div>
        <div className="profile-info-content">
          <div className="profile-avatar-upload-section">
            <div className="profile-avatar-preview">
              {displayAvatar ? (
                <img
                  src={avatarPreview ? avatarPreview : `http://localhost:4001${profile.avatar_url}`}
                  alt="Avatar"
                  className="avatar-preview-img"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : (
                <div className="avatar-preview-placeholder"><FiCamera /></div>
              )}
              {uploadingAvatar && (
                <div className="avatar-upload-overlay">
                  <div className="avatar-upload-spinner">
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                  </div>
                </div>
              )}
            </div>
            <div className="profile-avatar-actions">
              <button onClick={handleAvatarClick} className="avatar-btn btn-upload" disabled={uploadingAvatar}>
                <FiCamera /><span>{displayAvatar ? 'Cambiar Foto' : 'Subir Foto'}</span>
              </button>
              {profile?.avatar_url && (
                <button onClick={() => onAvatarDelete()} className="avatar-btn btn-remove" disabled={uploadingAvatar}>
                  <FiTrash2 /><span>Eliminar</span>
                </button>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="profile-info-card">
        <div className="profile-info-header"><h2>Información Personal</h2></div>
        <div className="profile-info-content">
          <div className="profile-info-row">
            <div className="profile-info-item"><span className="profile-info-label">Nombre</span><span className="profile-info-value">{profile?.first_name || 'No especificado'}</span></div>
            <div className="profile-info-item"><span className="profile-info-label">Apellido</span><span className="profile-info-value">{profile?.last_name || 'No especificado'}</span></div>
          </div>
          <div className="profile-info-row">
            <div className="profile-info-item"><div className="profile-info-icon-label"><FiMail /><span className="profile-info-label">Email</span></div><span className="profile-info-value">{profile?.email}</span></div>
            <div className="profile-info-item"><div className="profile-info-icon-label"><FiPhone /><span className="profile-info-label">Teléfono</span></div><span className="profile-info-value">{profile?.phone || 'No especificado'}</span></div>
          </div>
        </div>
      </div>

      <div className="profile-info-card">
        <div className="profile-info-header"><div className="profile-info-icon-label"><FiFileText /><h2>Documentación</h2></div></div>
        <div className="profile-info-content">
          <div className="profile-info-row">
            <div className="profile-info-item"><span className="profile-info-label">Tipo</span><span className="profile-info-value">{profile?.document_type || 'DNI'}</span></div>
            <div className="profile-info-item"><span className="profile-info-label">Número</span><span className="profile-info-value">{formatDocumentNumber(profile?.document_number)}</span></div>
          </div>
        </div>
      </div>

      <div className="profile-info-card">
        <div className="profile-info-header"><div className="profile-info-icon-label"><FiMapPin /><h2>Dirección Principal</h2></div></div>
        <div className="profile-info-content">
          {addressLoading ? (
            <p className="profile-info-empty">Cargando dirección...</p>
          ) : selectedAddress ? (
            <>
              <div className="profile-info-item">
                <span className="profile-info-label">Alias</span>
                <span className="profile-info-value profile-address-alias">{selectedAddress.alias}</span>
              </div>
              <div className="profile-info-item">
                <span className="profile-info-label">Dirección</span>
                <span className="profile-info-value">
                  {selectedAddress.street} {selectedAddress.number}
                  {selectedAddress.floor && `, Piso ${selectedAddress.floor}`}
                  {selectedAddress.apartment && `, Depto ${selectedAddress.apartment}`}
                </span>
              </div>
              <div className="profile-info-row">
                <div className="profile-info-item"><span className="profile-info-label">Ciudad</span><span className="profile-info-value">{selectedAddress.city}</span></div>
                <div className="profile-info-item"><span className="profile-info-label">Provincia</span><span className="profile-info-value">{selectedAddress.province}</span></div>
              </div>
            </>
          ) : (
            <p className="profile-info-empty">No hay dirección cargada</p>
          )}
        </div>
      </div>

      <div className="profile-info-card">
        <div className="profile-info-header"><div className="profile-info-icon-label"><FiLock /><h2>Seguridad</h2></div></div>
        <div className="profile-info-content">
          <button onClick={onChangePassword} className="profile-action-btn btn-primary"><FiLock /><span>Cambiar Contraseña</span></button>
        </div>
      </div>

      <div className="profile-info-card profile-danger-zone">
        <div className="profile-info-header"><div className="profile-info-icon-label"><FiAlertTriangle /><h2>Zona de Peligro</h2></div></div>
        <div className="profile-info-content">
          <button onClick={onDeleteAccount} className="profile-action-btn btn-danger"><FiAlertTriangle /><span>Eliminar Cuenta</span></button>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;