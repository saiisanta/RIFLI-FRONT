import api from './api';

const authService = {
  
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data.error || error;
    }
  },

  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      throw error.response?.data.error || error;
    }
  },

  refreshToken: async () => {
    try {
      const response = await api.post('/auth/refresh-token');
      return response.data;
    } catch (error) {
      throw error.response?.data.error || error;
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await api.post('/user/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data.error || error;
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post(`/user/reset-password/${token}`, {
        newPassword
      });
      return response.data;
    } catch (error) {
      throw error.response?.data.error || error;
    }
  },

  verifyEmail: async (token) => {
    try {
      const response = await api.get(`/auth/verify-email/${token}`);
      return response.data;
    } catch (error) {
      throw error.response?.data.error || error;
    }
  },

  resendVerification: async (email) => {
    try {
      const response = await api.post('/auth/resend-verification', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data.error || error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data.error || error;
    }
  },

  checkAuth: async () => {
    try {
      const response = await api.get('/auth/check');
      return response.data;
    } catch (error) {
      throw error.response?.data.error || error;
    }
  },
};

export default authService;