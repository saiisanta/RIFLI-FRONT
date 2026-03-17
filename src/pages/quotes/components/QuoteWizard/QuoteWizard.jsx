import React, { useState, useEffect, useCallback } from 'react';
import {
  FiChevronRight,
  FiChevronLeft,
  FiCheck,
  FiMapPin,
  FiFileText,
  FiGrid,
  FiAlertCircle,
  FiCheckCircle,
} from 'react-icons/fi';
import useServices from '../../../../hooks/useServices';
import useQuotes from '../../../../hooks/useQuotes';
import addressService from '../../../../services/addressService';
import './QuoteWizard.scss';

const API_URL = import.meta.env.VITE_API_URL;

const STEPS = [
  { id: 1, label: 'Servicio',  Icon: FiGrid },
  { id: 2, label: 'Dirección', Icon: FiMapPin },
  { id: 3, label: 'Detalles',  Icon: FiFileText },
];

// ── Dynamic field renderer ────────────────────────────────────

const DynamicField = ({ field, value, error, onChange }) => {
  const set = (val) => onChange(field.id, val);

  return (
    <div className={`qw-field-group ${error ? 'has-error' : ''}`}>
      <label className="qw-field-label">
        {field.label}
        {field.required && <span className="qw-field-required"> *</span>}
      </label>

      {field.comment && (
        <small className="qw-field-comment">{field.comment}</small>
      )}

      {field.type === 'text' && (
        <input
          type="text"
          className="qw-input"
          value={value ?? ''}
          onChange={e => set(e.target.value)}
          placeholder={field.placeholder || ''}
        />
      )}

      {field.type === 'number' && (
        <input
          type="number"
          className="qw-input"
          value={value ?? ''}
          onChange={e => set(e.target.value)}
          placeholder={field.placeholder || ''}
          min={field.min}
          max={field.max}
        />
      )}

      {field.type === 'textarea' && (
        <textarea
          className="qw-textarea"
          value={value ?? ''}
          onChange={e => set(e.target.value)}
          placeholder={field.placeholder || ''}
          maxLength={field.maxLength}
          rows={4}
        />
      )}

      {field.type === 'select' && (
        <select
          className="qw-select"
          value={value ?? ''}
          onChange={e => set(e.target.value)}
        >
          <option value="">{field.placeholder || 'Seleccioná una opción'}</option>
          {(field.options || []).map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )}

      {field.type === 'radio' && (
        <div className="qw-radio-group">
          {(field.options || []).map(opt => (
            <label key={opt} className={`qw-radio-option ${value === opt ? 'selected' : ''}`}>
              <input
                type="radio"
                name={field.id}
                value={opt}
                checked={value === opt}
                onChange={() => set(opt)}
              />
              <span className="qw-radio-mark" />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      )}

      {field.type === 'checkbox' && (
        <label className="qw-checkbox-label">
          <input
            type="checkbox"
            checked={value ?? false}
            onChange={e => set(e.target.checked)}
          />
          <span className="qw-checkbox-mark" />
          <span>{field.placeholder || 'Sí'}</span>
        </label>
      )}

      {error && (
        <span className="qw-field-error">
          <FiAlertCircle size={13} />
          {error}
        </span>
      )}
    </div>
  );
};

// ── Main Wizard ───────────────────────────────────────────────

const QuoteWizard = ({ onSuccess }) => {
  const [step, setStep] = useState(1);

  // Step 1
  const { services, loading: servicesLoading, fetchServices } = useServices();
  const [selectedService, setSelectedService] = useState(null);

  // Step 2
  const [addresses, setAddresses]         = useState([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Step 3
  const [formAnswers, setFormAnswers]   = useState({});
  const [clientNotes, setClientNotes]   = useState('');
  const [fieldErrors, setFieldErrors]   = useState({});

  // Submit
  const { createQuote, loading: submitLoading, error: submitError, clearError } = useQuotes();
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const loadAddresses = useCallback(async () => {
    setAddressLoading(true);
    try {
      const data = await addressService.getMyAddresses();
      setAddresses(Array.isArray(data) ? data : data.addresses || []);
    } catch {
      setAddresses([]);
    } finally {
      setAddressLoading(false);
    }
  }, []);

  // ── Handlers ─────────────────────────────────────────────

  const handleSelectService = (service) => {
    setSelectedService(service);
    setFormAnswers({});
    setFieldErrors({});
    clearError?.();
  };

  const handleGoStep2 = () => {
    if (!selectedService) return;
    loadAddresses();
    setStep(2);
  };

  const handleGoStep3 = () => {
    if (!selectedAddress) return;
    setStep(3);
  };

  const handleFieldChange = (fieldId, value) => {
    setFormAnswers(prev => ({ ...prev, [fieldId]: value }));
    if (fieldErrors[fieldId]) {
      setFieldErrors(prev => ({ ...prev, [fieldId]: null }));
    }
  };

  const validateStep3 = () => {
    const fields = selectedService?.form_schema?.fields || [];
    const errors = {};

    fields.forEach(field => {
      if (!field.required) return;
      const val = formAnswers[field.id];
      if (val === undefined || val === null || val === '') {
        errors[field.id] = 'Este campo es obligatorio';
      }
    });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;

    try {
      await createQuote({
        service_id: selectedService.id,
        address_id: selectedAddress.id,
        service_details: formAnswers,
        client_notes: clientNotes.trim() || null,
      });
      setSubmitSuccess(true);
      setTimeout(() => onSuccess(), 2500);
    } catch (err) {
      console.error('Error al crear cotización:', err);
    }
  };

  // ── Success screen ────────────────────────────────────────

  if (submitSuccess) {
    return (
      <div className="qw-success">
        <div className="qw-success-icon">
          <FiCheckCircle size={48} />
        </div>
        <h3>¡Solicitud enviada correctamente!</h3>
        <p>
          Tu solicitud fue recibida. Un técnico la revisará y te enviaremos el presupuesto
          a la brevedad.
        </p>
        <span className="qw-success-hint">Redirigiendo a tus solicitudes…</span>
      </div>
    );
  }

  const schemaFields = selectedService?.form_schema?.fields || [];

  // ── Render ────────────────────────────────────────────────

  return (
    <div className="quote-wizard">

      {/* Step indicator */}
      <div className="qw-steps">
        {STEPS.map((s, i) => (
          <React.Fragment key={s.id}>
            <div className={`qw-step ${step === s.id ? 'active' : step > s.id ? 'done' : ''}`}>
              <div className="qw-step-circle">
                {step > s.id ? <FiCheck size={15} /> : <s.Icon size={15} />}
              </div>
              <span className="qw-step-label">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`qw-step-connector ${step > s.id ? 'done' : ''}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ── STEP 1: Service ── */}
      {step === 1 && (
        <div className="qw-panel">
          <div className="qw-panel-header">
            <h2>¿Qué servicio necesitás?</h2>
            <p>Seleccioná el tipo de trabajo que querés presupuestar</p>
          </div>

          {servicesLoading ? (
            <div className="qw-inner-loading">
              <div className="qw-spinner" />
              <span>Cargando servicios…</span>
            </div>
          ) : services.length === 0 ? (
            <div className="qw-empty">
              <p>No hay servicios disponibles en este momento.</p>
            </div>
          ) : (
            <div className="qw-service-grid">
              {services.map(service => (
                <button
                  key={service.id}
                  type="button"
                  className={`qw-service-card ${selectedService?.id === service.id ? 'selected' : ''}`}
                  onClick={() => handleSelectService(service)}
                >
                  <div className="qw-service-icon-wrapper">
                    {service.icon ? (
                      <img
                        src={`${API_URL}${service.icon}`}
                        alt={service.type}
                        className="qw-service-icon"
                      />
                    ) : (
                      <span className="qw-service-icon-fallback">⚡</span>
                    )}
                  </div>
                  <div className="qw-service-info">
                    <h3>{service.type}</h3>
                    {service.short_description && (
                      <p>{service.short_description}</p>
                    )}
                    {(service.form_schema?.fields?.length ?? 0) > 0 && (
                      <span className="qw-service-fields-badge">
                        {service.form_schema.fields.length} preguntas
                      </span>
                    )}
                  </div>
                  <div className="qw-service-check">
                    <FiCheck size={16} />
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="qw-actions">
            <button
              type="button"
              className="qw-btn-primary"
              onClick={handleGoStep2}
              disabled={!selectedService}
            >
              Continuar
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Address ── */}
      {step === 2 && (
        <div className="qw-panel">
          <div className="qw-panel-header">
            <h2>¿Dónde realizamos el trabajo?</h2>
            <p>Seleccioná la dirección donde se llevará a cabo el servicio</p>
          </div>

          {addressLoading ? (
            <div className="qw-inner-loading">
              <div className="qw-spinner" />
              <span>Cargando direcciones…</span>
            </div>
          ) : addresses.length === 0 ? (
            <div className="qw-empty">
              <FiMapPin size={40} />
              <h3>No tenés direcciones guardadas</h3>
              <p>Necesitás agregar al menos una dirección desde tu perfil para continuar.</p>
              <a href="/perfil" className="qw-btn-secondary">
                Ir al perfil
              </a>
            </div>
          ) : (
            <div className="qw-address-list">
              {addresses.map(addr => (
                <button
                  key={addr.id}
                  type="button"
                  className={`qw-address-card ${selectedAddress?.id === addr.id ? 'selected' : ''}`}
                  onClick={() => setSelectedAddress(addr)}
                >
                  <div className="qw-address-main">
                    <div className="qw-address-alias-row">
                      <span className="qw-address-alias">{addr.alias}</span>
                      {addr.is_default && (
                        <span className="qw-address-default-badge">Principal</span>
                      )}
                    </div>
                    <p className="qw-address-street">
                      {addr.street} {addr.number}
                      {addr.floor && `, Piso ${addr.floor}`}
                      {addr.apartment && `, Depto ${addr.apartment}`}
                    </p>
                    <p className="qw-address-location">
                      {addr.city}, {addr.province} — CP {addr.postal_code}
                    </p>
                    {addr.additional_info && (
                      <p className="qw-address-extra">{addr.additional_info}</p>
                    )}
                  </div>
                  <div className="qw-service-check">
                    <FiCheck size={16} />
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="qw-actions">
            <button type="button" className="qw-btn-outline" onClick={() => setStep(1)}>
              <FiChevronLeft size={18} />
              Volver
            </button>
            <button
              type="button"
              className="qw-btn-primary"
              onClick={handleGoStep3}
              disabled={!selectedAddress || addresses.length === 0}
            >
              Continuar
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Details ── */}
      {step === 3 && (
        <div className="qw-panel">
          <div className="qw-panel-header">
            <h2>Detalles del proyecto</h2>
            <p>Esta información nos permite preparar un presupuesto exacto</p>
          </div>

          {/* Summary bar */}
          <div className="qw-summary">
            <div className="qw-summary-item">
              <span className="qw-summary-key">Servicio</span>
              <span className="qw-summary-val">{selectedService?.type}</span>
            </div>
            <div className="qw-summary-sep" />
            <div className="qw-summary-item">
              <span className="qw-summary-key">Dirección</span>
              <span className="qw-summary-val">
                {selectedAddress?.alias} — {selectedAddress?.street} {selectedAddress?.number}
              </span>
            </div>
          </div>

          {/* Dynamic schema fields */}
          {schemaFields.length > 0 && (
            <div className="qw-form-block">
              <div className="qw-form-block-title">
                <span>Información del proyecto</span>
              </div>
              {schemaFields.map(field => (
                <DynamicField
                  key={field.id}
                  field={field}
                  value={formAnswers[field.id]}
                  error={fieldErrors[field.id]}
                  onChange={handleFieldChange}
                />
              ))}
            </div>
          )}

          {/* Client notes */}
          <div className="qw-form-block">
            <div className="qw-form-block-title">
              <span>Notas adicionales</span>
              <span className="qw-optional-badge">Opcional</span>
            </div>
            <div className="qw-field-group">
              <label className="qw-field-label">¿Querés agregar algo más?</label>
              <small className="qw-field-comment">
                Urgencia, preferencias de horario, detalles especiales…
              </small>
              <textarea
                className="qw-textarea"
                value={clientNotes}
                onChange={e => setClientNotes(e.target.value)}
                placeholder="Ej: Necesito el trabajo con urgencia, prefiero que sea los fines de semana…"
                rows={4}
                maxLength={1000}
              />
              <span className="qw-char-count">{clientNotes.length} / 1000</span>
            </div>
          </div>

          {/* API error */}
          {submitError && (
            <div className="qw-error-banner">
              <FiAlertCircle size={18} />
              <span>
                {typeof submitError === 'string'
                  ? submitError
                  : submitError?.message || 'Error al enviar la solicitud'}
              </span>
            </div>
          )}

          <div className="qw-actions">
            <button type="button" className="qw-btn-outline" onClick={() => setStep(2)}>
              <FiChevronLeft size={18} />
              Volver
            </button>
            <button
              type="button"
              className="qw-btn-primary"
              onClick={handleSubmit}
              disabled={submitLoading}
            >
              {submitLoading ? (
                <>
                  <span className="qw-spinner qw-spinner--sm" />
                  Enviando…
                </>
              ) : (
                <>
                  Enviar solicitud
                  <FiCheck size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuoteWizard;