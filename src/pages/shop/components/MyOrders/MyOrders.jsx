import React, { useState, useEffect, useCallback } from 'react';
import {
  FiPackage, FiChevronDown, FiChevronUp,
  FiMapPin, FiCalendar, FiDollarSign, FiClock,
  FiUpload, FiAlertCircle, FiCheck,
  FiX, FiRefreshCw, FiShoppingBag, FiTruck,
} from 'react-icons/fi';
import useOrders from '../../../../hooks/useOrders';
import './MyOrders.scss';

const API_URL = import.meta.env.VITE_API_URL;

// ── Status config ─────────────────────────────────────────────

const STATUS_CONFIG = {
  PENDING_PAYMENT: { label: 'Esperando pago',  color: 'yellow' },
  PROCESSING:      { label: 'En proceso',       color: 'blue'   },
  SHIPPED:         { label: 'Enviado',          color: 'orange' },
  DELIVERED:       { label: 'Entregado',        color: 'success'},
  CANCELLED:       { label: 'Cancelado',        color: 'red'    },
  REFUNDED:        { label: 'Reembolsado',      color: 'gray'   },
};

// FIX: incluye PENDING_PROOF que es el valor inicial del modelo
const PAYMENT_STATUS_CONFIG = {
  PENDING_PROOF:  { label: 'Sin comprobante',       color: 'gray'   },
  PENDING:        { label: 'Sin comprobante',       color: 'gray'   },
  PROOF_UPLOADED: { label: 'Comprobante enviado',   color: 'blue'   },
  APPROVED:       { label: 'Pago aprobado',         color: 'success'},
  REJECTED:       { label: 'Comprobante rechazado', color: 'red'    },
};

const SHIPPING_STATUS_CONFIG = {
  PENDING:  { label: 'Calculando envío…', color: 'yellow' },
  QUOTED:   { label: 'Precio recibido',   color: 'orange' },
  ACCEPTED: { label: 'Envío confirmado',  color: 'success'},
  REJECTED: { label: 'Envío rechazado',   color: 'red'    },
};

const StatusBadge = ({ status, config }) => {
  const cfg = config[status] || { label: status, color: 'gray' };
  return <span className={`mo-badge mo-badge--${cfg.color}`}>{cfg.label}</span>;
};

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';

const formatCurrency = (amount) =>
  amount != null
    ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(amount)
    : '—';

// ── Shipping Confirm Panel ────────────────────────────────────

