import React, { createContext, useContext } from 'react';
import useCart from '../hooks/useCart';

export const CartContext = createContext();

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext debe usarse dentro de un CartProvider');
  }
  return context;
};

export function CartProvider({ children }) {
  const cart = useCart();

  return (
    <CartContext.Provider value={cart}>
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;
