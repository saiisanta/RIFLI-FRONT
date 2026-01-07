import { useState, useCallback } from 'react';
import userService from '../services/userService';

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchUsers = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getUsers(params);
      setUsers(data.users || data.data || []);
      if (data.pagination) {
        setPagination(data.pagination);
      }
      return data;
    } catch (err) {
      setError(err.message || 'Error al cargar usuarios');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserById = useCallback(async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getUserById(userId);
      setUser(data.user || data);
      return data;
    } catch (err) {
      setError(err.message || 'Error al cargar usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.createUser(userData);
      setUsers((prev) => [data.user || data, ...prev]);
      return data;
    } catch (err) {
      setError(err.message || 'Error al crear usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (userId, userData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.updateUser(userId, userData);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? data.user || data : u))
      );
      if (user?.id === userId) {
        setUser(data.user || data);
      }
      return data;
    } catch (err) {
      setError(err.message || 'Error al actualizar usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const patchUser = useCallback(async (userId, userData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.patchUser(userId, userData);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, ...data.user } : u))
      );
      if (user?.id === userId) {
        setUser((prev) => ({ ...prev, ...data.user }));
      }
      return data;
    } catch (err) {
      setError(err.message || 'Error al actualizar usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const deleteUser = useCallback(async (userId) => {
    try {
      setLoading(true);
      setError(null);
      await userService.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      return true;
    } catch (err) {
      setError(err.message || 'Error al eliminar usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = useCallback(async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getUserProfile(userId);
      return data;
    } catch (err) {
      setError(err.message || 'Error al cargar perfil');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const changePassword = useCallback(async (userId, passwordData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.changePassword(userId, passwordData);
      return data;
    } catch (err) {
      setError(err.message || 'Error al cambiar contraseña');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAvatar = useCallback(async (userId, file) => {
    try {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      formData.append('avatar', file);
      const data = await userService.updateAvatar(userId, formData);
      if (user?.id === userId) {
        setUser((prev) => ({ ...prev, avatar: data.avatar }));
      }
      return data;
    } catch (err) {
      setError(err.message || 'Error al actualizar avatar');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchUserActivity = useCallback(async (userId, params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getUserActivity(userId, params);
      return data;
    } catch (err) {
      setError(err.message || 'Error al cargar actividad');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePreferences = useCallback(async (userId, preferences) => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.updatePreferences(userId, preferences);
      if (user?.id === userId) {
        setUser((prev) => ({ ...prev, preferences: data.preferences }));
      }
      return data;
    } catch (err) {
      setError(err.message || 'Error al actualizar preferencias');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchUserStats = useCallback(async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getUserStats(userId);
      return data;
    } catch (err) {
      setError(err.message || 'Error al cargar estadísticas');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearState = useCallback(() => {
    setUsers([]);
    setUser(null);
    setError(null);
    setPagination({ page: 1, limit: 10, total: 0, totalPages: 0 });
  }, []);

  return {
    users,
    user,
    loading,
    error,
    pagination,
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    patchUser,
    deleteUser,
    fetchUserProfile,
    changePassword,
    updateAvatar,
    fetchUserActivity,
    updatePreferences,
    fetchUserStats,
    clearError,
    clearState,
  };
};

export default useUsers;