import React, { useState } from "react";
import PropTypes from "prop-types";
import "./CartPage.scss";

const CartPage = ({ cart, cartTotal, onClose, onRemove, onChangeQuantity }) => {
  const [checkoutStep, setCheckoutStep] = useState(0);

  const handleCheckout = () => {
    setCheckoutStep(1);
  };

  const handleCheckoutNext = () => {
    if (checkoutStep < 3) {
      setCheckoutStep(checkoutStep + 1);
    } else {
      alert("¡Compra finalizada!");
      onClose();
      setCheckoutStep(0);
    }
  };

  const handleCheckoutBack = () => {
    if (checkoutStep > 0) {
      setCheckoutStep(checkoutStep - 1);
    }
  };

  return (
    <div className="cart-page-overlay" onClick={onClose}>
      <div className="cart-page-content" onClick={(e) => e.stopPropagation()}>
        <button className="cart-close" onClick={onClose} aria-label="Cerrar">
          &times;
        </button>

        {checkoutStep === 0 ? (
          <>
            <h2>Tu Carrito</h2>

            {cart.length === 0 ? (
              <div className="cart-empty">
                <p>Tu carrito está vacío</p>
                <button className="btn-primary" onClick={onClose}>
                  Seguir comprando
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => {
                    const hasDiscount = item.discount_percentage > 0;
                    const finalPrice = hasDiscount 
                      ? (item.price * (1 - item.discount_percentage / 100)).toFixed(2)
                      : item.price;
                    
                    const brand = item.Brand || item.brand;
                    const category = item.Category || item.category;

                    return (
                      <div key={item.id} className="cart-item">
                        <img
                          src={item.main_image ? `http://localhost:4001${item.main_image}` : "/api/images/placeholder.png"}
                          alt={item.name}
                          className="cart-item-image"
                          onError={(e) => {
                            if (!e.currentTarget.dataset.fallback) {
                              e.currentTarget.src = "/api/images/placeholder.png";
                              e.currentTarget.dataset.fallback = "true";
                            }
                          }}
                        />
                        <div className="cart-item-info">
                          <h4>{item.name}</h4>
                          <p className="cart-item-brand">{brand?.name || "Sin marca"}</p>
                          <p className="cart-item-category">{category?.name || "Sin categoría"}</p>
                          <div className="cart-item-price-container">
                            {hasDiscount ? (
                              <>
                                <p className="cart-item-price-original">${item.price}</p>
                                <p className="cart-item-price">${finalPrice}</p>
                                <span className="cart-item-discount">-{item.discount_percentage}%</span>
                              </>
                            ) : (
                              <p className="cart-item-price">${item.price}</p>
                            )}
                          </div>
                          {item.stock > 0 && item.stock <= item.min_stock && (
                            <p className="cart-item-low-stock">¡Solo quedan {item.stock} unidades!</p>
                          )}
                        </div>
                        <div className="cart-item-controls">
                          <div className="quantity-controls">
                            <button 
                              onClick={() => onChangeQuantity(item.id, -1)}
                              aria-label="Disminuir cantidad"
                            >
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button 
                              onClick={() => onChangeQuantity(item.id, 1)}
                              disabled={item.quantity >= item.stock}
                              aria-label="Aumentar cantidad"
                            >
                              +
                            </button>
                          </div>
                          <p className="cart-item-subtotal">
                            Subtotal: ${(finalPrice * item.quantity).toFixed(2)}
                          </p>
                          <button
                            className="btn-remove"
                            onClick={() => onRemove(item.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="cart-summary">
                  <div className="cart-total">
                    <span>Total:</span>
                    <span className="total-amount">${cartTotal.toFixed(2)}</span>
                  </div>
                  <button className="btn-checkout" onClick={handleCheckout}>
                    Proceder al pago
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <h2>Checkout - Paso {checkoutStep} de 3</h2>

            <div className="checkout-content">
              {checkoutStep === 1 && (
                <div className="checkout-step">
                  <h3>📄 Datos del usuario</h3>
                  <p>Nombre, email, dirección de envío...</p>
                </div>
              )}
              {checkoutStep === 2 && (
                <div className="checkout-step">
                  <h3>🚚 Método de envío</h3>
                  <p>Retiro en tienda, envío a domicilio...</p>
                </div>
              )}
              {checkoutStep === 3 && (
                <div className="checkout-step">
                  <h3>💳 Método de pago</h3>
                  <p>Tarjeta, efectivo, transferencia...</p>
                </div>
              )}
            </div>

            <div className="checkout-actions">
              {checkoutStep > 1 && (
                <button className="btn-secondary" onClick={handleCheckoutBack}>
                  Volver
                </button>
              )}
              <button className="btn-primary" onClick={handleCheckoutNext}>
                {checkoutStep === 3 ? "Finalizar compra" : "Siguiente"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

CartPage.propTypes = {
  cart: PropTypes.array.isRequired,
  cartTotal: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onChangeQuantity: PropTypes.func.isRequired,
};

export default CartPage;