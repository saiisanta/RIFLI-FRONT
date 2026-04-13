import api from './api';

export const quoteService = {

  getQuotes: async (params = {}) => {
    const response = await api.get('/quotes', { params });
    return response.data;
  },

  getQuoteById: async (quoteId) => {
    const response = await api.get(`/quotes/${quoteId}`);
    return response.data;
  },

  createQuote: async (quoteData) => {
    const response = await api.post('/quotes', quoteData);
    return response.data;
  },

  acceptQuote: async (quoteId) => {
    const response = await api.patch(`/quotes/${quoteId}/status`, { status: 'ACCEPTED' });
    return response.data;
  },

  rejectQuote: async (quoteId, reason = '') => {
    const response = await api.patch(`/quotes/${quoteId}/status`, {
      status: 'REJECTED',
      rejection_reason: reason,
    });
    return response.data;
  },

  uploadPaymentProof: async (quoteId, file, paymentType) => {
    const formData = new FormData();
    formData.append('proof', file);
    formData.append('payment_type', paymentType);
    const response = await api.post(`/quotes/${quoteId}/payment-proof`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  addBudget: async (quoteId, budgetData) => {
    const response = await api.put(`/quotes/${quoteId}/budget`, budgetData);
    return response.data;
  },

  uploadBudgetPdf: async (quoteId, pdfBlob) => {
    const formData = new FormData();
    formData.append('pdf', pdfBlob, `presupuesto-${quoteId}.pdf`);
    const response = await api.post(`/quotes/${quoteId}/budget/pdf`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateStatus: async (quoteId, status, extra = {}) => {
    const response = await api.patch(`/quotes/${quoteId}/status`, { status, ...extra });
    return response.data;
  },

  reviewProof: async (quoteId, paymentType, action, rejectionReason = '') => {
    const response = await api.patch(`/quotes/${quoteId}/review-proof`, {
      payment_type:     paymentType,
      action,
      rejection_reason: rejectionReason,
    });
    return response.data;
  },

  deleteQuote: async (quoteId) => {
    const response = await api.delete(`/quotes/${quoteId}`);
    return response.data;
  },
};

export default quoteService;