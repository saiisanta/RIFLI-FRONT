import { useState, useCallback } from 'react';
import orderService from '../services/orderService';

const useOrders = () => {
  const [orders, setOrders]   = useState([]);
  const [order, setOrder]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [pagination, setPagination] = useState({
    page: 1, limit: 10, total: 0, total_pages: 0,
  });

  const updateOrderInList = (orderId, updatedData) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updatedData } : o));
    setOrder(prev => prev?.id === orderId ? { ...prev, ...updatedData } : prev);
  };

  // ── Cliente ───────────────────────────────────────────────

  const fetchOrders = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getOrders(params);
      setOrders(Array.isArray(data) ? data : data.orders || data.data || []);
      if (data.pagination) setPagination(data.pagination);
      return data;
    } catch (err) {
      setError(err.message || err.error || 'Error al cargar pedidos');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrderById = useCallback(async (orderId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getOrderById(orderId);
      const o = data.order || data;
      setOrder(o);
      return o;
    } catch (err) {
      setError(err.message || err.error || 'Error al cargar pedido');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrder = useCallback(async (orderData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.createOrder(orderData);
      const newOrder = data.order || data;
      setOrders(prev => [newOrder, ...prev]);
      return newOrder;
    } catch (err) {
      setError(err.message || err.error || 'Error al crear pedido');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelOrder = useCallback(async (orderId, reason = '') => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.cancelOrder(orderId, reason);
      updateOrderInList(orderId, { status: 'CANCELLED', ...(data.order || data) });
      return data;
    } catch (err) {
      setError(err.message || err.error || 'Error al cancelar pedido');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // NUEVO: cliente confirma o rechaza el precio de envío
  const confirmShipping = useCallback(async (orderId, action, cancellation_reason = '') => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.confirmShipping(orderId, action, cancellation_reason);
      const updated = data.order || data;
      updateOrderInList(orderId, updated);
      return data;
    } catch (err) {
      setError(err.message || err.error || 'Error al confirmar envío');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadPaymentProof = useCallback(async (orderId, file, proofData = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.uploadPaymentProof(orderId, file, proofData);
      updateOrderInList(orderId, { payment_status: 'PROOF_UPLOADED' });
      return data;
    } catch (err) {
      setError(err.message || err.error || 'Error al subir comprobante');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Admin ─────────────────────────────────────────────────

  const setShippingCost = useCallback(async (orderId, shippingData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.setShippingCost(orderId, shippingData);
      updateOrderInList(orderId, data);
      return data;
    } catch (err) {
      setError(err.message || err.error || 'Error al setear costo de envío');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reviewProof = useCallback(async (orderId, reviewData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.reviewProof(orderId, reviewData);
      updateOrderInList(orderId, data);
      return data;
    } catch (err) {
      setError(err.message || err.error || 'Error al revisar comprobante');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrderStatus = useCallback(async (orderId, statusData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.updateOrderStatus(orderId, statusData);
      updateOrderInList(orderId, data);
      return data;
    } catch (err) {
      setError(err.message || err.error || 'Error al actualizar estado');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const clearState = useCallback(() => {
    setOrders([]);
    setOrder(null);
    setError(null);
    setPagination({ page: 1, limit: 10, total: 0, total_pages: 0 });
  }, []);

  return {
    orders,
    order,
    loading,
    error,
    pagination,
    // cliente
    fetchOrders,
    fetchOrderById,
    createOrder,
    cancelOrder,
    confirmShipping,
    uploadPaymentProof,
    // admin
    setShippingCost,
    reviewProof,
    updateOrderStatus,
    clearError,
    clearState,
  };
};

export default useOrders;