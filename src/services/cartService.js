import api from "./api";

const cartService = {
  getCart: async () => {
    const response = await api.get("/carts");
    return response.data;
  },

  addToCart: async ({ product_id, quantity = 1 }) => {
    const response = await api.post("/carts/items", {
      product_id: Number(product_id),
      quantity:   Number(quantity),
    });
    return response.data;
  },

  updateCartItem: async (productId, quantity) => {
    const response = await api.put("/carts/items", {
      product_id: Number(productId),
      quantity:   Number(quantity),
    });
    return response.data;
  },

  removeFromCart: async (productId) => {
    const response = await api.delete(`/carts/items/${productId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete("/carts");
    return response.data;
  },
};

export default cartService;