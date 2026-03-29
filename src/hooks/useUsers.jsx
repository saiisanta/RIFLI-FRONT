import { useState, useCallback } from 'react';
import userService from '../services/userService';

const useUsers = () => {
  const [users, setUsers]   = useState([]);
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);
  // FIX: keys matching backend response (total_pages, not totalPages)
  const [pagination, setPagination] = useState({
    page:        1,
    limit:       10,
    total:       0,
    total_pages: 0,
  });

  // ── Helpers ───────────────────────────────────────────────

  const updateUserInList = (userId, updatedData) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedData } : u));
    setUser(prev => prev?.id === userId ? { ...prev, ...updatedData } : prev);
  };

  // ── Admin ─────────────────────────────────────────────────

  const fetchUsers = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getUsers(params);
      setUsers(data.users || data.data || []);
      if (data.pagination) setPagination(data.pagination);
      return data;
    } catch (err) {
      setError(err.message || err.error || 'Error al cargar usuarios');
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
      setError(err.message || err.error || 'Error al cargar usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const changeRole = useCallback(async (userId, role) => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.changeRole(userId, role);
      const updated = data.user || data;
      updateUserInList(userId, { role: updated.role || role });
      return data;
    } catch (err) {
      setError(err.message || err.error || 'Error al cambiar rol');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (userId) => {
    try {
      setLoading(true);
      setError(null);
      await userService.deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
      return true;
    } catch (err) {
      setError(err.message || err.error || 'Error al eliminar usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Perfil propio ─────────────────────────────────────────

  const getMyProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getMyProfile();
      setUser(data.user || data);
      return data;
    } catch (err) {
      setError(err.message || err.error || 'Error al cargar perfil');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMyProfile = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.updateMyProfile(userData);
      setUser(prev => ({ ...prev, ...(data.user || data) }));
      return data;
    } catch (err) {
      setError(err.message || err.error || 'Error al actualizar perfil');
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
      setError(err.message || err.error || 'Error al cambiar contraseña');
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
      setUser(prev => ({ ...prev, avatar_url: data.avatar_url }));
      return data;
    } catch (err) {
      setError(err.message || err.error || 'Error al actualizar avatar');
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
      setUser(prev => ({ ...prev, avatar_url: null }));
      return data;
    } catch (err) {
      setError(err.message || err.error || 'Error al eliminar avatar');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const clearState = useCallback(() => {
    setUsers([]);
    setUser(null);
    setError(null);
    setPagination({ page: 1, limit: 10, total: 0, total_pages: 0 });
  }, []);

  return {
    users,
    user,
    loading,
    error,
    pagination,
    // admin
    fetchUsers,
    fetchUserById,
    changeRole,
    deleteUser,
    // perfil propio
    getMyProfile,
    updateMyProfile,
    changePassword,
    updateAvatar,
    deleteAvatar,
    clearError,
    clearState,
  };
};

export default useUsers;