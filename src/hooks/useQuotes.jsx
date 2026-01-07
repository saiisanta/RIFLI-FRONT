import { useState, useCallback, use} from 'react';
import quoteService from '../services/quoteService';

export const useQuotes = () => {
    const [quotes, setQuotes] = useState([]);
    const [quote, setQuote] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const fetchQuotes = useCallback(async (params = {}) => {
      try {
        setLoading(true);
        setError(null);
        const data = await quoteService.getQuotes(params);
        setQuotes(data.quotes || data.data || []);
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
        setQuote(data.quote || data);
        return data;
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
        setQuotes((prev) => [data.quote || data, ...prev]);
        return data;
      } catch (err) {
        setError(err.message || 'Error al crear cotización');
        throw err;
      } finally {
        setLoading(false);
      }
    }, []);
  
    const updateQuote = useCallback(async (quoteId, quoteData) => {
      try {
        setLoading(true);
        setError(null);
        const data = await quoteService.updateQuote(quoteId, quoteData);
        setQuotes((prev) =>
          prev.map((q) => (q.id === quoteId ? data.quote || data : q))
        );
        return data;
      } catch (err) {
        setError(err.message || 'Error al actualizar cotización');
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
        setQuotes((prev) => prev.filter((q) => q.id !== quoteId));
        return true;
      } catch (err) {
        setError(err.message || 'Error al eliminar cotización');
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
        setQuotes((prev) =>
          prev.map((q) => (q.id === quoteId ? { ...q, status: 'accepted' } : q))
        );
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
        setQuotes((prev) =>
          prev.map((q) => (q.id === quoteId ? { ...q, status: 'rejected' } : q))
        );
        return data;
      } catch (err) {
        setError(err.message || 'Error al rechazar cotización');
        throw err;
      } finally {
        setLoading(false);
      }
    }, []);
  
    const convertToOrder = useCallback(async (quoteId) => {
      try {
        setLoading(true);
        setError(null);
        const data = await quoteService.convertToOrder(quoteId);
        return data;
      } catch (err) {
        setError(err.message || 'Error al convertir a pedido');
        throw err;
      } finally {
        setLoading(false);
      }
    }, []);
  
    const clearError = useCallback(() => {
      setError(null);
    }, []);
  
    return {
      quotes,
      quote,
      loading,
      error,
      fetchQuotes,
      fetchQuoteById,
      createQuote,
      updateQuote,
      deleteQuote,
      acceptQuote,
      rejectQuote,
      convertToOrder,
      clearError,
    };
  };

  export default useQuotes;