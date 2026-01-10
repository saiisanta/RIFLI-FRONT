import React, { useState, useRef } from 'react';
import { FiMail, FiPhone, FiMapPin, FiLock, FiAlertTriangle, FiCamera, FiTrash2 } from 'react-icons/fi';
import './ProfileInfo.scss';

const ProfileInfo = ({ profile, onChangePassword, onDeleteAccount, onAvatarChange }) => {
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Solo se permiten imágenes JPG, PNG o WEBP');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('La imagen no debe superar los 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target.result);
    };
    reader.readAsDataURL(file);

    try {
      setUploadingAvatar(true);
      
      // Descomentar en implementacion
      // await onAvatarChange(file);
      
      console.log('Avatar seleccionado:', file.name);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error('Error al subir avatar:', error);
      setAvatarPreview(null);
      alert('Error al subir la imagen');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar tu foto de perfil?')) return;

    try {
      setUploadingAvatar(true);
      setAvatarPreview(null);
      
      // Descomentar en implementacion
      // await onAvatarChange(null);
      
      console.log('Avatar eliminado');
      
    } catch (error) {
      console.error('Error al eliminar avatar:', error);
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <div className="profile-info-grid">
      <div className="profile-info-card profile-avatar-card">
        <div className="profile-info-header">
          <div className="profile-info-icon-label">
            <FiCamera />
            <h2>Foto de Perfil</h2>
          </div>
        </div>

        <div className="profile-info-content">
          <div className="profile-avatar-upload-section">
            <div className="profile-avatar-preview">
              {avatarPreview || profile?.avatar ? (
                <img 
                  src={avatarPreview || profile.avatar} 
                  alt="Avatar preview" 
                  className="avatar-preview-img"
                />
              ) : (
                <div className="avatar-preview-placeholder">
                  <FiCamera />
                </div>
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
              <button 
                onClick={handleAvatarClick} 
                className="avatar-btn btn-upload"
                disabled={uploadingAvatar}
              >
                <FiCamera />
                <span>{profile?.avatar || avatarPreview ? 'Cambiar Foto' : 'Subir Foto'}</span>
              </button>

              {(profile?.avatar || avatarPreview) && (
                <button 
                  onClick={handleRemoveAvatar} 
                  className="avatar-btn btn-remove"
                  disabled={uploadingAvatar}
                >
                  <FiTrash2 />
                  <span>Eliminar</span>
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
            </div>

            <p className="avatar-upload-hint">
              Formatos permitidos: JPG, PNG, WEBP. Tamaño máximo: 5MB
            </p>
          </div>
        </div>
      </div>

      <div className="profile-info-card">
        <div className="profile-info-header">
          <h2>Información Personal</h2>
        </div>

        <div className="profile-info-content">
          <div className="profile-info-row">
            <div className="profile-info-item">
              <span className="profile-info-label">Nombre de Usuario</span>
              <span className="profile-info-value">{profile?.name || 'No especificado'}</span>
            </div>

            <div className="profile-info-item">
              <span className="profile-info-label">Nombre</span>
              <span className="profile-info-value">{profile?.firstName || 'No especificado'}</span>
            </div>
          </div>

          <div className="profile-info-row">
            <div className="profile-info-item">
              <span className="profile-info-label">Apellido</span>
              <span className="profile-info-value">{profile?.lastName || 'No especificado'}</span>
            </div>

            <div className="profile-info-item">
              <div className="profile-info-icon-label">
                <FiMail />
                <span className="profile-info-label">Email</span>
              </div>
              <span className="profile-info-value">{profile?.email}</span>
            </div>
          </div>

          <div className="profile-info-row">
            <div className="profile-info-item">
              <div className="profile-info-icon-label">
                <FiPhone />
                <span className="profile-info-label">Teléfono</span>
              </div>
              <span className="profile-info-value">{profile?.phone || 'No especificado'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-info-card">
        <div className="profile-info-header">
          <div className="profile-info-icon-label">
            <FiMapPin />
            <h2>Dirección</h2>
          </div>
        </div>

        <div className="profile-info-content">
          {profile?.address ? (
            <>
              <div className="profile-info-item">
                <span className="profile-info-label">Calle</span>
                <span className="profile-info-value">{profile.address.street || 'No especificado'}</span>
              </div>

              <div className="profile-info-row">
                <div className="profile-info-item">
                  <span className="profile-info-label">Ciudad</span>
                  <span className="profile-info-value">{profile.address.city || 'No especificado'}</span>
                </div>

                <div className="profile-info-item">
                  <span className="profile-info-label">Código Postal</span>
                  <span className="profile-info-value">{profile.address.zip || 'No especificado'}</span>
                </div>
              </div>
            </>
          ) : (
            <p className="profile-info-empty">No has agregado una dirección</p>
          )}
        </div>
      </div>

      <div className="profile-info-card">
        <div className="profile-info-header">
          <div className="profile-info-icon-label">
            <FiLock />
            <h2>Seguridad</h2>
          </div>
        </div>

        <div className="profile-info-content">
          <p className="profile-security-description">
            Gestiona la seguridad de tu cuenta y mantén tus datos protegidos.
          </p>

          <button onClick={onChangePassword} className="profile-action-btn btn-primary">
            <FiLock />
            <span>Cambiar Contraseña</span>
          </button>
        </div>
      </div>

      <div className="profile-info-card profile-danger-zone">
        <div className="profile-info-header">
          <div className="profile-info-icon-label">
            <FiAlertTriangle />
            <h2>Zona de Peligro</h2>
          </div>
        </div>

        <div className="profile-info-content">
          <p className="profile-danger-description">
            Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, asegúrate de que realmente quieres hacer esto.
          </p>

          <button onClick={onDeleteAccount} className="profile-action-btn btn-danger">
            <FiAlertTriangle />
            <span>Eliminar Cuenta</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;