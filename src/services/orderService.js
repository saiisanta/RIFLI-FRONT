import api from '../api';

const orderService = {
  
  getOrders: async (params = {}) => {
    try {
      const { page = 1, limit = 10, status = '', sort = 'recent' } = params;
      const response = await api.get('/orders', {
        params: { page, limit, status, sort },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.patch(`/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  cancelOrder: async (orderId, reason = '') => {
    try {
      const response = await api.delete(`/orders/${orderId}`, {
        data: { reason },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getOrderInvoice: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}/invoice`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getOrderTracking: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}/tracking`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  requestRefund: async (orderId, refundData) => {
    try {
      const response = await api.post(`/orders/${orderId}/refund`, refundData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getOrderHistory: async (params = {}) => {
    try {
      const { page = 1, limit = 20 } = params;
      const response = await api.get('/orders/history', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  reorder: async (orderId) => {
    try {
      const response = await api.post(`/orders/${orderId}/reorder`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default orderService;