import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import cartService from '../services/cartService';

const CART_KEY = ['cart'];

const parseCart = (data) => {
  const c = data?.cart ?? data;
  return {
    cart: c ?? null,
    items: c?.items ?? [],
    totals: {
      subtotal: Number(c?.subtotal) || 0,
      total:    Number(c?.total)    || Number(c?.subtotal) || 0,
      tax:      Number(c?.tax)      || 0,
      shipping: Number(c?.shipping) || 0,
      discount: Number(c?.discount) || 0,
    },
  };
};

const useCart = () => {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: CART_KEY,
    queryFn: cartService.getCart,
    staleTime: 1000 * 60 * 2,
    retry: false,
    select: parseCart,
  });

  const cart   = data?.cart   ?? null;
  const items  = data?.items  ?? [];
  const totals = data?.totals ?? { subtotal: 0, total: 0, tax: 0, shipping: 0, discount: 0 };
  const error  = queryError?.status === 404 ? null : (queryError?.message ?? null);

  const setCart = (responseData) => queryClient.setQueryData(CART_KEY, responseData);

  const addMutation = useMutation({
    mutationFn: cartService.addToCart,
    onSuccess: setCart,
  });

  const updateMutation = useMutation({
    mutationFn: ({ productId, quantity }) => cartService.updateCartItem(productId, quantity),
    onSuccess: setCart,
  });

  const removeMutation = useMutation({
    mutationFn: cartService.removeFromCart,
    onSuccess: setCart,
  });

  const clearMutation = useMutation({
    mutationFn: cartService.clearCart,
    onSuccess: () => queryClient.setQueryData(CART_KEY, null),
  });

  const isInCart = (productId) =>
    items.some((item) => item.product_id === productId || item.product?.id === productId);

  const itemCount = items.reduce((total, item) => total + (item.quantity || 0), 0);

  return {
    cart,
    items,
    loading,
    error,
    totals,
    itemCount,
    fetchCart: () => queryClient.invalidateQueries({ queryKey: CART_KEY }),
    addToCart: addMutation.mutateAsync,
    updateQuantity: (productId, quantity) => updateMutation.mutateAsync({ productId, quantity }),
    removeFromCart: removeMutation.mutateAsync,
    clearCart: clearMutation.mutateAsync,
    isInCart,
    clearError: () => {},
  };
};

export default useCart;