import React, { useState } from 'react';
import {
  FiChevronDown, FiChevronUp, FiPlusCircle, FiFileText,
  FiMapPin, FiCalendar, FiDollarSign, FiClock, FiCheck,
  FiX, FiAlertCircle, FiRefreshCw, FiUpload, FiShield, FiInfo, FiLoader,
} from 'react-icons/fi';
import useQuotes from '../../../../hooks/useQuotes';
import useBankAccount from '../../../../hooks/useBankAccount';
import useApiError from '../../../../hooks/useApiError';
import AdminDialog from '../../../../components/AdminDialog/AdminDialog';
import RateLimitToast from '../../../../components/RateLimitToast/RateLimitToast';
import './QuotesList.scss';

const API_URL = import.meta.env.VITE_API_URL;

const STATUS_CONFIG = {
  PENDING:     { label: 'Pendiente',     color: 'yellow', icon: FiClock     },
  QUOTED:      { label: 'Presupuestado', color: 'blue',   icon: FiFileText  },
  ACCEPTED:    { label: 'Aceptado',      color: 'green',  icon: FiCheck     },
  REJECTED:    { label: 'Rechazado',     color: 'red',    icon: FiX         },
  IN_PROGRESS: { label: 'En progreso',   color: 'orange', icon: FiRefreshCw },
  COMPLETED:   { label: 'Completado',    color: 'success',icon: FiCheck     },
  CANCELLED:   { label: 'Cancelado',     color: 'gray',   icon: FiX         },
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

const PROOF_STATUS = {
  PENDING:        { label: 'Sin comprobante',     color: 'gray'    },
  PENDING_PROOF:  { label: 'Pendiente de pago',   color: 'yellow'  },
  PROOF_UPLOADED: { label: 'Comprobante enviado', color: 'blue'    },
  APPROVED:       { label: 'Aprobado',            color: 'green'   },
  REJECTED:       { label: 'Rechazado',           color: 'red'     },
  PAID:           { label: 'Pago confirmado',      color: 'success' },
};

const ProofStatusBadge = ({ status }) => {
  const cfg = PROOF_STATUS[status] || PROOF_STATUS.PENDING;
  return <span className={`ql-proof-badge ql-proof--${cfg.color}`}>{cfg.label}</span>;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '—';
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(amount);
};

const renderServiceDetails = (details, formSchema) => {
  if (!details || typeof details !== 'object') return null;
  const fields = formSchema?.fields || [];
  return Object.entries(details).map(([key, val]) => {
    const fieldDef   = fields.find((f) => f.id === key);
    const label      = fieldDef?.label || key.replace(/_/g, ' ');
    const displayVal = typeof val === 'boolean' ? (val ? 'Sí' : 'No') : String(val ?? '—');
    return (
      <div key={key} className="ql-detail-row">
        <span className="ql-detail-key">{label}</span>
        <span className="ql-detail-val">{displayVal}</span>
      </div>
    );
  });
};

const BtnSpinner = () => <span className="ql-btn-spinner" />;

const PaymentProofUploader = ({ quote, paymentType, onUpload, bankAccount, onApiError }) => {
  const [file, setFile]               = useState(null);
  const [uploading, setUploading]     = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const isDeposit   = paymentType === 'deposit';
  const proofUrl    = isDeposit ? quote.deposit_proof_url    : quote.final_proof_url;
  const proofStatus = isDeposit ? quote.deposit_payment_status : quote.final_payment_status;
  const amount      = isDeposit ? quote.deposit_amount       : quote.final_payment_amount;
  const label       = isDeposit ? 'Seña'                     : 'Pago final';
  const canUpload   = !['PAID', 'APPROVED', 'PROOF_UPLOADED'].includes(proofStatus);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) { setUploadError('El archivo no puede superar los 10MB'); return; }
    setFile(f);
    setUploadError(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      await onUpload(quote.id, file, paymentType);
      setFile(null);
    } catch (err) {
      if (err?.response?.status === 429) {
        onApiError?.(err);
      } else {
        setUploadError(err.message || 'Error al subir el comprobante');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`ql-proof-section ql-proof-section--${(proofStatus || 'pending').toLowerCase()}`}>
      <div className="ql-proof-header">
        <div className="ql-proof-header-left">
          <FiShield size={14} />
          <span className="ql-proof-label">{label}</span>
          {amount && <span className="ql-proof-amount">{formatCurrency(amount)}</span>}
        </div>
        <ProofStatusBadge status={proofStatus || 'PENDING'} />
      </div>

      {proofUrl && (
        <a href={`${API_URL}${proofUrl}`} target="_blank" rel="noopener noreferrer"
          className="ql-proof-view-link" onClick={(e) => e.stopPropagation()}>
          <FiFileText size={13} />
          Ver comprobante enviado
        </a>
      )}

      {proofStatus === 'REJECTED' && (
        <p className="ql-proof-msg ql-proof-msg--rejected">
          <FiAlertCircle size={13} />
          Tu comprobante fue rechazado. Por favor subí uno nuevo.
        </p>
      )}
      {proofStatus === 'PROOF_UPLOADED' && (
        <p className="ql-proof-msg ql-proof-msg--waiting">
          <FiClock size={13} />
          Comprobante recibido — esperando revisión del equipo.
        </p>
      )}
      {(proofStatus === 'PAID' || proofStatus === 'APPROVED') && (
        <p className="ql-proof-msg ql-proof-msg--confirmed">
          <FiCheck size={13} />
          Pago verificado y confirmado.
        </p>
      )}

      {canUpload && bankAccount && (
        <div className="ql-bank-transfer-info">
          <div className="ql-bank-transfer-title"><FiInfo size={13} />Datos para transferir</div>
          <div className="ql-bank-transfer-grid">
            <div className="ql-bank-transfer-row">
              <span className="ql-bank-transfer-label">Banco</span>
              <span className="ql-bank-transfer-value">{bankAccount.bank_name}</span>
            </div>
            <div className="ql-bank-transfer-row">
              <span className="ql-bank-transfer-label">Titular</span>
              <span className="ql-bank-transfer-value">{bankAccount.holder_name}</span>
            </div>
            {bankAccount.alias && (
              <div className="ql-bank-transfer-row">
                <span className="ql-bank-transfer-label">Alias</span>
                <span className="ql-bank-transfer-value ql-bank-transfer-value--highlight">{bankAccount.alias}</span>
              </div>
            )}
            <div className="ql-bank-transfer-row">
              <span className="ql-bank-transfer-label">CBU</span>
              <span className="ql-bank-transfer-value ql-bank-transfer-value--mono">{bankAccount.cbu}</span>
            </div>
          </div>
        </div>
      )}

      {canUpload && (
        <div className="ql-proof-upload-area">
          <div className="ql-proof-file-wrapper">
            <input type="file" id={`proof-${paymentType}-${quote.id}`} accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange} disabled={uploading} />
            <label htmlFor={`proof-${paymentType}-${quote.id}`}
              className={`ql-proof-file-label ${file ? 'has-file' : ''}`}>
              <FiUpload size={16} />
              <span>{file ? file.name : 'Seleccionar comprobante'}</span>
              <small>PDF, JPG o PNG — máx 10MB</small>
            </label>
          </div>
          {uploadError && (
            <p className="ql-proof-upload-error"><FiAlertCircle size={13} />{uploadError}</p>
          )}
          <button type="button" className="ql-proof-upload-btn" onClick={handleUpload} disabled={!file || uploading}>
            {uploading ? <><BtnSpinner /> Subiendo…</> : <><FiUpload size={14} /> Enviar comprobante</>}
          </button>
        </div>
      )}
    </div>
  );
};

