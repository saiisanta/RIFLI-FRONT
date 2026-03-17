import React, { useState } from 'react';
import {
  X,
  FileEarmarkText,
  GeoAlt,
  Person,
  ClockHistory,
  CheckCircle,
  XCircle,
  ArrowRepeat,
  Trash3,
} from 'react-bootstrap-icons';
import './QuoteDetailModal.scss';

const API_URL = import.meta.env.VITE_API_URL;

const STATUS_CONFIG = {
  PENDING:     { label: 'Pendiente',     cls: 'yellow'  },
  QUOTED:      { label: 'Presupuestado', cls: 'blue'    },
  ACCEPTED:    { label: 'Aceptado',      cls: 'green'   },
  REJECTED:    { label: 'Rechazado',     cls: 'red'     },
  IN_PROGRESS: { label: 'En progreso',   cls: 'orange'  },
  COMPLETED:   { label: 'Completado',    cls: 'success' },
  CANCELLED:   { label: 'Cancelado',     cls: 'gray'    },
};

const PROOF_STATUS_CONFIG = {
  PENDING:        { label: 'Sin comprobante', cls: 'gray'   },
  PENDING_PROOF:  { label: 'Pendiente',       cls: 'yellow' },
  PROOF_UPLOADED: { label: 'Subido',          cls: 'blue'   },
  APPROVED:       { label: 'Aprobado',        cls: 'green'  },
  REJECTED:       { label: 'Rechazado',       cls: 'red'    },
  PAID:           { label: 'Pagado',          cls: 'success'},
};

const StatusBadge = ({ status, config = STATUS_CONFIG }) => {
  const cfg = config[status] || { label: status, cls: 'gray' };
  return <span className={`qdm-badge qdm-badge--${cfg.cls}`}>{cfg.label}</span>;
};

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

const formatCurrency = (amount) =>
  amount != null
    ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(amount)
    : '—';

const ADMIN_STATUS_TRANSITIONS = {
  PENDING:     [],
  QUOTED:      [],
  ACCEPTED:    ['IN_PROGRESS', 'CANCELLED'],
  REJECTED:    [],
  IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
  COMPLETED:   [],
  CANCELLED:   [],
};

const STATUS_LABELS = {
  IN_PROGRESS: 'Marcar En Progreso',
  COMPLETED:   'Marcar Completado',
  CANCELLED:   'Cancelar',
};

