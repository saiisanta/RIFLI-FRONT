import { useState, useCallback, useEffect } from "react";
import cartService from "../services/cartService";

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

  const syncCart = (data) => {
    const c = data.cart || data;
    setCart(c);
    setItems(c?.items || []);
    // FIX: el backend devuelve subtotal directo, no un objeto totals
    setTotals({
      subtotal: Number(c.subtotal) || 0,
      total: Number(c.total) || Number(c.subtotal) || 0,
      tax: Number(c.tax) || 0,
      shipping: Number(c.shipping) || 0,
      discount: Number(c.discount) || 0,
    });
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cartService.getCart();
      console.log("cart response:", data);
      syncCart(data);
      return data;
    } catch (err) {
      // Cart vacío es OK — no es un error real
      if (err?.status !== 404) {
        setError(err.message || err.error || "Error al cargar carrito");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = useCallback(async ({ product_id, quantity = 1 }) => {
    try {
      setLoading(true);
      setError(null);
      const data = await cartService.addToCart({ product_id, quantity });
      syncCart(data);
      return data;
    } catch (err) {
      setError(err.message || err.error || "Error al agregar al carrito");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // FIX: product_id no itemId
  const updateQuantity = useCallback(async (productId, quantity) => {
    try {
      setLoading(true);
      setError(null);
      const data = await cartService.updateCartItem(productId, quantity);
      syncCart(data);
      return data;
    } catch (err) {
      setError(err.message || err.error || "Error al actualizar cantidad");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeFromCart = useCallback(async (productId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await cartService.removeFromCart(productId);
      syncCart(data);
      return data;
    } catch (err) {
      setError(err.message || err.error || "Error al eliminar del carrito");
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
      setError(err.message || err.error || "Error al vaciar carrito");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const isInCart = useCallback(
    (productId) => {
      return items.some(
        (item) =>
          item.product_id === productId || item.product?.id === productId,
      );
    },
    [items],
  );

  const getItemCount = useCallback(() => {
    return items.reduce((total, item) => total + (item.quantity || 0), 0);
  }, [items]);

  const clearError = useCallback(() => setError(null), []);

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
    isInCart,
    clearError,
  };
};

export default useCart;
