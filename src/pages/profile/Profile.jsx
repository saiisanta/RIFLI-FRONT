import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useProfile from '../../hooks/useProfile.jsx';
import useApiError from '../../hooks/useApiError';
import RateLimitToast from '../../components/RateLimitToast/RateLimitToast';
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
  const { profile, loading, error, updateProfile, changePassword, deleteProfile, updateAvatar, deleteAvatar } = useProfile();
  const { rateLimitError, handleApiError, clearRateLimitError } = useApiError();

  const [showEditModal,     setShowEditModal]     = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal,   setShowDeleteModal]   = useState(false);
  const [showAddressModal,  setShowAddressModal]  = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleUpdateProfile = async (userData) => {
    try {
      await updateProfile(userData);
      setShowEditModal(false);
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleChangePassword = async (passwordData) => {
    try {
      await changePassword(passwordData);
      setShowPasswordModal(false);
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleDeleteAccount = async (password) => {
    try {
      await deleteProfile(password);
      navigate('/login?account_deleted=true');
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleAvatarChange = async (file) => {
    try {
      await updateAvatar(file);
    } catch (err) {
      handleApiError(err);
      throw err;
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      await deleteAvatar();
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleOpenAddressManager = () => {
    setShowEditModal(false);
    setShowAddressModal(true);
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
        </div>
      </div>
    );
  }

  return (
    <>
      <RateLimitToast message={rateLimitError} onClose={clearRateLimitError} />

      <div className="profile-page-wrapper">
        <ProfileNavbar onLogout={handleLogout} />

        <div className="profile-container">
          <ProfileHeader profile={profile} onEditProfile={() => setShowEditModal(true)} />
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
          <AddressManagerModal onClose={() => setShowAddressModal(false)} />
        )}
      </div>
    </>
  );
};

export default Profile;