const QuoteDetailModal = ({
  quote,
  onClose,
  onOpenBudget,
  onUpdateStatus,
  onReviewProof,
  onDelete,
  loading,
}) => {
  const [actionLoading, setActionLoading] = useState(false);

  const client  = quote.client;
  const address = quote.address;
  const service = quote.service;
  const details = quote.service_details || {};
  const formSchema = service?.form_schema;

  const canBudget = ['PENDING', 'QUOTED'].includes(quote.status);
  const transitions = ADMIN_STATUS_TRANSITIONS[quote.status] || [];

  const handleStatusChange = async (status) => {
    const confirmMsg = status === 'CANCELLED'
      ? '¿Estás seguro que querés cancelar esta cotización?'
      : `¿Cambiar estado a "${STATUS_LABELS[status] || status}"?`;
    if (!window.confirm(confirmMsg)) return;
    setActionLoading(true);
    try {
      await onUpdateStatus(quote.id, status);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReview = async (paymentType, action) => {
    let reason = '';
    if (action === 'reject') {
      reason = window.prompt('Motivo del rechazo:') ?? '';
    }
    setActionLoading(true);
    try {
      await onReviewProof(quote.id, paymentType, action, reason);
    } finally {
      setActionLoading(false);
    }
  };

  // Render service_details using schema labels
  const renderDetails = () => {
    const fields = formSchema?.fields || [];
    return Object.entries(details).map(([key, val]) => {
      const fieldDef = fields.find(f => f.id === key);
      const label = fieldDef?.label || key.replace(/_/g, ' ');
      const display = typeof val === 'boolean' ? (val ? 'Sí' : 'No') : String(val ?? '—');
      return (
        <div key={key} className="qdm-detail-row">
          <span className="qdm-detail-key">{label}</span>
          <span className="qdm-detail-val">{display}</span>
        </div>
      );
    });
  };

  return (
    <div className="qdm-overlay" onClick={onClose}>
      <div className="qdm-container" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="qdm-header">
          <div className="qdm-header-left">
            <span className="qdm-quote-number">{quote.quote_number}</span>
            <StatusBadge status={quote.status} />
          </div>
          <button className="qdm-close-btn" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        <div className="qdm-body">

          {/* ── Info grid ── */}
          <div className="qdm-info-grid">

            {/* Client */}
            <div className="qdm-info-card">
              <div className="qdm-info-card-title">
                <Person size={14} />
                Cliente
              </div>
              {client ? (
                <>
                  <p className="qdm-info-primary">{client.first_name} {client.last_name}</p>
                  <p className="qdm-info-secondary">{client.email}</p>
                </>
              ) : <p className="qdm-info-secondary">—</p>}
            </div>

            {/* Service */}
            <div className="qdm-info-card">
              <div className="qdm-info-card-title">
                <FileEarmarkText size={14} />
                Servicio
              </div>
              <p className="qdm-info-primary">{service?.type || quote.service_type || '—'}</p>
              <p className="qdm-info-secondary">Solicitado el {formatDate(quote.createdAt)}</p>
            </div>

            {/* Address */}
            <div className="qdm-info-card">
              <div className="qdm-info-card-title">
                <GeoAlt size={14} />
                Dirección
              </div>
              {address ? (
                <>
                  <p className="qdm-info-primary">
                    {address.alias && <strong>{address.alias} — </strong>}
                    {address.street} {address.number}
                    {address.floor && `, Piso ${address.floor}`}
                  </p>
                  <p className="qdm-info-secondary">{address.city}, {address.province}</p>
                </>
              ) : <p className="qdm-info-secondary">—</p>}
            </div>

            {/* Dates */}
            <div className="qdm-info-card">
              <div className="qdm-info-card-title">
                <ClockHistory size={14} />
                Fechas clave
              </div>
              {quote.quoted_at    && <p className="qdm-info-secondary">Presupuestado: {formatDate(quote.quoted_at)}</p>}
              {quote.accepted_at  && <p className="qdm-info-secondary">Aceptado: {formatDate(quote.accepted_at)}</p>}
              {quote.started_at   && <p className="qdm-info-secondary">Iniciado: {formatDate(quote.started_at)}</p>}
              {quote.completed_at && <p className="qdm-info-secondary">Completado: {formatDate(quote.completed_at)}</p>}
              {quote.valid_until  && <p className="qdm-info-secondary">Válido hasta: {formatDate(quote.valid_until)}</p>}
            </div>
          </div>

          {/* ── Service details ── */}
          {Object.keys(details).length > 0 && (
            <div className="qdm-section">
              <div className="qdm-section-title">Detalles del proyecto</div>
              <div className="qdm-details-grid">
                {renderDetails()}
              </div>
            </div>
          )}

          {/* ── Client notes ── */}
          {quote.client_notes && (
            <div className="qdm-section">
              <div className="qdm-section-title">Notas del cliente</div>
              <p className="qdm-notes">{quote.client_notes}</p>
            </div>
          )}

          {/* ── Budget summary ── */}
          {quote.quoted_amount && (
            <div className="qdm-section">
              <div className="qdm-section-title-row">
                <span className="qdm-section-title">Resumen del presupuesto</span>
                {quote.budget_pdf && (
                  <a
                    href={`${API_URL}${quote.budget_pdf}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="qdm-pdf-btn"
                  >
                    <FileEarmarkText size={14} />
                    Ver PDF
                  </a>
                )}
              </div>
              <div className="qdm-budget-table">
                {quote.materials_subtotal && (
                  <div className="qdm-budget-row">
                    <span>Materiales</span>
                    <span>{formatCurrency(quote.materials_subtotal)}</span>
                  </div>
                )}
                {quote.labor_subtotal && (
                  <div className="qdm-budget-row">
                    <span>Mano de obra</span>
                    <span>{formatCurrency(quote.labor_subtotal)}</span>
                  </div>
                )}
                {Number(quote.discount_percentage) > 0 && (
                  <div className="qdm-budget-row discount">
                    <span>Descuento ({quote.discount_percentage}%)</span>
                    <span>— {formatCurrency(quote.discount_amount)}</span>
                  </div>
                )}
                {quote.tax_amount && (
                  <div className="qdm-budget-row">
                    <span>IVA ({quote.tax_percentage}%)</span>
                    <span>{formatCurrency(quote.tax_amount)}</span>
                  </div>
                )}
                <div className="qdm-budget-row total">
                  <span>Total</span>
                  <span>{formatCurrency(quote.quoted_amount)}</span>
                </div>
                {quote.deposit_amount && (
                  <div className="qdm-budget-row deposit">
                    <span>Seña ({quote.deposit_percentage}%)</span>
                    <span>{formatCurrency(quote.deposit_amount)}</span>
                  </div>
                )}
                {quote.final_payment_amount && (
                  <div className="qdm-budget-row">
                    <span>Pago final ({100 - Number(quote.deposit_percentage)}%)</span>
                    <span>{formatCurrency(quote.final_payment_amount)}</span>
                  </div>
                )}
              </div>
              {quote.estimated_completion_days && (
                <p className="qdm-completion">
                  Tiempo estimado: <strong>{quote.estimated_completion_days} días hábiles</strong>
                </p>
              )}
            </div>
          )}

          {/* ── Payment proofs ── */}
          {(quote.deposit_proof_url || quote.deposit_payment_status !== 'PENDING') && (
            <div className="qdm-section">
              <div className="qdm-section-title">Comprobantes de pago</div>

              {/* Deposit */}
              <div className="qdm-proof-row">
                <div className="qdm-proof-left">
                  <span className="qdm-proof-label">Seña</span>
                  <StatusBadge
                    status={quote.deposit_payment_status || 'PENDING'}
                    config={PROOF_STATUS_CONFIG}
                  />
                </div>
                <div className="qdm-proof-actions">
                  {quote.deposit_proof_url && (
                    <a
                      href={`${API_URL}${quote.deposit_proof_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="qdm-proof-view-btn"
                    >
                      Ver comprobante
                    </a>
                  )}
                  {quote.deposit_payment_status === 'PROOF_UPLOADED' && (
                    <>
                      <button
                        className="qdm-proof-approve-btn"
                        onClick={() => handleReview('deposit', 'approve')}
                        disabled={actionLoading}
                      >
                        <CheckCircle size={14} /> Aprobar
                      </button>
                      <button
                        className="qdm-proof-reject-btn"
                        onClick={() => handleReview('deposit', 'reject')}
                        disabled={actionLoading}
                      >
                        <XCircle size={14} /> Rechazar
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Final payment */}
              {(quote.final_proof_url || quote.final_payment_status !== 'PENDING') && (
                <div className="qdm-proof-row">
                  <div className="qdm-proof-left">
                    <span className="qdm-proof-label">Pago final</span>
                    <StatusBadge
                      status={quote.final_payment_status || 'PENDING'}
                      config={PROOF_STATUS_CONFIG}
                    />
                  </div>
                  <div className="qdm-proof-actions">
                    {quote.final_proof_url && (
                      <a
                        href={`${API_URL}${quote.final_proof_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="qdm-proof-view-btn"
                      >
                        Ver comprobante
                      </a>
                    )}
                    {quote.final_payment_status === 'PROOF_UPLOADED' && (
                      <>
                        <button
                          className="qdm-proof-approve-btn"
                          onClick={() => handleReview('final', 'approve')}
                          disabled={actionLoading}
                        >
                          <CheckCircle size={14} /> Aprobar
                        </button>
                        <button
                          className="qdm-proof-reject-btn"
                          onClick={() => handleReview('final', 'reject')}
                          disabled={actionLoading}
                        >
                          <XCircle size={14} /> Rechazar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Internal notes ── */}
          {quote.internal_notes && (
            <div className="qdm-section">
              <div className="qdm-section-title">Notas internas</div>
              <p className="qdm-internal-notes">{quote.internal_notes}</p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="qdm-footer">
          <button
            className="qdm-delete-btn"
            onClick={() => onDelete(quote.id)}
            disabled={actionLoading || loading}
          >
            <Trash3 size={15} />
            Eliminar
          </button>

          <div className="qdm-footer-right">
            {canBudget && (
              <button className="qdm-budget-btn" onClick={onOpenBudget} disabled={actionLoading}>
                <FileEarmarkText size={15} />
                {quote.status === 'QUOTED' ? 'Editar presupuesto' : 'Generar presupuesto'}
              </button>
            )}

            {transitions.map(t => (
              <button
                key={t}
                className={`qdm-status-btn qdm-status-btn--${t === 'CANCELLED' ? 'cancel' : 'primary'}`}
                onClick={() => handleStatusChange(t)}
                disabled={actionLoading || loading}
              >
                <ArrowRepeat size={14} />
                {STATUS_LABELS[t] || t}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default QuoteDetailModal;