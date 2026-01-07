import { useState, useCallback, useEffect } from 'react';
import cartService from '../services/cartService';

const useCart = () => {
  const [cart, setCart] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totals, setTotals] = useState({
    subtotal: 0,
    tax: 0,
    shipping: 0,
    discount: 0,
    total: 0,
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cartService.getCart();
      setCart(data.cart || data);
      setItems(data.cart?.items || data.items || []);
      setTotals(data.cart?.totals || data.totals || {});
      return data;
    } catch (err) {
      setError(err.message || 'Error al cargar carrito');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = useCallback(async (productData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await cartService.addToCart(productData);
      setCart(data.cart || data);
      setItems(data.cart?.items || data.items || []);
      setTotals(data.cart?.totals || data.totals || {});
      return data;
    } catch (err) {
      setError(err.message || 'Error al agregar al carrito');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateQuantity = useCallback(async (itemId, quantity) => {
    try {
      setLoading(true);
      setError(null);
      const data = await cartService.updateCartItem(itemId, quantity);
      setCart(data.cart || data);
      setItems(data.cart?.items || data.items || []);
      setTotals(data.cart?.totals || data.totals || {});
      return data;
    } catch (err) {
      setError(err.message || 'Error al actualizar cantidad');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeFromCart = useCallback(async (itemId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await cartService.removeFromCart(itemId);
      setCart(data.cart || data);
      setItems(data.cart?.items || data.items || []);
      setTotals(data.cart?.totals || data.totals || {});
      return data;
    } catch (err) {
      setError(err.message || 'Error al eliminar del carrito');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await cartService.clearCart();
      setCart(null);
      setItems([]);
      setTotals({ subtotal: 0, tax: 0, shipping: 0, discount: 0, total: 0 });
      return true;
    } catch (err) {
      setError(err.message || 'Error al vaciar carrito');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkout = useCallback(async (checkoutData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await cartService.checkout(checkoutData);
      return data;
    } catch (err) {
      setError(err.message || 'Error en el checkout');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const applyCoupon = useCallback(async (couponCode) => {
    try {
      setLoading(true);
      setError(null);
      const data = await cartService.applyCoupon(couponCode);
      setCart(data.cart || data);
      setTotals(data.cart?.totals || data.totals || {});
      return data;
    } catch (err) {
      setError(err.message || 'Error al aplicar cupón');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeCoupon = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cartService.removeCoupon();
      setCart(data.cart || data);
      setTotals(data.cart?.totals || data.totals || {});
      return data;
    } catch (err) {
      setError(err.message || 'Error al remover cupón');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getItemCount = useCallback(() => {
    return items.reduce((total, item) => total + (item.quantity || 0), 0);
  }, [items]);

  const isInCart = useCallback((productId) => {
    return items.some(item => item.productId === productId || item.product?.id === productId);
  }, [items]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    cart,
    items,
    loading,
    error,
    totals,
    itemCount: getItemCount(),
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    checkout,
    applyCoupon,
    removeCoupon,
    isInCart,
    clearError,
  };
};

export default useCart;
