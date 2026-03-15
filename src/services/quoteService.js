// services/quoteService.js
import api from './api';

export const quoteService = {

  // ── Cliente ────────────────────────────────────────────────

  getQuotes: async (params = {}) => {
    try {
      const response = await api.get('/quotes', { params });
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
      const response = await api.post('/quotes', quoteData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  acceptQuote: async (quoteId) => {
    try {
      const response = await api.patch(`/quotes/${quoteId}/status`, { status: 'ACCEPTED' });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  rejectQuote: async (quoteId, reason = '') => {
    try {
      const response = await api.patch(`/quotes/${quoteId}/status`, {
        status: 'REJECTED',
        rejection_reason: reason,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cliente sube comprobante de seña o pago final
  uploadPaymentProof: async (quoteId, file, paymentType) => {
    try {
      const formData = new FormData();
      formData.append('proof', file);
      formData.append('payment_type', paymentType); // 'deposit' | 'final'
      const response = await api.post(`/quotes/${quoteId}/payment-proof`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // ── Admin ──────────────────────────────────────────────────

  // Crear / editar el presupuesto (materiales + mano de obra)
  addBudget: async (quoteId, budgetData) => {
    try {
      const response = await api.put(`/quotes/${quoteId}/budget`, budgetData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Subir el PDF generado desde el front
  uploadBudgetPdf: async (quoteId, pdfBlob) => {
    try {
      const formData = new FormData();
      formData.append('pdf', pdfBlob, `presupuesto-${quoteId}.pdf`);
      const response = await api.post(`/quotes/${quoteId}/budget/pdf`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cambiar estado desde el admin (IN_PROGRESS, COMPLETED, CANCELLED…)
  updateStatus: async (quoteId, status, extra = {}) => {
    try {
      const response = await api.patch(`/quotes/${quoteId}/status`, { status, ...extra });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Aprobar o rechazar comprobante de pago
  reviewProof: async (quoteId, paymentType, action, rejectionReason = '') => {
    try {
      const response = await api.patch(`/quotes/${quoteId}/review-proof`, {
        payment_type: paymentType,  // 'deposit' | 'final'
        action,                     // 'approve' | 'reject'
        rejection_reason: rejectionReason,
      });
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
};

export default quoteService;