import React, { useState } from "react";
import PropTypes from "prop-types";
import { FiTrash2, FiShoppingCart } from "react-icons/fi";
import "./CartPage.scss";

const API_URL = import.meta.env.VITE_API_URL;

const formatCurrency = (amount) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount || 0);

const BtnSpinner = ({ dark }) => (
  <span
    className={`cart-btn-spinner${dark ? " cart-btn-spinner--dark" : ""}`}
  />
);

const CartPage = ({
  items,
  totals,
  onClose,
  onRemove,
  onUpdateQuantity,
  onClearCart,
  onCheckout,
  loading,
  onApiError,
}) => {
  const [removingId, setRemovingId] = useState(null);
  const [clearingCart, setClearingCart] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  const cartTotal = totals?.total || totals?.subtotal || 0;
  const itemCount = items.reduce((acc, item) => acc + (item.quantity || 0), 0);

  const handleRemove = async (productId) => {
    setRemovingId(productId);
    try {
      await onRemove(productId);
    } catch (err) {
      onApiError?.(err);
    } finally {
      setRemovingId(null);
    }
  };

  const handleClearCart = async () => {
    setClearingCart(true);
    try {
      await onClearCart();
    } catch (err) {
      onApiError?.(err);
    } finally {
      setClearingCart(false);
    }
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      await onCheckout();
    } catch (err) {
      onApiError?.(err);
      setCheckingOut(false);
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      await onUpdateQuantity(productId, newQuantity);
    } catch (err) {
      onApiError?.(err);
    }
  };

  return (
    <div className="cart-page-overlay" onClick={onClose}>
      <div className="cart-page-content" onClick={(e) => e.stopPropagation()}>
        <button className="cart-close" onClick={onClose} aria-label="Cerrar">
          &times;
        </button>

        <div className="cart-header">
          <h2>
            <FiShoppingCart size={22} />
            Tu Carrito
          </h2>
          {items.length > 0 && (
            <span className="cart-item-count">
              {itemCount} producto{itemCount !== 1 ? "s" : ""}
            </span>
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
                const productId =
                  item.productId || item.product_id || product.id;
                const name = product.name || item.name;
                const price =
                  item.unit_price || item.price || product.price || 0;
                const mainImage = product.main_image || item.main_image;
                const stock = product.stock ?? 999;
                const subtotal = item.subtotal || price * item.quantity;
                const isRemoving = removingId === productId;

                return (
                  <div
                    key={item.productId || item.product_id || item.id}
                    className="cart-item"
                  >
                    <img
                      src={
                        mainImage
                          ? `${API_URL}${mainImage}`
                          : "/api/images/placeholder.png"
                      }
                      alt={name}
                      className="cart-item-image"
                      onError={(e) => {
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
                          onClick={() =>
                            handleUpdateQuantity(productId, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1 || loading || isRemoving}
                          aria-label="Disminuir"
                        >
                          −
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          onClick={() =>
                            handleUpdateQuantity(productId, item.quantity + 1)
                          }
                          disabled={
                            item.quantity >= stock || loading || isRemoving
                          }
                          aria-label="Aumentar"
                        >
                          +
                        </button>
                      </div>
                      <p className="cart-item-subtotal">
                        {formatCurrency(subtotal)}
                      </p>
                      <button
                        className="btn-remove"
                        onClick={() => handleRemove(productId)}
                        disabled={loading || isRemoving}
                      >
                        {isRemoving ? (
                          <>
                            <BtnSpinner />
                            Eliminando…
                          </>
                        ) : (
                          <>
                            <FiTrash2 size={14} />
                            Eliminar
                          </>
                        )}
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
                <span className="total-amount">
                  {formatCurrency(cartTotal)}
                </span>
              </div>

              <p className="cart-shipping-note">
                * El costo de envío se calculará al confirmar el pedido
              </p>

              <div className="cart-actions">
                <button
                  className="btn-clear"
                  onClick={handleClearCart}
                  disabled={loading || clearingCart || checkingOut}
                >
                  {clearingCart ? (
                    <>
                      <BtnSpinner />
                      Vaciando…
                    </>
                  ) : (
                    "Vaciar carrito"
                  )}
                </button>
                <button
                  className="btn-checkout"
                  onClick={handleCheckout}
                  disabled={loading || checkingOut || clearingCart}
                >
                  {checkingOut ? (
                    <>
                      <BtnSpinner dark />
                      Procesando…
                    </>
                  ) : (
                    "Solicitar pedido →"
                  )}
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
  items: PropTypes.array.isRequired,
  totals: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onUpdateQuantity: PropTypes.func.isRequired,
  onClearCart: PropTypes.func.isRequired,
  onCheckout: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  onApiError: PropTypes.func,
};

export default CartPage;
