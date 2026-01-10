import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import './ShopHeader.scss';

const ShopHeader = ({ cartItemCount, onCartClick }) => {
  const navigate = useNavigate();

  return (
    <div className="shop-header">
      <button
        className="shop-header-back-btn"
        onClick={() => navigate('/dashboard')}
        aria-label="Volver al dashboard"
      >
        <FaArrowLeft />
        <span>Dashboard</span>
      </button>

      <button
        className="shop-header-cart-btn"
        onClick={onCartClick}
        aria-label="Ver carrito"
      >
        <FaShoppingCart />
        {cartItemCount > 0 && (
          <span className="shop-header-cart-badge">{cartItemCount}</span>
        )}
        <span className="shop-header-cart-text">Carrito</span>
      </button>
    </div>
  );
};

export default ShopHeader;