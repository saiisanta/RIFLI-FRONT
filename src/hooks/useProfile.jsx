import { useState, useCallback } from 'react';
import userService from '../services/userService';

const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getMyProfile();
      setProfile(data.user || data);
      return data;
    } catch (err) {
      const errorMessage = err.error || err.message || 'Error al cargar perfil';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.updateMyProfile(userData);
      setProfile(data.user || data);
      return data;
    } catch (err) {
      const errorMessage = err.error || err.message || 'Error al actualizar perfil';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const changePassword = useCallback(async (passwordData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.changePassword(passwordData);
      return data;
    } catch (err) {
      const errorMessage = err.error || err.message || 'Error al cambiar contraseña';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProfile = useCallback(async (password) => {
    try {
      setLoading(true);
      setError(null);
      await userService.deleteMyProfile(password); // ← pasar password
      setProfile(null);
      return true;
    } catch (err) {
      const errorMessage = err.error || err.message || 'Error al eliminar perfil';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAvatar = useCallback(async (file) => {
    try {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      formData.append('avatar', file);
      const data = await userService.updateAvatar(formData);
      setProfile((prev) => ({ ...prev, avatar_url: data.avatar_url || data.user?.avatar_url }));
      
      return data;
    } catch (err) {
      const errorMessage = err.error || err.message || 'Error al actualizar avatar';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAvatar = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.deleteAvatar();
      
      setProfile((prev) => ({ ...prev, avatar_url: null }));
      
      return data;
    } catch (err) {
      const errorMessage = err.error || err.message || 'Error al eliminar avatar';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    changePassword,
    deleteProfile,
    updateAvatar,
    deleteAvatar,
    clearError,
  };
};

export default useProfile;