import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import orderService from '../services/orderService';

const ORDERS_KEY = ['orders'];

const useOrders = (params = {}) => {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: [...ORDERS_KEY, params],
    queryFn: () => orderService.getOrders(params),
    staleTime: 1000 * 60 * 2,
    select: (d) => ({
      orders: Array.isArray(d) ? d : (d.orders ?? d.data ?? []),
      pagination: d.pagination ?? { page: 1, limit: 10, total: 0, total_pages: 0 },
    }),
  });

  const orders     = data?.orders     ?? [];
  const pagination = data?.pagination ?? { page: 1, limit: 10, total: 0, total_pages: 0 };
  const error      = queryError?.message ?? queryError?.error ?? null;

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ORDERS_KEY });

  const patchOrder = (orderId, patch) =>
    queryClient.setQueriesData({ queryKey: ORDERS_KEY }, (prev) => {
      if (!prev) return prev;
      const list = prev.orders ?? prev;
      const updated = Array.isArray(list)
        ? list.map((o) => (o.id === orderId ? { ...o, ...patch } : o))
        : list;
      return prev.orders ? { ...prev, orders: updated } : updated;
    });

  const createMutation = useMutation({
    mutationFn: orderService.createOrder,
    onSuccess: invalidate,
  });

  const cancelMutation = useMutation({
    mutationFn: ({ orderId, reason }) => orderService.cancelOrder(orderId, reason),
    onSuccess: (data, { orderId }) =>
      patchOrder(orderId, { status: 'CANCELLED', ...(data.order ?? data) }),
  });

  const confirmShippingMutation = useMutation({
    mutationFn: ({ orderId, action, reason }) =>
      orderService.confirmShipping(orderId, action, reason),
    onSuccess: (data, { orderId }) => patchOrder(orderId, data.order ?? data),
  });

  const uploadProofMutation = useMutation({
    mutationFn: ({ orderId, file, proofData }) =>
      orderService.uploadPaymentProof(orderId, file, proofData),
    onSuccess: (_, { orderId }) => patchOrder(orderId, { payment_status: 'PROOF_UPLOADED' }),
  });

  const setShippingCostMutation = useMutation({
    mutationFn: ({ orderId, shippingData }) => orderService.setShippingCost(orderId, shippingData),
    onSuccess: (data, { orderId }) => patchOrder(orderId, data),
  });

  const reviewProofMutation = useMutation({
    mutationFn: ({ orderId, reviewData }) => orderService.reviewProof(orderId, reviewData),
    onSuccess: (data, { orderId }) => patchOrder(orderId, data),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, statusData }) => orderService.updateOrderStatus(orderId, statusData),
    onSuccess: (data, { orderId }) => patchOrder(orderId, data),
  });

  return {
    orders,
    order: null,
    loading,
    error,
    pagination,
    fetchOrders: invalidate,
    fetchOrderById: orderService.getOrderById,
    createOrder: createMutation.mutateAsync,
    cancelOrder: (orderId, reason = '') => cancelMutation.mutateAsync({ orderId, reason }),
    confirmShipping: (orderId, action, reason = '') =>
      confirmShippingMutation.mutateAsync({ orderId, action, reason }),
    uploadPaymentProof: (orderId, file, proofData = {}) =>
      uploadProofMutation.mutateAsync({ orderId, file, proofData }),
    setShippingCost: (orderId, shippingData) =>
      setShippingCostMutation.mutateAsync({ orderId, shippingData }),
    reviewProof: (orderId, reviewData) =>
      reviewProofMutation.mutateAsync({ orderId, reviewData }),
    updateOrderStatus: (orderId, statusData) =>
      updateStatusMutation.mutateAsync({ orderId, statusData }),
    clearError: () => {},
    clearState: () => queryClient.removeQueries({ queryKey: ORDERS_KEY }),
  };
};

export default useOrders;