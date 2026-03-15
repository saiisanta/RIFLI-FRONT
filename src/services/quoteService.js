import api from "./api";

export const quoteService = {
  getQuotes: async (params = {}) => {
    try {
      const response = await api.get("/quotes", { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getQuoteById: async (quoteId) => {
    try {
      const response = await api.get(`/quotes/${quoteId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createQuote: async (quoteData) => {
    try {
      const response = await api.post("/quotes", quoteData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateQuote: async (quoteId, quoteData) => {
    try {
      const response = await api.put(`/quotes/${quoteId}`, quoteData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteQuote: async (quoteId) => {
    try {
      const response = await api.delete(`/quotes/${quoteId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  acceptQuote: async (quoteId) => {
    const response = await api.patch(`/quotes/${quoteId}/status`, {
      status: "ACCEPTED",
    });
    return response.data;
  },
  
  rejectQuote: async (quoteId, reason = "") => {
    const response = await api.patch(`/quotes/${quoteId}/status`, {
      status: "REJECTED",
      rejection_reason: reason,
    });
    return response.data;
  },

  convertToOrder: async (quoteId) => {
    try {
      const response = await api.post(`/quotes/${quoteId}/convert-to-order`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default quoteService;
