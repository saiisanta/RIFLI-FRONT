import api from './api';

const userService = {

  // ── Perfil propio ──────────────────────────────────────────

  getMyProfile: async () => {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateMyProfile: async (userData) => {
    try {
      const response = await api.put('/users/me', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteMyProfile: async (password) => {
    try {
      const response = await api.delete('/users/me', { data: { password } });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/users/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateAvatar: async (formData) => {
    try {
      const response = await api.patch('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteAvatar: async () => {
    try {
      const response = await api.delete('/users/avatar');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // ── Admin ──────────────────────────────────────────────────

  // FIX: incluye todos los query params que soporta el backend
  getUsers: async (params = {}) => {
    try {
      const { page = 1, limit = 10, search = '', role = '', is_verified, address = '' } = params;
      const query = { page, limit };
      if (search)                  query.search      = search;
      if (role)                    query.role        = role;
      if (is_verified !== undefined && is_verified !== '') query.is_verified = is_verified;
      if (address)                 query.address     = address;

      const response = await api.get('/users', { params: query });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getUserById: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  changeRole: async (userId, role) => {
    try {
      const response = await api.put(`/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default userService;