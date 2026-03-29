import api from "./api";

const cartService = {
  getCart: async () => {
    try {
      const response = await api.get("/carts");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  addToCart: async ({ product_id, quantity = 1 }) => {
    try {
      const response = await api.post("/carts/items", {
        product_id: Number(product_id),
        quantity: Number(quantity),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateCartItem: async (productId, quantity) => {
    try {
      const response = await api.put("/carts/items", {
        product_id: Number(productId),
        quantity: Number(quantity),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  removeFromCart: async (productId) => {
    try {
      const response = await api.delete(`/carts/items/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  clearCart: async () => {
    try {
      const response = await api.delete("/carts");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default cartService;
