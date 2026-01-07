import api from '../api';

const cartService = {

  getCart: async () => {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  addToCart: async (productData) => {
    try {
      const response = await api.post('/cart/items', productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateCartItem: async (itemId, quantity) => {
    try {
      const response = await api.patch(`/cart/items/${itemId}`, { quantity });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  removeFromCart: async (itemId) => {
    try {
      const response = await api.delete(`/cart/items/${itemId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  clearCart: async () => {
    try {
      const response = await api.delete('/cart');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  checkout: async (checkoutData) => {
    try {
      const response = await api.post('/cart/checkout', checkoutData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  applyCoupon: async (couponCode) => {
    try {
      const response = await api.post('/cart/coupon', { code: couponCode });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  removeCoupon: async () => {
    try {
      const response = await api.delete('/cart/coupon');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  calculateTotals: async () => {
    try {
      const response = await api.get('/cart/totals');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default cartService;
