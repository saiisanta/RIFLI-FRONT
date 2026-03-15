// hooks/useQuotes.js
import { useState, useCallback } from 'react';
import quoteService from '../services/quoteService';

export const useQuotes = () => {
  const [quotes, setQuotes]   = useState([]);
  const [quote, setQuote]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  // ── Helpers ───────────────────────────────────────────────

  const updateQuoteInList = (quoteId, updatedData) => {
    setQuotes(prev =>
      prev.map(q => q.id === quoteId ? { ...q, ...updatedData } : q)
    );
    setQuote(prev => prev?.id === quoteId ? { ...prev, ...updatedData } : prev);
  };

  // ── Cliente ───────────────────────────────────────────────

  const fetchQuotes = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await quoteService.getQuotes(params);
      setQuotes(Array.isArray(data) ? data : data.quotes || data.data || []);
      return data;
    } catch (err) {
      setError(err.message || 'Error al cargar cotizaciones');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchQuoteById = useCallback(async (quoteId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await quoteService.getQuoteById(quoteId);
      const q = data.quote || data;
      setQuote(q);
      return q;
    } catch (err) {
      setError(err.message || 'Error al cargar cotización');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createQuote = useCallback(async (quoteData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await quoteService.createQuote(quoteData);
      const newQuote = data.quote || data;
      setQuotes(prev => [newQuote, ...prev]);
      return newQuote;
    } catch (err) {
      setError(err.message || 'Error al crear cotización');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const acceptQuote = useCallback(async (quoteId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await quoteService.acceptQuote(quoteId);
      updateQuoteInList(quoteId, { status: 'ACCEPTED', accepted_at: data.accepted_at });
      return data;
    } catch (err) {
      setError(err.message || 'Error al aceptar cotización');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const rejectQuote = useCallback(async (quoteId, reason = '') => {
    try {
      setLoading(true);
      setError(null);
      const data = await quoteService.rejectQuote(quoteId, reason);
      updateQuoteInList(quoteId, { status: 'REJECTED' });
      return data;
    } catch (err) {
      setError(err.message || 'Error al rechazar cotización');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadPaymentProof = useCallback(async (quoteId, file, paymentType) => {
    try {
      setLoading(true);
      setError(null);
      const data = await quoteService.uploadPaymentProof(quoteId, file, paymentType);
      const field = paymentType === 'deposit'
        ? { deposit_proof_url: data.proof_url, deposit_payment_status: 'PROOF_UPLOADED' }
        : { final_proof_url:   data.proof_url, final_payment_status:   'PROOF_UPLOADED' };
      updateQuoteInList(quoteId, field);
      return data;
    } catch (err) {
      setError(err.message || 'Error al subir comprobante');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Admin ─────────────────────────────────────────────────

  const addBudget = useCallback(async (quoteId, budgetData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await quoteService.addBudget(quoteId, budgetData);
      const updated = data.quote || data;
      updateQuoteInList(quoteId, updated);
      return updated;
    } catch (err) {
      setError(err.message || 'Error al guardar presupuesto');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadBudgetPdf = useCallback(async (quoteId, pdfBlob) => {
    try {
      setLoading(true);
      setError(null);
      const data = await quoteService.uploadBudgetPdf(quoteId, pdfBlob);
      updateQuoteInList(quoteId, { budget_pdf: data.pdf_url });
      return data;
    } catch (err) {
      setError(err.message || 'Error al subir PDF de presupuesto');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = useCallback(async (quoteId, status, extra = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await quoteService.updateStatus(quoteId, status, extra);
      updateQuoteInList(quoteId, data);
      return data;
    } catch (err) {
      setError(err.message || 'Error al actualizar estado');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reviewProof = useCallback(async (quoteId, paymentType, action, rejectionReason = '') => {
    try {
      setLoading(true);
      setError(null);
      const data = await quoteService.reviewProof(quoteId, paymentType, action, rejectionReason);
      updateQuoteInList(quoteId, data);
      return data;
    } catch (err) {
      setError(err.message || 'Error al revisar comprobante');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteQuote = useCallback(async (quoteId) => {
    try {
      setLoading(true);
      setError(null);
      await quoteService.deleteQuote(quoteId);
      setQuotes(prev => prev.filter(q => q.id !== quoteId));
      return true;
    } catch (err) {
      setError(err.message || 'Error al eliminar cotización');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    quotes,
    quote,
    loading,
    error,
    // cliente
    fetchQuotes,
    fetchQuoteById,
    createQuote,
    acceptQuote,
    rejectQuote,
    uploadPaymentProof,
    // admin
    addBudget,
    uploadBudgetPdf,
    updateStatus,
    reviewProof,
    deleteQuote,
    clearError,
  };
};

export default useQuotes;