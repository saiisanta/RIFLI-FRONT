import React, { useState } from 'react';
import {
  X, Person, GeoAlt, BoxSeam, CurrencyDollar,
  FileEarmarkText, ClockHistory, CheckCircle, XCircle,
  Truck, ArrowRepeat,
} from 'react-bootstrap-icons';
import AdminDialog from '../../../../../../components/AdminDialog/AdminDialog';
import './OrderDetailModal.scss';

const API_URL = import.meta.env.VITE_API_URL;

// ── Config ────────────────────────────────────────────────────

const STATUS_CONFIG = {
  PENDING_PAYMENT: { label: 'Esperando pago',  cls: 'yellow' },
  PAID:            { label: 'Pagado',           cls: 'success'},
  PROCESSING:      { label: 'En proceso',       cls: 'blue'   },
  SHIPPED:         { label: 'Enviado',          cls: 'orange' },
  DELIVERED:       { label: 'Entregado',        cls: 'success'},
  CANCELLED:       { label: 'Cancelado',        cls: 'red'    },
  REFUNDED:        { label: 'Reembolsado',      cls: 'gray'   },
};

const SHIPPING_CONFIG = {
  PENDING:  { label: 'Sin cotizar',      cls: 'yellow' },
  QUOTED:   { label: 'Cotizado',         cls: 'blue'   },
  ACCEPTED: { label: 'Aceptado',         cls: 'success'},
  REJECTED: { label: 'Rechazado',        cls: 'red'    },
};

const PAYMENT_CONFIG = {
  PENDING_PROOF:  { label: 'Sin comprobante',   cls: 'gray'   },
  PROOF_UPLOADED: { label: 'Comprobante subido', cls: 'yellow' },
  APPROVED:       { label: 'Pagado',            cls: 'success'},
  REJECTED:       { label: 'Rechazado',         cls: 'red'    },
  PAID:           { label: 'Pagado',            cls: 'success'},
};

const STATUS_TRANSITIONS = {
  PENDING_PAYMENT: [{ value: 'CANCELLED', label: 'Cancelar orden' }],
  PROCESSING:      [
    { value: 'SHIPPED',   label: 'Marcar como enviado' },
    { value: 'CANCELLED', label: 'Cancelar orden' },
  ],
  SHIPPED:         [{ value: 'DELIVERED', label: 'Marcar como entregado' }],
};

const STATUS_LABELS = {
  SHIPPED:   'Marcar como enviado',
  DELIVERED: 'Marcar como entregado',
  CANCELLED: 'Cancelar orden',
};

const DIALOG_CLOSED = {
  open: false, type: 'confirm', variant: 'default',
  title: '', message: '', placeholder: '',
  confirmLabel: 'Confirmar', cancelLabel: 'Cancelar', onConfirm: null,
};

// ── Helpers ───────────────────────────────────────────────────

const StatusBadge = ({ status, config }) => {
  const cfg = config[status] || { label: status, cls: 'gray' };
  return <span className={`odm-badge odm-badge--${cfg.cls}`}>{cfg.label}</span>;
};

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }) : '—';

const formatCurrency = (amount) =>
  amount != null
    ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(Number(amount))
    : '—';

// ── Main component ────────────────────────────────────────────