const DIALOG_CLOSED = {
  open: false, type: 'confirm', variant: 'default',
  title: '', message: '', placeholder: '', confirmLabel: 'Confirmar', onConfirm: null,
};

const QuoteCard = ({ quote: quoteProp, onAccept, onReject, onUploadProof, bankAccount, onApiError }) => {
  const [quote, setQuote]                 = useState(quoteProp);
  const [expanded, setExpanded]           = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [dialog, setDialog]               = useState(DIALOG_CLOSED);

  const address    = quote.address;
  const service    = quote.service;
  const formSchema = service?.form_schema;

  const closeDialog = () => setDialog(DIALOG_CLOSED);

  const handleAccept = () => {
    setDialog({
      open: true, type: 'confirm', variant: 'default',
      title: 'Aceptar presupuesto',
      message: `¿Confirmás que querés aceptar el presupuesto ${quote.quote_number} por ${formatCurrency(quote.quoted_amount)}?`,
      placeholder: '', confirmLabel: 'Sí, aceptar',
      onConfirm: async () => {
        closeDialog();
        setActionLoading(true);
        try {
          await onAccept(quote.id);
          setQuote((prev) => ({ ...prev, status: 'ACCEPTED', accepted_at: new Date().toISOString() }));
        } catch (err) {
          onApiError?.(err);
        } finally {
          setActionLoading(false);
        }
      },
    });
  };

  const handleReject = () => {
    setDialog({
      open: true, type: 'prompt', variant: 'danger',
      title: 'Rechazar presupuesto',
      message: '¿Por qué rechazás el presupuesto? Podés dejarlo en blanco si preferís.',
      placeholder: 'Motivo del rechazo (opcional)...',
      confirmLabel: 'Rechazar',
      onConfirm: async (reason) => {
        closeDialog();
        setActionLoading(true);
        try {
          await onReject(quote.id, reason || '');
          setQuote((prev) => ({
            ...prev, status: 'REJECTED',
            rejected_at: new Date().toISOString(),
            rejection_reason: reason || '',
          }));
        } catch (err) {
          onApiError?.(err);
        } finally {
          setActionLoading(false);
        }
      },
    });
  };

  const showPayments     = ['ACCEPTED', 'IN_PROGRESS', 'COMPLETED'].includes(quote.status);
  const depositConfirmed = ['PAID', 'APPROVED'].includes(quote.deposit_payment_status);

  return (
    <>
      <AdminDialog
        open={dialog.open} type={dialog.type} variant={dialog.variant}
        title={dialog.title} message={dialog.message} placeholder={dialog.placeholder}
        confirmLabel={dialog.confirmLabel} cancelLabel="Cancelar"
        onConfirm={dialog.onConfirm} onCancel={closeDialog}
      />

      <div className={`ql-card ${expanded ? 'expanded' : ''}`}>
        <div className="ql-card-header" onClick={() => setExpanded(!expanded)}>
          <div className="ql-card-left">
            <span className="ql-quote-number">{quote.quote_number}</span>
            <StatusBadge status={quote.status} />
          </div>
          <div className="ql-card-meta">
            <span className="ql-card-service">{quote.service_type || service?.type}</span>
            <span className="ql-card-date"><FiCalendar size={13} />{formatDate(quote.createdAt)}</span>
            {quote.quoted_amount && (
              <span className="ql-card-amount">
                <FiDollarSign size={13} />{formatCurrency(quote.quoted_amount)}
              </span>
            )}
          </div>
          <button className="ql-expand-btn" type="button" aria-label="Expandir">
            {expanded ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
          </button>
        </div>

        {expanded && (
          <div className="ql-card-body">
            {address && (
              <div className="ql-detail-section">
                <div className="ql-detail-section-title"><FiMapPin size={14} /> Dirección del trabajo</div>
                <p className="ql-detail-address">
                  {address.alias && <strong>{address.alias} — </strong>}
                  {address.street} {address.number}
                  {address.floor     && `, Piso ${address.floor}`}
                  {address.apartment && `, Depto ${address.apartment}`}
                  {', '}{address.city}, {address.province}
                </p>
              </div>
            )}

            {quote.service_details && Object.keys(quote.service_details).length > 0 && (
              <div className="ql-detail-section">
                <div className="ql-detail-section-title"><FiFileText size={14} /> Detalles del proyecto</div>
                <div className="ql-detail-grid">{renderServiceDetails(quote.service_details, formSchema)}</div>
              </div>
            )}

            {quote.client_notes && (
              <div className="ql-detail-section">
                <div className="ql-detail-section-title">Notas del cliente</div>
                <p className="ql-detail-notes">{quote.client_notes}</p>
              </div>
            )}

            {quote.quoted_amount && (
              <div className="ql-budget-summary">
                <div className="ql-detail-section-title">
                  <FiDollarSign size={14} />
                  Resumen del presupuesto
                  {quote.budget_pdf && (
                    <a href={`${API_URL}${quote.budget_pdf}`} target="_blank" rel="noopener noreferrer"
                      className="ql-pdf-btn" onClick={(e) => e.stopPropagation()}>
                      <FiFileText size={13} />Ver PDF
                    </a>
                  )}
                </div>
                <div className="ql-budget-grid">
                  {quote.materials_subtotal && (
                    <div className="ql-budget-row"><span>Materiales</span><span>{formatCurrency(quote.materials_subtotal)}</span></div>
                  )}
                  {quote.labor_subtotal && (
                    <div className="ql-budget-row"><span>Mano de obra</span><span>{formatCurrency(quote.labor_subtotal)}</span></div>
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
                  <div className="ql-budget-row total"><span>Total</span><span>{formatCurrency(quote.quoted_amount)}</span></div>
                  {quote.deposit_amount && (
                    <div className="ql-budget-row deposit">
                      <span>Seña ({quote.deposit_percentage}%)</span>
                      <span>{formatCurrency(quote.deposit_amount)}</span>
                    </div>
                  )}
                </div>
                {quote.valid_until && (
                  <p className="ql-budget-validity"><FiClock size={12} />Válido hasta: {formatDate(quote.valid_until)}</p>
                )}
                {quote.estimated_completion_days && (
                  <p className="ql-budget-validity"><FiCalendar size={12} />Tiempo estimado: {quote.estimated_completion_days} días hábiles</p>
                )}
              </div>
            )}

            {quote.rejection_reason && (
              <div className="ql-detail-section">
                <div className="ql-detail-section-title"><FiAlertCircle size={14} /> Motivo de cancelación</div>
                <p className="ql-detail-notes ql-detail-notes--rejected">{quote.rejection_reason}</p>
              </div>
            )}

            {quote.status === 'QUOTED' && (
              <div className="ql-card-actions">
                <button type="button" className="ql-btn-accept" onClick={handleAccept} disabled={actionLoading}>
                  {actionLoading ? <><BtnSpinner />Procesando…</> : <><FiCheck size={16} />Aceptar presupuesto</>}
                </button>
                <button type="button" className="ql-btn-reject" onClick={handleReject} disabled={actionLoading}>
                  {actionLoading ? <><BtnSpinner />Procesando…</> : <><FiX size={16} />Rechazar</>}
                </button>
              </div>
            )}

            {showPayments && (
              <div className="ql-payments-section">
                <div className="ql-payments-title"><FiShield size={14} />Comprobantes de pago</div>
                <PaymentProofUploader quote={quote} paymentType="deposit" onUpload={onUploadProof} bankAccount={bankAccount} onApiError={onApiError} />
                {depositConfirmed && (
                  <PaymentProofUploader quote={quote} paymentType="final" onUpload={onUploadProof} bankAccount={bankAccount} onApiError={onApiError} />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

const QuotesList = ({ onNewQuote, onApiError }) => {
  const {
    quotes, loading, error,
    fetchQuotes, acceptQuote, rejectQuote, uploadPaymentProof, clearError,
  } = useQuotes();

  const { account: bankAccount } = useBankAccount();
  const { rateLimitError, handleApiError, clearRateLimitError } = useApiError();

  const bubbleError = (err) => {
    handleApiError(err);
    onApiError?.(err);
  };

  const handleAccept      = async (quoteId) => { try { await acceptQuote(quoteId); } catch (err) { bubbleError(err); } };
  const handleReject      = async (quoteId, reason) => { try { await rejectQuote(quoteId, reason); } catch (err) { bubbleError(err); } };
  const handleUploadProof = async (quoteId, file, paymentType) => { await uploadPaymentProof(quoteId, file, paymentType); };

  if (loading && quotes.length === 0) {
    return (
      <div className="ql-loading">
        <div className="ql-spinner" />
        <span>Cargando solicitudes…</span>
      </div>
    );
  }

  if (error && quotes.length === 0) {
    return (
      <div className="ql-error">
        <FiAlertCircle size={32} />
        <h3>Error al cargar solicitudes</h3>
        <p>{error}</p>
        <button className="ql-retry-btn" onClick={fetchQuotes}>
          <FiRefreshCw size={15} />Reintentar
        </button>
      </div>
    );
  }

  if (!loading && quotes.length === 0) {
    return (
      <div className="ql-empty">
        <div className="ql-empty-icon"><FiFileText size={40} /></div>
        <h3>Todavía no tenés solicitudes</h3>
        <p>Cuando solicites un presupuesto, aparecerá acá con su estado y seguimiento.</p>
        <button className="ql-empty-btn" onClick={onNewQuote} type="button">
          <FiPlusCircle size={16} />Solicitar mi primer presupuesto
        </button>
      </div>
    );
  }

  return (
    <>
      <RateLimitToast message={rateLimitError} onClose={clearRateLimitError} />

      <div className="quotes-list">
        <div className="ql-list-header">
          <div className="ql-list-title">
            <h2>{quotes.length} {quotes.length === 1 ? 'solicitud' : 'solicitudes'}</h2>
          </div>
          <button className="ql-new-btn" onClick={onNewQuote} type="button">
            <FiPlusCircle size={16} />Nueva solicitud
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
          {quotes.map((quote) => (
            <QuoteCard
              key={quote.id}
              quote={quote}
              onAccept={handleAccept}
              onReject={handleReject}
              onUploadProof={handleUploadProof}
              bankAccount={bankAccount}
              onApiError={bubbleError}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default QuotesList;