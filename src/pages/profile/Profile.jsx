import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useProfile from '../../hooks/useProfile';
import ProfileNavbar from './components/ProfileNavbar/ProfileNavbar';
import ProfileHeader from './components/ProfileHeader/ProfileHeader';
import ProfileInfo from './components/ProfileInfo/ProfileInfo';
import ProfileEditModal from './components/ProfileEditModal/ProfileEditModal';
import ChangePasswordModal from './components/ChangePasswordModal/ChangePasswordModal';
import DeleteAccountModal from './components/DeleteAccountModal/DeleteAccountModal';
import './Profile.scss';

const Profile = () => {
  const navigate = useNavigate();
  const { profile, loading, error, fetchProfile, updateProfile, changePassword, deleteProfile, clearError } = useProfile();
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const handleDeleteAccount = async () => {
    try {
      await deleteProfile();
      navigate('/login?account_deleted=true');
    } catch (err) {
      console.error('Error al eliminar cuenta:', err);
    }
  };

  const handleAvatarChange = async (file) => {
    try {
      console.log('Avatar actualizado:', file);
      await fetchProfile();
    } catch (err) {
      console.error('Error al actualizar avatar:', err);
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
        />
      </div>

      {showEditModal && (
        <ProfileEditModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onSave={handleUpdateProfile}
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
    </div>
  );
};

export default Profile;