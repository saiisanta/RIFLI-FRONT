import { useState, useCallback } from 'react';
import orderService from '../services/orderService';

const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchOrders = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getOrders(params);
      setOrders(data.orders || data.data || []);
      if (data.pagination) {
        setPagination(data.pagination);
      }
      return data;
    } catch (err) {
      setError(err.message || 'Error al cargar pedidos');
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
      setOrder(data.order || data);
      return data;
    } catch (err) {
      setError(err.message || 'Error al cargar pedido');
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
      setOrders((prev) => [data.order || data, ...prev]);
      return data;
    } catch (err) {
      setError(err.message || 'Error al crear pedido');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = useCallback(async (orderId, status) => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.updateOrderStatus(orderId, status);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
      if (order?.id === orderId) {
        setOrder((prev) => ({ ...prev, status }));
      }
      return data;
    } catch (err) {
      setError(err.message || 'Error al actualizar estado');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [order]);

  const cancelOrder = useCallback(async (orderId, reason = '') => {
    try {
      setLoading(true);
      setError(null);
      await orderService.cancelOrder(orderId, reason);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 'cancelled' } : o))
      );
      if (order?.id === orderId) {
        setOrder((prev) => ({ ...prev, status: 'cancelled' }));
      }
      return true;
    } catch (err) {
      setError(err.message || 'Error al cancelar pedido');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [order]);

  const downloadInvoice = useCallback(async (orderId) => {
    try {
      setLoading(true);
      setError(null);
      const blob = await orderService.getOrderInvoice(orderId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${orderId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      return true;
    } catch (err) {
      setError(err.message || 'Error al descargar factura');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTracking = useCallback(async (orderId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getOrderTracking(orderId);
      return data;
    } catch (err) {
      setError(err.message || 'Error al obtener tracking');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const requestRefund = useCallback(async (orderId, refundData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.requestRefund(orderId, refundData);
      return data;
    } catch (err) {
      setError(err.message || 'Error al solicitar reembolso');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reorder = useCallback(async (orderId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.reorder(orderId);
      return data;
    } catch (err) {
      setError(err.message || 'Error al reordenar');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearState = useCallback(() => {
    setOrders([]);
    setOrder(null);
    setError(null);
    setPagination({ page: 1, limit: 10, total: 0, totalPages: 0 });
  }, []);

  return {
    orders,
    order,
    loading,
    error,
    pagination,
    fetchOrders,
    fetchOrderById,
    createOrder,
    updateStatus,
    cancelOrder,
    downloadInvoice,
    fetchTracking,
    requestRefund,
    reorder,
    clearError,
    clearState,
  };
};

export default useOrders;