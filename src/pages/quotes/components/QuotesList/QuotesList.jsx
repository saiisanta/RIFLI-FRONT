import React, { useState, useEffect, useCallback } from 'react';
import {
  FiChevronDown,
  FiChevronUp,
  FiPlusCircle,
  FiFileText,
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiClock,
  FiCheck,
  FiX,
  FiAlertCircle,
  FiRefreshCw,
} from 'react-icons/fi';
import useQuotes from '../../../../hooks/useQuotes';
import { quoteService } from '../../../../services/quoteService';
import './QuotesList.scss';

// ── Status config ─────────────────────────────────────────────

const STATUS_CONFIG = {
  PENDING:     { label: 'Pendiente',     color: 'yellow',  icon: FiClock },
  QUOTED:      { label: 'Presupuestado', color: 'blue',    icon: FiFileText },
  ACCEPTED:    { label: 'Aceptado',      color: 'green',   icon: FiCheck },
  REJECTED:    { label: 'Rechazado',     color: 'red',     icon: FiX },
  IN_PROGRESS: { label: 'En progreso',   color: 'orange',  icon: FiRefreshCw },
  COMPLETED:   { label: 'Completado',    color: 'success', icon: FiCheck },
  CANCELLED:   { label: 'Cancelado',     color: 'gray',    icon: FiX },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || { label: status, color: 'gray', icon: FiClock };
  const Icon = cfg.icon;
  return (
    <span className={`ql-status-badge ql-status--${cfg.color}`}>
      <Icon size={12} />
      {cfg.label}
    </span>
  );
};

// ── Format helpers ────────────────────────────────────────────

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
};

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '—';
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Render service_details using form_schema labels if available
const renderServiceDetails = (details, formSchema) => {
  if (!details || typeof details !== 'object') return null;
  const fields = formSchema?.fields || [];

  return Object.entries(details).map(([key, val]) => {
    const fieldDef = fields.find(f => f.id === key);
    const label = fieldDef?.label || key.replace(/_/g, ' ');
    const displayVal =
      typeof val === 'boolean' ? (val ? 'Sí' : 'No') : String(val ?? '—');

    return (
      <div key={key} className="ql-detail-row">
        <span className="ql-detail-key">{label}</span>
        <span className="ql-detail-val">{displayVal}</span>
      </div>
    );
  });
};

// ── Quote Card ────────────────────────────────────────────────

