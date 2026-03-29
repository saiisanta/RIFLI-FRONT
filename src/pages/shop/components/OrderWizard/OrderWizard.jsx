import React, { useState, useCallback, useEffect } from 'react';
import {
  FiChevronRight, FiChevronLeft, FiCheck,
  FiMapPin, FiCreditCard, FiEye, FiCheckCircle,
  FiAlertCircle, FiX,
} from 'react-icons/fi';
import useOrders from '../../../../hooks/useOrders';
import addressService from '../../../../services/addressService';
import './OrderWizard.scss';

const API_URL = import.meta.env.VITE_API_URL;

const STEPS = [
  { id: 1, label: 'Dirección',   Icon: FiMapPin },
  { id: 2, label: 'Pago',        Icon: FiCreditCard },
  { id: 3, label: 'Confirmar',   Icon: FiEye },
];

const PAYMENT_METHODS = [
  { value: 'BANK_TRANSFER', label: 'Transferencia bancaria', description: 'Transferí al alias indicado y subí el comprobante.' },
  { value: 'CASH',          label: 'Efectivo',               description: 'Pagás al retirar o al momento de la entrega.' },
];

const formatCurrency = (amount) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(amount || 0);

const OrderWizard = ({ items, totals, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);

  // Step 1
  const [addresses, setAddresses]             = useState([]);
  const [addressLoading, setAddressLoading]   = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Step 2
  const [paymentMethod, setPaymentMethod] = useState('BANK_TRANSFER');
  const [customerNotes, setCustomerNotes] = useState('');

  // Submit
  const { createOrder, loading: orderLoading, error: orderError, clearError } = useOrders();
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = useCallback(async () => {
    setAddressLoading(true);
    try {
      const data = await addressService.getMyAddresses();
      const list = Array.isArray(data) ? data : data.addresses || [];
      setAddresses(list);
      // Auto-seleccionar la principal
      const def = list.find(a => a.is_default);
      if (def) setSelectedAddress(def);
    } catch {
      setAddresses([]);
    } finally {
      setAddressLoading(false);
    }
  }, []);

  const handleSubmit = async () => {
    try {
      await createOrder({
        address_id:     selectedAddress.id,
        payment_method: paymentMethod,
        customer_notes: customerNotes.trim() || undefined,
      });
      setSubmitSuccess(true);
      setTimeout(() => onSuccess(), 2500);
    } catch (err) {
      console.error('Error al crear pedido:', err);
    }
  };

  const subtotal = totals?.subtotal || totals?.total || 0;

  // ── Success ───────────────────────────────────────────────

  if (submitSuccess) {
    return (
      <div className="ow-overlay">
        <div className="ow-modal">
          <div className="ow-success">
            <div className="ow-success-icon"><FiCheckCircle size={56} /></div>
            <h3>¡Pedido realizado!</h3>
            <p>
              Tu pedido fue creado correctamente. El equipo calculará el costo de envío
              y te lo informaremos a la brevedad para que puedas confirmar.
            </p>
            <span className="ow-success-hint">Redirigiendo a Mis Pedidos…</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ow-overlay" onClick={onClose}>
      <div className="ow-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="ow-header">
          <h2>Solicitar pedido</h2>
          <button className="ow-close-btn" onClick={onClose} aria-label="Cerrar">
            <FiX size={18} />
          </button>
        </div>

        {/* Step indicator */}
        <div className="ow-steps">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className={`ow-step ${step === s.id ? 'active' : step > s.id ? 'done' : ''}`}>
                <div className="ow-step-circle">
                  {step > s.id ? <FiCheck size={14} /> : <s.Icon size={14} />}
                </div>
                <span className="ow-step-label">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`ow-step-connector ${step > s.id ? 'done' : ''}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Body */}
        <div className="ow-body">

          {/* ── STEP 1: Address ── */}
          {step === 1 && (
            <div className="ow-panel">
              <div className="ow-panel-header">
                <h3>¿Dónde enviamos tu pedido?</h3>
                <p>Seleccioná la dirección de entrega</p>
              </div>

              {addressLoading ? (
                <div className="ow-loading"><div className="ow-spinner" /><span>Cargando direcciones…</span></div>
              ) : addresses.length === 0 ? (
                <div className="ow-empty">
                  <FiMapPin size={36} />
                  <h4>Sin direcciones guardadas</h4>
                  <p>Agregá una dirección desde tu perfil para continuar.</p>
                  <a href="/perfil" className="ow-btn-link">Ir al perfil</a>
                </div>
              ) : (
                <div className="ow-address-list">
                  {addresses.map(addr => (
                    <button
                      key={addr.id}
                      type="button"
                      className={`ow-address-card ${selectedAddress?.id === addr.id ? 'selected' : ''}`}
                      onClick={() => setSelectedAddress(addr)}
                    >
                      <div className="ow-address-info">
                        <div className="ow-address-alias-row">
                          <span className="ow-address-alias">{addr.alias}</span>
                          {addr.is_default && <span className="ow-default-badge">Principal</span>}
                        </div>
                        <p className="ow-address-street">
                          {addr.street} {addr.number}
                          {addr.floor && `, Piso ${addr.floor}`}
                          {addr.apartment && `, Depto ${addr.apartment}`}
                        </p>
                        <p className="ow-address-loc">{addr.city}, {addr.province} — CP {addr.postal_code}</p>
                        {addr.additional_info && <p className="ow-address-extra">{addr.additional_info}</p>}
                      </div>
                      <div className="ow-select-mark">
                        <FiCheck size={14} />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── STEP 2: Payment ── */}
          {step === 2 && (
            <div className="ow-panel">
              <div className="ow-panel-header">
                <h3>Método de pago</h3>
                <p>Elegí cómo querés abonar tu pedido</p>
              </div>

              <div className="ow-payment-options">
                {PAYMENT_METHODS.map(pm => (
                  <button
                    key={pm.value}
                    type="button"
                    className={`ow-payment-card ${paymentMethod === pm.value ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod(pm.value)}
                  >
                    <div className="ow-payment-info">
                      <span className="ow-payment-name">{pm.label}</span>
                      <p className="ow-payment-desc">{pm.description}</p>
                    </div>
                    <div className="ow-select-mark"><FiCheck size={14} /></div>
                  </button>
                ))}
              </div>

              <div className="ow-notes-group">
                <label>Notas adicionales <span className="ow-optional">(opcional)</span></label>
                <textarea
                  className="ow-textarea"
                  value={customerNotes}
                  onChange={e => setCustomerNotes(e.target.value)}
                  placeholder="Ej: Dejar en portería, llamar antes de entregar…"
                  rows={3}
                  maxLength={500}
                />
                <span className="ow-char-count">{customerNotes.length} / 500</span>
              </div>
            </div>
          )}

          {/* ── STEP 3: Preview ── */}
          {step === 3 && (
            <div className="ow-panel">
              <div className="ow-panel-header">
                <h3>Revisá tu pedido</h3>
                <p>Confirmá los detalles antes de enviar</p>
              </div>

              {/* Items */}
              <div className="ow-preview-section">
                <div className="ow-preview-title">Productos</div>
                <div className="ow-items-list">
                  {items.map((item) => {
                    const product = item.product || item;
                    const name = product.name || item.name;
                    const price = item.unit_price || item.price || product.price || 0;
                    const mainImage = product.main_image || item.main_image;
                    const subtotalItem = item.subtotal || (price * item.quantity);

                    return (
                      <div key={item.productId || item.product_id} className="ow-order-item">
                        {mainImage && (
                          <img
                            src={`${API_URL}${mainImage}`}
                            alt={name}
                            className="ow-order-item-img"
                            onError={e => { e.currentTarget.src = '/api/images/placeholder.png'; }}
                          />
                        )}
                        <div className="ow-order-item-info">
                          <span className="ow-order-item-name">{name}</span>
                          <span className="ow-order-item-qty">x{item.quantity}</span>
                        </div>
                        <span className="ow-order-item-price">{formatCurrency(subtotalItem)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Address */}
              <div className="ow-preview-section">
                <div className="ow-preview-title">Dirección de entrega</div>
                <div className="ow-preview-card">
                  <strong>{selectedAddress?.alias}</strong>
                  <p>{selectedAddress?.street} {selectedAddress?.number}{selectedAddress?.floor && `, Piso ${selectedAddress.floor}`}</p>
                  <p>{selectedAddress?.city}, {selectedAddress?.province}</p>
                </div>
              </div>

              {/* Payment */}
              <div className="ow-preview-section">
                <div className="ow-preview-title">Método de pago</div>
                <div className="ow-preview-card">
                  <strong>{PAYMENT_METHODS.find(p => p.value === paymentMethod)?.label}</strong>
                </div>
              </div>

              {/* Totals */}
              <div className="ow-preview-totals">
                <div className="ow-totals-row">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="ow-totals-row shipping">
                  <span>Envío</span>
                  <span className="ow-shipping-pending">A calcular</span>
                </div>
                <div className="ow-totals-row total">
                  <span>Total (sin envío)</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <p className="ow-shipping-note">
                  El costo de envío será calculado por nuestro equipo y lo recibirás antes de confirmar el pago.
                </p>
              </div>

              {/* Notes */}
              {customerNotes && (
                <div className="ow-preview-section">
                  <div className="ow-preview-title">Notas</div>
                  <div className="ow-preview-card">
                    <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--shop-text-muted)' }}>{customerNotes}</p>
                  </div>
                </div>
              )}

              {/* Error */}
              {orderError && (
                <div className="ow-error-banner">
                  <FiAlertCircle size={16} />
                  <span>{typeof orderError === 'string' ? orderError : orderError?.message || 'Error al crear el pedido'}</span>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="ow-footer">
          {step === 1 ? (
            <button className="ow-btn-cancel" onClick={onClose}>Cancelar</button>
          ) : (
            <button className="ow-btn-back" onClick={() => { setStep(s => s - 1); clearError?.(); }}>
              <FiChevronLeft size={16} />
              Volver
            </button>
          )}

          {step < 3 ? (
            <button
              className="ow-btn-next"
              onClick={() => setStep(s => s + 1)}
              disabled={
                (step === 1 && (!selectedAddress || addresses.length === 0)) ||
                orderLoading
              }
            >
              Continuar
              <FiChevronRight size={16} />
            </button>
          ) : (
            <button
              className="ow-btn-confirm"
              onClick={handleSubmit}
              disabled={orderLoading}
            >
              {orderLoading ? (
                <><span className="ow-spinner-sm" /> Enviando…</>
              ) : (
                <><FiCheck size={16} /> Confirmar pedido</>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default OrderWizard;