import api from '../api';

const userService = {

  getUsers: async (params = {}) => {
    try {
      const { page = 1, limit = 10, search = '', role = '' } = params;
      const response = await api.get('/users', {
        params: { page, limit, search, role },
      });
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

  createUser: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  patchUser: async (userId, userData) => {
    try {
      const response = await api.patch(`/users/${userId}`, userData);
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

  getUserProfile: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/profile`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  changePassword: async (userId, passwordData) => {
    try {
      const response = await api.patch(`/users/${userId}/password`, passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateAvatar: async (userId, formData) => {
    try {
      const response = await api.patch(`/users/${userId}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getUserActivity: async (userId, params = {}) => {
    try {
      const { page = 1, limit = 20 } = params;
      const response = await api.get(`/users/${userId}/activity`, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updatePreferences: async (userId, preferences) => {
    try {
      const response = await api.patch(`/users/${userId}/preferences`, preferences);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getUserStats: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/stats`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default userService;