const QuoteCard = ({ quote, onAccept, onReject }) => {
  const [expanded, setExpanded] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const address = quote.address;
  const service = quote.service;
  const formSchema = service?.form_schema || service?.form_schema;

  const handleAccept = async () => {
    if (!window.confirm('¿Aceptás el presupuesto?')) return;
    setActionLoading(true);
    try {
      await onAccept(quote.id);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    const reason = window.prompt('¿Por qué rechazás el presupuesto? (opcional)') ?? '';
    setActionLoading(true);
    try {
      await onReject(quote.id, reason);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className={`ql-card ${expanded ? 'expanded' : ''}`}>

      {/* ── Card header (always visible) ── */}
      <div className="ql-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="ql-card-left">
          <span className="ql-quote-number">{quote.quote_number}</span>
          <StatusBadge status={quote.status} />
        </div>

        <div className="ql-card-meta">
          <span className="ql-card-service">{quote.service_type || service?.type}</span>
          <span className="ql-card-date">
            <FiCalendar size={13} />
            {formatDate(quote.createdAt)}
          </span>
          {quote.quoted_amount && (
            <span className="ql-card-amount">
              <FiDollarSign size={13} />
              {formatCurrency(quote.quoted_amount)}
            </span>
          )}
        </div>

        <button className="ql-expand-btn" type="button" aria-label="Expandir">
          {expanded ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
        </button>
      </div>

      {/* ── Expanded detail ── */}
      {expanded && (
        <div className="ql-card-body">

          {/* Address */}
          {address && (
            <div className="ql-detail-section">
              <div className="ql-detail-section-title">
                <FiMapPin size={14} />
                Dirección del trabajo
              </div>
              <p className="ql-detail-address">
                {address.alias && <strong>{address.alias} — </strong>}
                {address.street} {address.number}
                {address.floor && `, Piso ${address.floor}`}
                {address.apartment && `, Depto ${address.apartment}`}
                {', '}{address.city}, {address.province}
              </p>
            </div>
          )}

          {/* Service details (form answers) */}
          {quote.service_details && Object.keys(quote.service_details).length > 0 && (
            <div className="ql-detail-section">
              <div className="ql-detail-section-title">
                <FiFileText size={14} />
                Detalles del proyecto
              </div>
              <div className="ql-detail-grid">
                {renderServiceDetails(quote.service_details, formSchema)}
              </div>
            </div>
          )}

          {/* Client notes */}
          {quote.client_notes && (
            <div className="ql-detail-section">
              <div className="ql-detail-section-title">Notas del cliente</div>
              <p className="ql-detail-notes">{quote.client_notes}</p>
            </div>
          )}

          {/* Budget summary (when QUOTED or later) */}
          {quote.quoted_amount && (
            <div className="ql-budget-summary">
              <div className="ql-detail-section-title">
                <FiDollarSign size={14} />
                Resumen del presupuesto
              </div>
              <div className="ql-budget-grid">
                {quote.materials_subtotal && (
                  <div className="ql-budget-row">
                    <span>Materiales</span>
                    <span>{formatCurrency(quote.materials_subtotal)}</span>
                  </div>
                )}
                {quote.labor_subtotal && (
                  <div className="ql-budget-row">
                    <span>Mano de obra</span>
                    <span>{formatCurrency(quote.labor_subtotal)}</span>
                  </div>
                )}
                {Number(quote.discount_percentage) > 0 && (
                  <div className="ql-budget-row discount">
                    <span>Descuento ({quote.discount_percentage}%)</span>
                    <span>— {formatCurrency(quote.discount_amount)}</span>
                  </div>
                )}
                {quote.tax_amount && (
                  <div className="ql-budget-row">
                    <span>IVA ({quote.tax_percentage}%)</span>
                    <span>{formatCurrency(quote.tax_amount)}</span>
                  </div>
                )}
                <div className="ql-budget-row total">
                  <span>Total</span>
                  <span>{formatCurrency(quote.quoted_amount)}</span>
                </div>
                {quote.deposit_amount && (
                  <div className="ql-budget-row deposit">
                    <span>Seña ({quote.deposit_percentage}%)</span>
                    <span>{formatCurrency(quote.deposit_amount)}</span>
                  </div>
                )}
              </div>
              {quote.valid_until && (
                <p className="ql-budget-validity">
                  <FiClock size={12} />
                  Válido hasta: {formatDate(quote.valid_until)}
                </p>
              )}
              {quote.estimated_completion_days && (
                <p className="ql-budget-validity">
                  <FiCalendar size={12} />
                  Tiempo estimado: {quote.estimated_completion_days} días hábiles
                </p>
              )}
            </div>
          )}

          {/* Actions — only when QUOTED */}
          {quote.status === 'QUOTED' && (
            <div className="ql-card-actions">
              <button
                type="button"
                className="ql-btn-accept"
                onClick={handleAccept}
                disabled={actionLoading}
              >
                <FiCheck size={16} />
                Aceptar presupuesto
              </button>
              <button
                type="button"
                className="ql-btn-reject"
                onClick={handleReject}
                disabled={actionLoading}
              >
                <FiX size={16} />
                Rechazar
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

// ── Main List ─────────────────────────────────────────────────

const QuotesList = ({ onNewQuote }) => {
  const { quotes, loading, error, fetchQuotes, acceptQuote, rejectQuote, clearError } = useQuotes();

  const load = useCallback(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAccept = async (quoteId) => {
    try {
      await acceptQuote(quoteId);
    } catch (err) {
      console.error('Error al aceptar:', err);
    }
  };

  const handleReject = async (quoteId, reason) => {
    try {
      await rejectQuote(quoteId, reason);
    } catch (err) {
      console.error('Error al rechazar:', err);
    }
  };

  // ── Loading ─────────────────────────────────────────────

  if (loading && quotes.length === 0) {
    return (
      <div className="ql-loading">
        <div className="ql-spinner" />
        <span>Cargando solicitudes…</span>
      </div>
    );
  }

  // ── Error ───────────────────────────────────────────────

  if (error && quotes.length === 0) {
    return (
      <div className="ql-error">
        <FiAlertCircle size={32} />
        <h3>Error al cargar solicitudes</h3>
        <p>{error}</p>
        <button className="ql-retry-btn" onClick={load}>
          <FiRefreshCw size={15} />
          Reintentar
        </button>
      </div>
    );
  }

  // ── Empty ───────────────────────────────────────────────

  if (!loading && quotes.length === 0) {
    return (
      <div className="ql-empty">
        <div className="ql-empty-icon">
          <FiFileText size={40} />
        </div>
        <h3>Todavía no tenés solicitudes</h3>
        <p>Cuando solicites un presupuesto, aparecerá acá con su estado y seguimiento.</p>
        <button className="ql-empty-btn" onClick={onNewQuote} type="button">
          <FiPlusCircle size={16} />
          Solicitar mi primer presupuesto
        </button>
      </div>
    );
  }

  // ── List ────────────────────────────────────────────────

  return (
    <div className="quotes-list">

      <div className="ql-list-header">
        <div className="ql-list-title">
          <h2>{quotes.length} {quotes.length === 1 ? 'solicitud' : 'solicitudes'}</h2>
        </div>
        <button className="ql-new-btn" onClick={onNewQuote} type="button">
          <FiPlusCircle size={16} />
          Nueva solicitud
        </button>
      </div>

      {error && (
        <div className="ql-inline-error">
          <FiAlertCircle size={15} />
          {error}
          <button onClick={clearError}><FiX size={14} /></button>
        </div>
      )}

      <div className="ql-cards">
        {quotes.map(quote => (
          <QuoteCard
            key={quote.id}
            quote={quote}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        ))}
      </div>

    </div>
  );
};

export default QuotesList;