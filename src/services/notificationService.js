import api from '../api';

const notificationService = {
  getNotifications: async (params = {}) => {
    try {
      const { page = 1, limit = 20, unread = false } = params;
      const response = await api.get('/notifications', {
        params: { page, limit, unread },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getNotificationById: async (notificationId) => {
    try {
      const response = await api.get(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  markAsRead: async (notificationId) => {
    try {
      const response = await api.patch(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  markAllAsRead: async () => {
    try {
      const response = await api.patch('/notifications/read-all');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteNotification: async (notificationId) => {
    try {
      const response = await api.delete(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteAll: async () => {
    try {
      const response = await api.delete('/notifications');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getUnreadCount: async () => {
    try {
      const response = await api.get('/notifications/unread-count');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default notificationService;
