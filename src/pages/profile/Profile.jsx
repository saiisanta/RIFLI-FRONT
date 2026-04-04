import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useProfile from '../../hooks/useProfile.jsx';
import addressService from '../../services/addressService';
import ProfileNavbar from './components/ProfileNavbar/ProfileNavbar';
import ProfileHeader from './components/ProfileHeader/ProfileHeader';
import ProfileInfo from './components/ProfileInfo/ProfileInfo';
import ProfileEditModal from './components/ProfileEditModal/ProfileEditModal';
import ChangePasswordModal from './components/ChangePasswordModal/ChangePasswordModal';
import DeleteAccountModal from './components/DeleteAccountModal/DeleteAccountModal';
import AddressManagerModal from './components/AddressManagerModal/AddressManagerModal';
import './Profile.scss';

const Profile = () => {
  const navigate = useNavigate();
  const { 
    profile, 
    loading, 
    error, 
    fetchProfile, 
    updateProfile, 
    changePassword, 
    deleteProfile,
    updateAvatar,
    deleteAvatar,
    clearError 
  } = useProfile();
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  useEffect(() => {
    fetchProfile().catch(err => {
      console.error('Error al cargar perfil:', err);
    });

    return () => clearError();
  }, [fetchProfile, clearError]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleUpdateProfile = async (userData) => {
    try {
      await updateProfile(userData);
      setShowEditModal(false);
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
    }
  };

  const handleChangePassword = async (passwordData) => {
    try {
      await changePassword(passwordData);
      setShowPasswordModal(false);
    } catch (err) {
      console.error('Error al cambiar contraseña:', err);
    }
  };

  const handleDeleteAccount = async (password) => {
    try {
      await deleteProfile(password);
      navigate('/login?account_deleted=true');
    } catch (err) {
      console.error('Error al eliminar cuenta:', err);
    }
  };

  const handleAvatarChange = async (file) => {
    try {
      await updateAvatar(file);
      console.log('Avatar actualizado correctamente');
    } catch (err) {
      console.error('Error al actualizar avatar:', err);
      throw err;
    }
  };

    const handleDeleteAvatar = async () => {
    try {
      await deleteAvatar();
    } catch (error) {
      console.error('Error al eliminar avatar:', error);
    }
  };

  const handleOpenAddressManager = () => {
    setShowEditModal(false);
    setShowAddressModal(true);
  };

  const handleAddressSave = async (addressData, action) => {
    try {
      switch(action) {
        case 'create':
          await addressService.createAddress(addressData);
          console.log('Dirección creada correctamente');
          break;
          
        case 'update':
          await addressService.updateAddress(addressData.id, addressData);
          console.log('Dirección actualizada correctamente');
          break;
          
        case 'delete':
          await addressService.deleteAddress(addressData.id);
          console.log('Dirección eliminada correctamente');
          break;
          
        case 'set-default':
          await addressService.setDefaultAddress(addressData.id);
          console.log('Dirección establecida como principal');
          break;
          
        default:
          console.warn('Acción no reconocida:', action);
      }
      
      await fetchProfile();
      
    } catch (err) {
      console.error('Error al gestionar dirección:', err);
      throw err;
    }
  };

  if (loading && !profile) {
    return (
      <div className="profile-page-wrapper">
        <div className="profile-loading">
          <div className="profile-spinner">
            <div className="profile-spinner-ring"></div>
            <div className="profile-spinner-ring"></div>
            <div className="profile-spinner-ring"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="profile-page-wrapper">
        <div className="profile-error-state">
          <h3>Error al cargar perfil</h3>
          <p>{error}</p>
          <button onClick={fetchProfile} className="profile-error-btn">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page-wrapper">
      <ProfileNavbar onLogout={handleLogout} />
      
      <div className="profile-container">
        <ProfileHeader
          profile={profile}
          onEditProfile={() => setShowEditModal(true)}
        />

        <ProfileInfo
          profile={profile}
          onChangePassword={() => setShowPasswordModal(true)}
          onDeleteAccount={() => setShowDeleteModal(true)}
          onAvatarChange={handleAvatarChange}
          onAvatarDelete={handleDeleteAvatar}
        />
      </div>

      {showEditModal && (
        <ProfileEditModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onSave={handleUpdateProfile}
          onOpenAddressManager={handleOpenAddressManager}
          loading={loading}
          error={error}
        />
      )}

      {showPasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowPasswordModal(false)}
          onSave={handleChangePassword}
          loading={loading}
          error={error}
        />
      )}

      {showDeleteModal && (
        <DeleteAccountModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteAccount}
          loading={loading}
          error={error}
        />
      )}

      {showAddressModal && (
        <AddressManagerModal
          addresses={profile?.Addresses || []}
          onClose={() => setShowAddressModal(false)}
          onSave={handleAddressSave}
          loading={loading}
          error={error}
        />
      )}
    </div>
  );
};

export default Profile;