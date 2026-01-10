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

  const deleteProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await userService.deleteMyProfile();
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
    clearError,
  };
};

export default useProfile;