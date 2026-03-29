import React from "react";
import PropTypes from "prop-types";
import { FiTrash2, FiShoppingCart } from "react-icons/fi";
import "./CartPage.scss";

const API_URL = import.meta.env.VITE_API_URL;

const formatCurrency = (amount) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency", currency: "ARS", maximumFractionDigits: 0,
  }).format(amount || 0);

const CartPage = ({
  items,
  totals,
  onClose,
  onRemove,
  onUpdateQuantity,
  onClearCart,
  onCheckout,
  loading,
}) => {
  const cartTotal = totals?.total || totals?.subtotal || 0;
  const itemCount = items.reduce((acc, item) => acc + (item.quantity || 0), 0);

  return (
    <div className="cart-page-overlay" onClick={onClose}>
      <div className="cart-page-content" onClick={e => e.stopPropagation()}>
        <button className="cart-close" onClick={onClose} aria-label="Cerrar">
          &times;
        </button>

        <div className="cart-header">
          <h2>
            <FiShoppingCart size={22} />
            Tu Carrito
          </h2>
          {items.length > 0 && (
            <span className="cart-item-count">{itemCount} producto{itemCount !== 1 ? 's' : ''}</span>
          )}
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <FiShoppingCart size={48} />
            <p>Tu carrito está vacío</p>
            <button className="btn-primary" onClick={onClose}>
              Seguir comprando
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => {
                const product = item.product || item;
                const productId = item.productId || item.product_id || product.id;
                const name = product.name || item.name;
                const price = item.unit_price || item.price || product.price || 0;
                const mainImage = product.main_image || item.main_image;
                const stock = product.stock ?? 999;
                const subtotal = item.subtotal || (price * item.quantity);

                return (
                  <div key={item.productId || item.product_id || item.id} className="cart-item">
                    <img
                      src={mainImage ? `${API_URL}${mainImage}` : "/api/images/placeholder.png"}
                      alt={name}
                      className="cart-item-image"
                      onError={e => {
                        if (!e.currentTarget.dataset.fallback) {
                          e.currentTarget.src = "/api/images/placeholder.png";
                          e.currentTarget.dataset.fallback = "true";
                        }
                      }}
                    />
                    <div className="cart-item-info">
                      <h4>{name}</h4>
                      <p className="cart-item-price">{formatCurrency(price)}</p>
                    </div>
                    <div className="cart-item-controls">
                      <div className="quantity-controls">
                        <button
                          onClick={() => onUpdateQuantity(productId, item.quantity - 1)}
                          disabled={item.quantity <= 1 || loading}
                          aria-label="Disminuir"
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(productId, item.quantity + 1)}
                          disabled={item.quantity >= stock || loading}
                          aria-label="Aumentar"
                        >
                          +
                        </button>
                      </div>
                      <p className="cart-item-subtotal">{formatCurrency(subtotal)}</p>
                      <button
                        className="btn-remove"
                        onClick={() => onRemove(productId)}
                        disabled={loading}
                      >
                        <FiTrash2 size={14} />
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cart-summary">
              {totals?.subtotal && totals.subtotal !== cartTotal && (
                <div className="cart-totals-detail">
                  <span>Subtotal</span>
                  <span>{formatCurrency(totals.subtotal)}</span>
                </div>
              )}
              {totals?.tax > 0 && (
                <div className="cart-totals-detail">
                  <span>IVA</span>
                  <span>{formatCurrency(totals.tax)}</span>
                </div>
              )}
              <div className="cart-total">
                <span>Total</span>
                <span className="total-amount">{formatCurrency(cartTotal)}</span>
              </div>

              <p className="cart-shipping-note">
                * El costo de envío se calculará al confirmar el pedido
              </p>

              <div className="cart-actions">
                <button className="btn-clear" onClick={onClearCart} disabled={loading}>
                  Vaciar carrito
                </button>
                <button className="btn-checkout" onClick={onCheckout} disabled={loading}>
                  {loading ? "Procesando..." : "Solicitar pedido →"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

CartPage.propTypes = {
  items:           PropTypes.array.isRequired,
  totals:          PropTypes.object,
  onClose:         PropTypes.func.isRequired,
  onRemove:        PropTypes.func.isRequired,
  onUpdateQuantity:PropTypes.func.isRequired,
  onClearCart:     PropTypes.func.isRequired,
  onCheckout:      PropTypes.func.isRequired,
  loading:         PropTypes.bool,
};

export default CartPage;