const ShippingConfirm = ({ order, onConfirm }) => {
  const [loading, setLoading] = useState(false);

  const subtotal     = Number(order.subtotal)      || 0;
  const shippingCost = Number(order.shipping_cost) || 0;
  const total        = Number(order.total)         || subtotal + shippingCost;

  const handleAccept = async () => {
    setLoading(true);
    try { await onConfirm(order.id, 'accept'); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleReject = async () => {
    if (!window.confirm('¿Rechazar el precio de envío? La orden será cancelada.')) return;
    setLoading(true);
    try { await onConfirm(order.id, 'reject', 'Cliente rechazó el precio de envío'); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="mo-shipping-confirm">
      <div className="mo-shipping-confirm-title">
        <FiTruck size={15} />
        Precio de envío recibido — confirmá para continuar
      </div>

      <div className="mo-shipping-confirm-breakdown">
        <div className="mo-sc-row">
          <span>Subtotal productos</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="mo-sc-row highlight">
          <span>Costo de envío cotizado</span>
          <span>{formatCurrency(shippingCost)}</span>
        </div>
        <div className="mo-sc-row total">
          <span>Total a pagar</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      <p className="mo-shipping-confirm-note">
        Si aceptás, podrás subir el comprobante de pago. Si rechazás, la orden será cancelada.
      </p>

      <div className="mo-shipping-confirm-actions">
        <button
          className="mo-sc-btn mo-sc-btn--reject"
          onClick={handleReject}
          disabled={loading}
        >
          <FiX size={14} />
          Rechazar precio
        </button>
        <button
          className="mo-sc-btn mo-sc-btn--accept"
          onClick={handleAccept}
          disabled={loading}
        >
          {loading ? <><span className="mo-spinner" /> Procesando…</> : <><FiCheck size={14} /> Aceptar y pagar</>}
        </button>
      </div>
    </div>
  );
};

// ── Proof Uploader ────────────────────────────────────────────

const ProofUploader = ({ order, onUpload }) => {
  const [file, setFile]               = useState(null);
  const [uploading, setUploading]     = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [paymentType, setPaymentType] = useState('BANK_TRANSFER');
  const [amount, setAmount]           = useState('');
  const [reference, setReference]     = useState('');

  const canUpload = !['APPROVED', 'PROOF_UPLOADED'].includes(order.payment_status);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      await onUpload(order.id, file, {
        payment_type: paymentType,
        amount:       amount ? Number(amount) : undefined,
        transaction_reference: reference || undefined,
      });
      setFile(null);
      setAmount('');
      setReference('');
    } catch (err) {
      setUploadError(err.message || err.error || 'Error al subir el comprobante');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`mo-proof-section mo-proof--${(order.payment_status || 'pending').toLowerCase()}`}>
      <div className="mo-proof-header">
        <div className="mo-proof-header-left">
          <FiDollarSign size={14} />
          <span className="mo-proof-label">Comprobante de pago</span>
          {order.total && (
            <span className="mo-proof-amount">{formatCurrency(Number(order.total))}</span>
          )}
        </div>
        <StatusBadge status={order.payment_status || 'PENDING_PROOF'} config={PAYMENT_STATUS_CONFIG} />
      </div>

      {order.payment_status === 'PROOF_UPLOADED' && (
        <p className="mo-proof-msg mo-proof-msg--waiting">
          <FiClock size={13} />
          Comprobante recibido — esperando verificación del equipo.
        </p>
      )}
      {order.payment_status === 'APPROVED' && (
        <p className="mo-proof-msg mo-proof-msg--confirmed">
          <FiCheck size={13} />
          Pago verificado y confirmado.
        </p>
      )}
      {order.payment_status === 'REJECTED' && (
        <p className="mo-proof-msg mo-proof-msg--rejected">
          <FiAlertCircle size={13} />
          Tu comprobante fue rechazado. Por favor subí uno nuevo.
        </p>
      )}

      {canUpload && (
        <div className="mo-proof-upload-area">
          <div className="mo-proof-fields">
            <div className="mo-proof-field">
              <label>Método de pago</label>
              <select value={paymentType} onChange={e => setPaymentType(e.target.value)} className="mo-proof-select">
                <option value="BANK_TRANSFER">Transferencia bancaria</option>
                <option value="CASH">Efectivo</option>
              </select>
            </div>
            <div className="mo-proof-field">
              <label>Monto abonado</label>
              <input type="number" className="mo-proof-input" placeholder="Ej: 15000"
                value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
            <div className="mo-proof-field">
              <label>N° de referencia <span style={{opacity:0.6}}>(opcional)</span></label>
              <input type="text" className="mo-proof-input" placeholder="Ej: ABC123"
                value={reference} onChange={e => setReference(e.target.value)} />
            </div>
          </div>

          <div className="mo-proof-file-wrapper">
            <input type="file" id={`proof-${order.id}`} accept=".pdf,.jpg,.jpeg,.png"
              onChange={e => {
                const f = e.target.files[0];
                if (f && f.size > 10 * 1024 * 1024) { setUploadError('El archivo no puede superar los 10MB'); return; }
                setFile(f);
                setUploadError(null);
              }}
              disabled={uploading}
            />
            <label htmlFor={`proof-${order.id}`} className={`mo-proof-file-label ${file ? 'has-file' : ''}`}>
              <FiUpload size={16} />
              <span>{file ? file.name : 'Seleccionar comprobante'}</span>
              <small>PDF, JPG o PNG — máx 10MB</small>
            </label>
          </div>

          {uploadError && <p className="mo-proof-error"><FiAlertCircle size={13} /> {uploadError}</p>}

          <button className="mo-proof-upload-btn" onClick={handleUpload} disabled={!file || uploading}>
            {uploading
              ? <><span className="mo-spinner" /> Subiendo…</>
              : <><FiUpload size={14} /> Enviar comprobante</>
            }
          </button>
        </div>
      )}
    </div>
  );
};

// ── Order Card ────────────────────────────────────────────────

const OrderCard = ({ order: orderProp, onUploadProof, onCancel, onConfirmShipping }) => {
  const [order, setOrder]   = useState(orderProp);
  const [expanded, setExpanded] = useState(false);

  // Sync si el padre actualiza la orden
  useEffect(() => { setOrder(orderProp); }, [orderProp]);

  const items   = order.items || [];
  const address = order.address || order.Address || order.shippingAddress;

  // ── Lógica del flujo ──────────────────────────────────────
  const isActive   = order.status === 'PENDING_PAYMENT';
  const canCancel  = isActive;

  // Paso 1: esperando cotización del admin
  const waitingForQuote    = isActive && order.shipping_status === 'PENDING';

  // Paso 2: precio recibido, cliente debe aceptar o rechazar
  const needsShippingConfirm = isActive && order.shipping_status === 'QUOTED';

  // Paso 3: aceptó, puede subir comprobante
  const canUploadProof = isActive && order.shipping_status === 'ACCEPTED';

  const handleConfirmShipping = async (orderId, action, reason) => {
    const updated = await onConfirmShipping(orderId, action, reason);
    if (updated?.order) setOrder(updated.order);
  };

  // FIX: el modelo usa `total` no `total_amount`
  const totalAmount = order.total || order.total_amount;

  return (
    <div className={`mo-card ${expanded ? 'expanded' : ''}`}>
      {/* Header */}
      <div className="mo-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="mo-card-left">
          <span className="mo-order-number">{order.order_number || `#${order.id}`}</span>
          <StatusBadge status={order.status} config={STATUS_CONFIG} />
        </div>
        <div className="mo-card-meta">
          <span className="mo-card-date"><FiCalendar size={13} />{formatDate(order.createdAt)}</span>
          {totalAmount && (
            <span className="mo-card-amount">
              <FiDollarSign size={13} />
              {formatCurrency(Number(totalAmount))}
            </span>
          )}
        </div>
        <button className="mo-expand-btn" type="button" onClick={e => { e.stopPropagation(); setExpanded(!expanded); }}>
          {expanded ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
        </button>
      </div>

      {/* Body */}
      {expanded && (
        <div className="mo-card-body">

          {/* Items */}
          {items.length > 0 && (
            <div className="mo-section">
              <div className="mo-section-title"><FiPackage size={14} /> Productos</div>
              <div className="mo-items-list">
                {items.map((item, idx) => {
                  const name  = item.name;
                  const price = Number(item.unit_price || item.price) || 0;
                  const img   = item.imageUrl || item.main_image;
                  return (
                    <div key={idx} className="mo-item">
                      {img && (
                        <img src={img.startsWith('http') ? img : `${API_URL}${img}`} alt={name}
                          className="mo-item-img"
                          onError={e => { e.currentTarget.src = '/api/images/placeholder.jpg'; }} />
                      )}
                      <div className="mo-item-info">
                        <span className="mo-item-name">{name}</span>
                        <span className="mo-item-qty">x{item.quantity}</span>
                      </div>
                      <span className="mo-item-price">{formatCurrency(price * item.quantity)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Address */}
          {address && (
            <div className="mo-section">
              <div className="mo-section-title"><FiMapPin size={14} /> Dirección de entrega</div>
              <p className="mo-address-text">
                {address.street} {address.number}
                {address.floor && `, Piso ${address.floor}`}
                {', '}{address.city}, {address.province}
              </p>
            </div>
          )}

          {/* Envío y pago — info grid */}
          <div className="mo-section">
            <div className="mo-section-title">Envío y pago</div>
            <div className="mo-info-grid">
              <div className="mo-info-item">
                <span className="mo-info-label">Estado de envío</span>
                <StatusBadge status={order.shipping_status || 'PENDING'} config={SHIPPING_STATUS_CONFIG} />
              </div>
              <div className="mo-info-item">
                <span className="mo-info-label">Estado de pago</span>
                <StatusBadge status={order.payment_status || 'PENDING_PROOF'} config={PAYMENT_STATUS_CONFIG} />
              </div>
              {order.shipping_cost != null && (
                <div className="mo-info-item">
                  <span className="mo-info-label">Costo de envío</span>
                  <span className="mo-info-val">{formatCurrency(Number(order.shipping_cost))}</span>
                </div>
              )}
              {order.tracking_number && (
                <div className="mo-info-item">
                  <span className="mo-info-label">N° de seguimiento</span>
                  <span className="mo-info-val tracking">{order.tracking_number}</span>
                </div>
              )}
              {order.shipped_at && (
                <div className="mo-info-item">
                  <span className="mo-info-label">Fecha de envío</span>
                  <span className="mo-info-val">{formatDate(order.shipped_at)}</span>
                </div>
              )}
              {order.delivered_at && (
                <div className="mo-info-item">
                  <span className="mo-info-label">Fecha de entrega</span>
                  <span className="mo-info-val">{formatDate(order.delivered_at)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Totals */}
          {totalAmount && (
            <div className="mo-totals">
              {order.subtotal && (
                <div className="mo-totals-row">
                  <span>Subtotal productos</span>
                  <span>{formatCurrency(Number(order.subtotal))}</span>
                </div>
              )}
              {order.shipping_cost != null && (
                <div className="mo-totals-row">
                  <span>Envío</span>
                  <span>{formatCurrency(Number(order.shipping_cost))}</span>
                </div>
              )}
              <div className="mo-totals-row total">
                <span>Total</span>
                <span>{formatCurrency(Number(totalAmount))}</span>
              </div>
            </div>
          )}

          {/* Notas */}
          {order.customer_notes && (
            <div className="mo-section">
              <div className="mo-section-title">Notas</div>
              <p className="mo-notes">{order.customer_notes}</p>
            </div>
          )}

          {/* ── PASO 1: Esperando cotización ── */}
          {waitingForQuote && (
            <div className="mo-shipping-pending-msg">
              <FiClock size={14} />
              Estamos calculando el costo de envío. Te notificaremos cuando esté listo.
            </div>
          )}

          {/* ── PASO 2: Confirmar precio de envío ── */}
          {needsShippingConfirm && (
            <ShippingConfirm
              order={order}
              onConfirm={handleConfirmShipping}
            />
          )}

          {/* ── PASO 3: Subir comprobante (solo después de aceptar) ── */}
          {canUploadProof && (
            <ProofUploader order={order} onUpload={onUploadProof} />
          )}

          {/* Cancelar */}
          {canCancel && (
            <div className="mo-card-actions">
              <button className="mo-btn-cancel" onClick={() => onCancel(order.id)}>
                <FiX size={14} />
                Cancelar pedido
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────

const MyOrders = ({ onShop }) => {
  const {
    orders, loading, error,
    fetchOrders, cancelOrder, confirmShipping, uploadPaymentProof, clearError,
  } = useOrders();

  const load = useCallback(() => { fetchOrders(); }, [fetchOrders]);
  useEffect(() => { load(); }, [load]);

  const handleCancel = async (orderId) => {
    if (!window.confirm('¿Cancelar este pedido?')) return;
    try { await cancelOrder(orderId); }
    catch (err) { console.error('Error al cancelar:', err); }
  };

  const handleConfirmShipping = async (orderId, action, reason) => {
    return await confirmShipping(orderId, action, reason);
  };

  const handleUploadProof = async (orderId, file, proofData) => {
    await uploadPaymentProof(orderId, file, proofData);
  };

  if (loading && orders.length === 0) {
    return (
      <div className="mo-loading">
        <div className="mo-spinner-lg" />
        <span>Cargando pedidos…</span>
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <div className="mo-error">
        <FiAlertCircle size={32} />
        <h3>Error al cargar pedidos</h3>
        <p>{error}</p>
        <button className="mo-retry-btn" onClick={load}>
          <FiRefreshCw size={14} /> Reintentar
        </button>
      </div>
    );
  }

  if (!loading && orders.length === 0) {
    return (
      <div className="mo-empty">
        <div className="mo-empty-icon"><FiPackage size={44} /></div>
        <h3>Todavía no tenés pedidos</h3>
        <p>Cuando hagas tu primer pedido, aparecerá acá con su estado de seguimiento.</p>
        <button className="mo-shop-btn" onClick={onShop} type="button">
          <FiShoppingBag size={16} />
          Ir a la tienda
        </button>
      </div>
    );
  }

  return (
    <div className="my-orders">
      <div className="mo-list-header">
        <h2>{orders.length} pedido{orders.length !== 1 ? 's' : ''}</h2>
        <button className="mo-refresh-btn" onClick={load} disabled={loading}>
          <FiRefreshCw size={14} className={loading ? 'spinning' : ''} />
          Actualizar
        </button>
      </div>

      {error && (
        <div className="mo-inline-error">
          <FiAlertCircle size={14} />
          {error}
          <button onClick={clearError}><FiX size={13} /></button>
        </div>
      )}

      <div className="mo-cards">
        {orders.map(order => (
          <OrderCard
            key={order.id}
            order={order}
            onUploadProof={handleUploadProof}
            onCancel={handleCancel}
            onConfirmShipping={handleConfirmShipping}
          />
        ))}
      </div>
    </div>
  );
};

export default MyOrders;