const OrderDetailModal = ({
  order: orderProp,
  onClose,
  onSetShipping,
  onReviewProof,
  onUpdateStatus,
  loading,
}) => {
  const [order, setOrder]           = useState(orderProp);
  const [actionLoading, setActionLoading] = useState(false);
  const [dialog, setDialog]         = useState(DIALOG_CLOSED);
  const [shippingCost, setShippingCost]   = useState('');
  const [shippingNotes, setShippingNotes] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  const client  = order.customer || order.client || order.User;
  const address = order.shippingAddress || order.address || order.Address;
  const proofs  = order.paymentOrderProofs || order.proofs || [];
  const items   = order.items || [];

  const canSetShipping = order.shipping_status === 'PENDING' && order.status === 'PENDING_PAYMENT';
  const transitions    = STATUS_TRANSITIONS[order.status] || [];

  const closeDialog = () => setDialog(DIALOG_CLOSED);

  const openConfirm = ({ title, message, variant = 'default', confirmLabel = 'Confirmar', onConfirm }) =>
    setDialog({ open: true, type: 'confirm', variant, title, message, placeholder: '', confirmLabel, cancelLabel: 'Cancelar', onConfirm });

  const openPrompt = ({ title, message, placeholder = '', variant = 'default', confirmLabel = 'Confirmar', onConfirm }) =>
    setDialog({ open: true, type: 'prompt', variant, title, message, placeholder, confirmLabel, cancelLabel: 'Cancelar', onConfirm });

  // ── Cotizar envío ─────────────────────────────────────────

  const handleSetShipping = () => {
    if (!shippingCost) return;
    openConfirm({
      title: 'Confirmar cotización',
      message: `Se enviará al cliente un precio de envío de ${formatCurrency(shippingCost)}. ¿Confirmás?`,
      confirmLabel: 'Enviar cotización',
      onConfirm: async () => {
        closeDialog();
        setActionLoading(true);
        try {
          const updated = await onSetShipping(order.id, {
            shipping_cost:  Number(shippingCost),
            internal_notes: shippingNotes,
          });
          setOrder(prev => ({ ...prev, ...(updated || {}), shipping_status: 'QUOTED', shipping_cost: Number(shippingCost) }));
          setShippingCost('');
          setShippingNotes('');
        } finally {
          setActionLoading(false);
        }
      },
    });
  };

  // ── Revisar comprobante ───────────────────────────────────

  const handleReview = (proofId, action) => {
    if (action === 'reject') {
      openPrompt({
        title: 'Rechazar comprobante',
        message: 'Ingresá el motivo del rechazo.',
        placeholder: 'Ej: El monto no coincide con el total...',
        variant: 'danger',
        confirmLabel: 'Rechazar',
        onConfirm: async (reason) => {
          closeDialog();
          setActionLoading(true);
          try {
            const updated = await onReviewProof(order.id, { proof_id: proofId, action, rejection_reason: reason || '' });
            setOrder(prev => ({ ...prev, ...(updated || {}), payment_status: 'REJECTED' }));
          } finally {
            setActionLoading(false);
          }
        },
      });
    } else {
      openConfirm({
        title: 'Aprobar comprobante',
        message: '¿Confirmás que el comprobante es válido? Se descontará el stock y la orden pasará a "En proceso".',
        confirmLabel: 'Aprobar',
        onConfirm: async () => {
          closeDialog();
          setActionLoading(true);
          try {
            const updated = await onReviewProof(order.id, { proof_id: proofId, action });
            setOrder(prev => ({ ...prev, ...(updated || {}), payment_status: 'APPROVED', status: 'PROCESSING' }));
          } finally {
            setActionLoading(false);
          }
        },
      });
    }
  };

  // ── Cambiar estado ────────────────────────────────────────

  const handleStatusChange = (status) => {
    if (status === 'CANCELLED') {
      openPrompt({
        title: 'Cancelar orden',
        message: 'Ingresá el motivo de la cancelación.',
        placeholder: 'Ej: Sin stock disponible...',
        variant: 'danger',
        confirmLabel: 'Cancelar orden',
        onConfirm: async (reason) => {
          closeDialog();
          setActionLoading(true);
          try {
            const updated = await onUpdateStatus(order.id, { status, cancellation_reason: reason || '' });
            setOrder(prev => ({ ...prev, ...(updated || {}), status }));
          } finally {
            setActionLoading(false);
          }
        },
      });
    } else if (status === 'SHIPPED') {
      openConfirm({
        title: 'Marcar como enviado',
        message: trackingNumber
          ? `Se marcará como enviado con número de seguimiento: ${trackingNumber}`
          : 'Se marcará la orden como enviada. Podés agregar un número de seguimiento antes de confirmar.',
        confirmLabel: 'Confirmar envío',
        onConfirm: async () => {
          closeDialog();
          setActionLoading(true);
          try {
            const updated = await onUpdateStatus(order.id, {
              status,
              ...(trackingNumber && { tracking_number: trackingNumber }),
            });
            setOrder(prev => ({ ...prev, ...(updated || {}), status, shipped_at: new Date().toISOString() }));
          } finally {
            setActionLoading(false);
          }
        },
      });
    } else {
      openConfirm({
        title: `¿${STATUS_LABELS[status] || status}?`,
        message: `Se cambiará el estado de la orden a "${STATUS_CONFIG[status]?.label || status}".`,
        confirmLabel: STATUS_LABELS[status] || status,
        onConfirm: async () => {
          closeDialog();
          setActionLoading(true);
          try {
            const updated = await onUpdateStatus(order.id, { status });
            setOrder(prev => ({ ...prev, ...(updated || {}), status }));
          } finally {
            setActionLoading(false);
          }
        },
      });
    }
  };

  return (
    <>
      <AdminDialog
        open={dialog.open}
        type={dialog.type}
        variant={dialog.variant}
        title={dialog.title}
        message={dialog.message}
        placeholder={dialog.placeholder}
        confirmLabel={dialog.confirmLabel}
        cancelLabel={dialog.cancelLabel}
        onConfirm={dialog.onConfirm}
        onCancel={closeDialog}
      />

      <div className="odm-overlay" onClick={onClose}>
        <div className="odm-container" onClick={e => e.stopPropagation()}>

          {/* ── Header ── */}
          <div className="odm-header">
            <div className="odm-header-left">
              <span className="odm-order-number">{order.order_number || `#${order.id}`}</span>
              <StatusBadge status={order.status}          config={STATUS_CONFIG}   />
              <StatusBadge status={order.shipping_status} config={SHIPPING_CONFIG} />
              <StatusBadge status={order.payment_status}  config={PAYMENT_CONFIG}  />
            </div>
            <button className="odm-close-btn" onClick={onClose} aria-label="Cerrar">
              <X size={20} />
            </button>
          </div>

          <div className="odm-body">

            {/* ── Info grid ── */}
            <div className="odm-info-grid">
              <div className="odm-info-card">
                <div className="odm-info-card-title"><Person size={13} />Cliente</div>
                {client ? (
                  <>
                    <p className="odm-info-primary">{client.first_name} {client.last_name}</p>
                    <p className="odm-info-secondary">{client.email}</p>
                    {client.phone && <p className="odm-info-secondary">{client.phone}</p>}
                  </>
                ) : <p className="odm-info-secondary">—</p>}
              </div>

              <div className="odm-info-card">
                <div className="odm-info-card-title"><GeoAlt size={13} />Dirección de entrega</div>
                {address ? (
                  <>
                    <p className="odm-info-primary">
                      {address.street} {address.number}
                      {address.floor && `, Piso ${address.floor}`}
                      {address.apartment && `, Dpto ${address.apartment}`}
                    </p>
                    <p className="odm-info-secondary">{address.city}, {address.province}</p>
                    {address.postal_code && <p className="odm-info-secondary">CP {address.postal_code}</p>}
                  </>
                ) : (
                  // Fallback al snapshot de dirección
                  order.shipping_address_snapshot ? (
                    <>
                      <p className="odm-info-primary">
                        {order.shipping_address_snapshot.street} {order.shipping_address_snapshot.number}
                      </p>
                      <p className="odm-info-secondary">
                        {order.shipping_address_snapshot.city}, {order.shipping_address_snapshot.province}
                      </p>
                    </>
                  ) : <p className="odm-info-secondary">—</p>
                )}
              </div>

              <div className="odm-info-card">
                <div className="odm-info-card-title"><CurrencyDollar size={13} />Método de pago</div>
                <p className="odm-info-primary">
                  {order.payment_method === 'BANK_TRANSFER' ? 'Transferencia bancaria' : 'Efectivo'}
                </p>
                {order.paid_at && <p className="odm-info-secondary">Pagado el {formatDate(order.paid_at)}</p>}
              </div>

              <div className="odm-info-card">
                <div className="odm-info-card-title"><ClockHistory size={13} />Fechas</div>
                <p className="odm-info-secondary">Creado: {formatDate(order.createdAt)}</p>
                {order.shipped_at   && <p className="odm-info-secondary">Enviado: {formatDate(order.shipped_at)}</p>}
                {order.delivered_at && <p className="odm-info-secondary">Entregado: {formatDate(order.delivered_at)}</p>}
                {order.tracking_number && (
                  <p className="odm-info-secondary tracking">
                    Seguimiento: <strong>{order.tracking_number}</strong>
                  </p>
                )}
              </div>
            </div>

            {/* ── Productos ── */}
            {items.length > 0 && (
              <div className="odm-section">
                <div className="odm-section-title"><BoxSeam size={14} />Productos</div>
                <div className="odm-items">
                  {items.map((item, idx) => {
                    const img   = item.imageUrl || item.main_image;
                    const price = Number(item.unit_price || item.price) || 0;
                    return (
                      <div key={idx} className="odm-item">
                        {img && (
                          <img
                            src={img.startsWith('http') ? img : `${API_URL}${img}`}
                            alt={item.name}
                            className="odm-item-img"
                            onError={e => { e.currentTarget.src = '/api/images/placeholder.png'; }}
                          />
                        )}
                        <div className="odm-item-info">
                          <span className="odm-item-name">{item.name}</span>
                          {item.sku && <span className="odm-item-sku">SKU: {item.sku}</span>}
                        </div>
                        <div className="odm-item-right">
                          <span className="odm-item-qty">x{item.quantity}</span>
                          <span className="odm-item-price">{formatCurrency(price * item.quantity)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Totales ── */}
            <div className="odm-section">
              <div className="odm-section-title"><CurrencyDollar size={14} />Resumen económico</div>
              <div className="odm-totals">
                <div className="odm-total-row">
                  <span>Subtotal productos</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                {order.shipping_cost != null && (
                  <div className="odm-total-row">
                    <span>Costo de envío</span>
                    <span>{formatCurrency(order.shipping_cost)}</span>
                  </div>
                )}
                {Number(order.tax) > 0 && (
                  <div className="odm-total-row">
                    <span>Impuestos</span>
                    <span>{formatCurrency(order.tax)}</span>
                  </div>
                )}
                {Number(order.discount) > 0 && (
                  <div className="odm-total-row discount">
                    <span>Descuento</span>
                    <span>— {formatCurrency(order.discount)}</span>
                  </div>
                )}
                <div className="odm-total-row total">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>

            {/* ── Cotizar envío (solo si shipping_status === PENDING) ── */}
            {canSetShipping && (
              <div className="odm-section odm-section--action">
                <div className="odm-section-title">
                  <Truck size={14} />
                  Cotizar precio de envío
                </div>
                <p className="odm-section-desc">
                  El cliente espera el precio de envío para confirmar el pedido. Ingresá el costo y enviá la cotización.
                </p>
                <div className="odm-shipping-form">
                  <div className="odm-field">
                    <label>Costo de envío ($) *</label>
                    <input
                      type="number"
                      min="0"
                      className="odm-input"
                      placeholder="Ej: 5000"
                      value={shippingCost}
                      onChange={e => setShippingCost(e.target.value)}
                    />
                  </div>
                  <div className="odm-field">
                    <label>Notas internas <span className="odm-optional">(opcional)</span></label>
                    <input
                      type="text"
                      className="odm-input"
                      placeholder="Ej: Envío por correo argentino"
                      value={shippingNotes}
                      onChange={e => setShippingNotes(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  className="odm-btn-shipping"
                  onClick={handleSetShipping}
                  disabled={!shippingCost || actionLoading || loading}
                >
                  <Truck size={14} />
                  Enviar cotización al cliente
                </button>
              </div>
            )}

            {/* ── Comprobantes de pago ── */}
            {proofs.length > 0 && (
              <div className="odm-section">
                <div className="odm-section-title">
                  <FileEarmarkText size={14} />
                  Comprobantes de pago
                </div>
                {proofs.map(proof => (
                  <div key={proof.id} className={`odm-proof-row odm-proof--${(proof.status || 'pending').toLowerCase()}`}>
                    <div className="odm-proof-left">
                      <div className="odm-proof-info">
                        <span className="odm-proof-method">
                          {proof.payment_type === 'BANK_TRANSFER' ? 'Transferencia' : 'Efectivo'}
                        </span>
                        {proof.amount && (
                          <span className="odm-proof-amount">{formatCurrency(proof.amount)}</span>
                        )}
                        {proof.transaction_reference && (
                          <span className="odm-proof-ref">Ref: {proof.transaction_reference}</span>
                        )}
                        {proof.bank_name && (
                          <span className="odm-proof-bank">{proof.bank_name}</span>
                        )}
                        {proof.transaction_date && (
                          <span className="odm-proof-date">{formatDate(proof.transaction_date)}</span>
                        )}
                      </div>
                      <StatusBadge status={proof.status || 'PENDING_PROOF'} config={PAYMENT_CONFIG} />
                    </div>
                    <div className="odm-proof-actions">
                      {proof.proof_image_url && (
                        <a
                          href={`${API_URL}${proof.proof_image_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="odm-proof-view-btn"
                        >
                          <FileEarmarkText size={13} />
                          Ver comprobante
                        </a>
                      )}
                      {proof.status === 'PENDING' && (
                        <>
                          <button
                            className="odm-proof-approve-btn"
                            onClick={() => handleReview(proof.id, 'approve')}
                            disabled={actionLoading}
                          >
                            <CheckCircle size={13} /> Aprobar
                          </button>
                          <button
                            className="odm-proof-reject-btn"
                            onClick={() => handleReview(proof.id, 'reject')}
                            disabled={actionLoading}
                          >
                            <XCircle size={13} /> Rechazar
                          </button>
                        </>
                      )}
                      {proof.rejection_reason && (
                        <p className="odm-proof-rejection">Motivo: {proof.rejection_reason}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Notas del cliente ── */}
            {order.customer_notes && (
              <div className="odm-section">
                <div className="odm-section-title">Notas del cliente</div>
                <p className="odm-notes">{order.customer_notes}</p>
              </div>
            )}

            {/* ── Notas internas ── */}
            {order.internal_notes && (
              <div className="odm-section">
                <div className="odm-section-title">Notas internas</div>
                <p className="odm-internal-notes">{order.internal_notes}</p>
              </div>
            )}

          </div>

          {/* ── Footer: transiciones de estado ── */}
          {transitions.length > 0 && (
            <div className="odm-footer">
              {/* Tracking input solo para SHIPPED */}
              {order.status === 'PROCESSING' && (
                <input
                  type="text"
                  className="odm-input odm-input--tracking"
                  placeholder="N° de seguimiento (opcional)"
                  value={trackingNumber}
                  onChange={e => setTrackingNumber(e.target.value)}
                />
              )}

              <div className="odm-footer-right">
                {transitions.map(t => (
                  <button
                    key={t.value}
                    className={`odm-status-btn odm-status-btn--${t.value === 'CANCELLED' ? 'cancel' : 'primary'}`}
                    onClick={() => handleStatusChange(t.value)}
                    disabled={actionLoading || loading}
                  >
                    <ArrowRepeat size={14} />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default OrderDetailModal;