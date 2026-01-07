import api from '../api';

export const adminService = {
  getDashboard: async () => {
    try {
      const response = await api.get('/admin/dashboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getAdminUsers: async (params = {}) => {
    try {
      const response = await api.get('/admin/users', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  banUser: async (userId, reason = '') => {
    try {
      const response = await api.post(`/admin/users/${userId}/ban`, { reason });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  unbanUser: async (userId) => {
    try {
      const response = await api.post(`/admin/users/${userId}/unban`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getAdminOrders: async (params = {}) => {
    try {
      const response = await api.get('/admin/orders', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getAdminProducts: async (params = {}) => {
    try {
      const response = await api.get('/admin/products', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getAnalytics: async (params = {}) => {
    try {
      const response = await api.get('/admin/analytics', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getLogs: async (params = {}) => {
    try {
      const response = await api.get('/admin/logs', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};