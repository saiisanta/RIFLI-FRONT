import React, { useState, useEffect, useCallback } from 'react';
import { X, Plus, Trash3, FileEarmarkPdf, Save, Eye } from 'react-bootstrap-icons';
import { pdf } from '@react-pdf/renderer';
import BudgetPdfDocument from './BudgetPdfDocument';
import './BudgetGeneratorModal.scss';

const API_URL = 'http://localhost:4001';

const newMaterial = () => ({
  id: `mat_${Date.now()}`,
  description: '',
  quantity: 1,
  unit: 'unidad',
  unit_price: 0,
  subtotal: 0,
  notes: '',
});

const newLabor = () => ({
  id: `labor_${Date.now()}`,
  description: '',
  hours: 1,
  hourly_rate: 0,
  subtotal: 0,
  technician: '',
});

const calcMaterial = (item) => ({
  ...item,
  subtotal: Number(item.quantity) * Number(item.unit_price),
});

const calcLabor = (item) => ({
  ...item,
  subtotal: Number(item.hours) * Number(item.hourly_rate),
});

const formatCurrency = (amount) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
  }).format(amount || 0);

const BudgetGeneratorModal = ({
  quote,
  onClose,
  onSaved,
  addBudget,
  uploadBudgetPdf,
  loading,
}) => {
  // ── Materials ─────────────────────────────────────────────
  const [materials, setMaterials] = useState([newMaterial()]);

  // ── Labor ─────────────────────────────────────────────────
  const [laborItems, setLaborItems] = useState([newLabor()]);

  // ── Totals config ─────────────────────────────────────────
  const [discountPct, setDiscountPct]   = useState(0);
  const [taxPct, setTaxPct]             = useState(21);
  const [validUntil, setValidUntil]     = useState('');
  const [completionDays, setCompletionDays] = useState('');
  const [internalNotes, setInternalNotes]   = useState('');

  // ── UI state ──────────────────────────────────────────────
  const [saving, setSaving]         = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError]           = useState(null);

  // ── Load existing budget on mount ─────────────────────────
  useEffect(() => {
    if (quote.materials_budget?.items?.length) {
      setMaterials(
        quote.materials_budget.items.map(i => ({
          ...i,
          quantity:   Number(i.quantity) || 0,
          unit_price: Number(i.unit_price) || 0,
          subtotal:   Number(i.subtotal) || 0,
        }))
      );
    }
    if (quote.labor_budget?.items?.length) {
      setLaborItems(
        quote.labor_budget.items.map(i => ({
          ...i,
          hours:       Number(i.hours) || 0,
          hourly_rate: Number(i.hourly_rate) || 0,
          subtotal:    Number(i.subtotal) || 0,
        }))
      );
    }
    if (quote.discount_percentage) setDiscountPct(Number(quote.discount_percentage));
    if (quote.tax_percentage)      setTaxPct(Number(quote.tax_percentage));
    if (quote.valid_until)         setValidUntil(quote.valid_until.slice(0, 10));
    if (quote.estimated_completion_days) setCompletionDays(String(quote.estimated_completion_days));
    if (quote.internal_notes)      setInternalNotes(quote.internal_notes);
  }, [quote]);

  // ── Live totals ───────────────────────────────────────────
  const materialsTotal = materials.reduce((s, i) => s + (Number(i.subtotal) || 0), 0);
  const laborTotal     = laborItems.reduce((s, i) => s + (Number(i.subtotal) || 0), 0);
  const subtotal       = materialsTotal + laborTotal;
  const discountAmt    = subtotal * (Number(discountPct) / 100);
  const taxableAmt     = subtotal - discountAmt;
  const taxAmt         = taxableAmt * (Number(taxPct) / 100);
  const total          = taxableAmt + taxAmt;
  const depositPct     = Number(quote.deposit_percentage) || 50;
  const depositAmt     = total * (depositPct / 100);
  const finalAmt       = total - depositAmt;

  // ── Material handlers ─────────────────────────────────────
  const updateMaterial = (index, field, value) => {
    setMaterials(prev => {
      const next = [...prev];
      next[index] = calcMaterial({ ...next[index], [field]: value });
      return next;
    });
  };

  const addMaterialRow    = () => setMaterials(prev => [...prev, newMaterial()]);
  const removeMaterialRow = (index) => {
    if (materials.length > 1) setMaterials(prev => prev.filter((_, i) => i !== index));
  };

  // ── Labor handlers ────────────────────────────────────────
  const updateLabor = (index, field, value) => {
    setLaborItems(prev => {
      const next = [...prev];
      next[index] = calcLabor({ ...next[index], [field]: value });
      return next;
    });
  };

  const addLaborRow    = () => setLaborItems(prev => [...prev, newLabor()]);
  const removeLaborRow = (index) => {
    if (laborItems.length > 1) setLaborItems(prev => prev.filter((_, i) => i !== index));
  };

  // ── Build payload ─────────────────────────────────────────
  const buildPayload = useCallback(() => ({
    materials_budget: {
      items: materials
        .filter(m => m.description.trim())
        .map(m => ({
          ...m,
          quantity:   Number(m.quantity),
          unit_price: Number(m.unit_price),
          subtotal:   Number(m.subtotal),
        })),
      total: materialsTotal,
    },
    labor_budget: {
      items: laborItems
        .filter(l => l.description.trim())
        .map(l => ({
          ...l,
          hours:       Number(l.hours),
          hourly_rate: Number(l.hourly_rate),
          subtotal:    Number(l.subtotal),
        })),
      total: laborTotal,
    },
    discount_percentage: Number(discountPct),
    tax_percentage:      Number(taxPct),
    valid_until:         validUntil || undefined,
    estimated_completion_days: completionDays ? Number(completionDays) : undefined,
    internal_notes:      internalNotes || undefined,
  }), [materials, laborItems, discountPct, taxPct, validUntil, completionDays, internalNotes, materialsTotal, laborTotal]);

  // ── Save budget (JSON only, no PDF yet) ───────────────────
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const updated = await addBudget(quote.id, buildPayload());
      onSaved(updated);
    } catch (err) {
      setError(err.message || 'Error al guardar el presupuesto');
    } finally {
      setSaving(false);
    }
  };

  // ── Generate PDF, upload and save ─────────────────────────
  const handleGeneratePdf = async () => {
    setGenerating(true);
    setError(null);
    try {
      // 1. Save budget data first
      const updated = await addBudget(quote.id, buildPayload());

      // 2. Generate PDF blob
      const pdfData = {
        quote: { ...updated, ...buildPayload() },
        totals: { materialsTotal, laborTotal, subtotal, discountAmt, taxAmt, total, depositPct, depositAmt, finalAmt },
        discountPct: Number(discountPct),
        taxPct: Number(taxPct),
      };

      const blob = await pdf(<BudgetPdfDocument data={pdfData} />).toBlob();

      // 3. Upload PDF to backend
      const pdfResult = await uploadBudgetPdf(updated.id || quote.id, blob);

      // 4. Close with real pdf path
      onSaved({ ...updated, budget_pdf: pdfResult.pdf_url });
    } catch (err) {
      setError(err.message || 'Error al generar el PDF');
    } finally {
      setGenerating(false);
    }
  };

  const isLoading = saving || generating || loading;

  return (
    <div className="bgm-overlay" onClick={onClose}>
      <div className="bgm-container" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="bgm-header">
          <div className="bgm-header-left">
            <h2>Generador de Presupuesto</h2>
            <span className="bgm-quote-ref">{quote.quote_number}</span>
          </div>
          <button className="bgm-close-btn" onClick={onClose} disabled={isLoading}>
            <X size={20} />
          </button>
        </div>

        <div className="bgm-body">

          {error && (
            <div className="bgm-error">
              {error}
              <button onClick={() => setError(null)}>✕</button>
            </div>
          )}

          {/* ── Client / service summary ── */}
          <div className="bgm-summary">
            <div className="bgm-summary-item">
              <span className="bgm-summary-key">Cliente</span>
              <span className="bgm-summary-val">
                {quote.client?.first_name} {quote.client?.last_name}
              </span>
            </div>
            <div className="bgm-summary-sep" />
            <div className="bgm-summary-item">
              <span className="bgm-summary-key">Servicio</span>
              <span className="bgm-summary-val">{quote.service?.type || quote.service_type}</span>
            </div>
            <div className="bgm-summary-sep" />
            <div className="bgm-summary-item">
              <span className="bgm-summary-key">Dirección</span>
              <span className="bgm-summary-val">
                {quote.address?.street} {quote.address?.number}, {quote.address?.city}
              </span>
            </div>
          </div>

          {/* ── Materials ── */}
          <div className="bgm-section">
            <div className="bgm-section-header">
              <span className="bgm-section-title">Materiales</span>
              <button className="bgm-add-row-btn" type="button" onClick={addMaterialRow}>
                <Plus size={14} />
                Agregar fila
              </button>
            </div>
            <div className="bgm-table-wrapper">
              <table className="bgm-table">
                <thead>
                  <tr>
                    <th className="col-desc">Descripción</th>
                    <th className="col-qty">Cant.</th>
                    <th className="col-unit">Unidad</th>
                    <th className="col-price">P. Unit.</th>
                    <th className="col-subtotal">Subtotal</th>
                    <th className="col-notes">Notas</th>
                    <th className="col-action"></th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map((item, idx) => (
                    <tr key={item.id}>
                      <td className="col-desc">
                        <input
                          className="bgm-input"
                          value={item.description}
                          onChange={e => updateMaterial(idx, 'description', e.target.value)}
                          placeholder="Ej: Cable 2.5mm x 100m"
                        />
                      </td>
                      <td className="col-qty">
                        <input
                          className="bgm-input bgm-input--num"
                          type="number"
                          min="0"
                          value={item.quantity}
                          onChange={e => updateMaterial(idx, 'quantity', e.target.value)}
                        />
                      </td>
                      <td className="col-unit">
                        <input
                          className="bgm-input"
                          value={item.unit}
                          onChange={e => updateMaterial(idx, 'unit', e.target.value)}
                          placeholder="unidad"
                        />
                      </td>
                      <td className="col-price">
                        <input
                          className="bgm-input bgm-input--num"
                          type="number"
                          min="0"
                          value={item.unit_price}
                          onChange={e => updateMaterial(idx, 'unit_price', e.target.value)}
                        />
                      </td>
                      <td className="col-subtotal">
                        <span className="bgm-subtotal">{formatCurrency(item.subtotal)}</span>
                      </td>
                      <td className="col-notes">
                        <input
                          className="bgm-input"
                          value={item.notes}
                          onChange={e => updateMaterial(idx, 'notes', e.target.value)}
                          placeholder="Opcional"
                        />
                      </td>
                      <td className="col-action">
                        <button
                          className="bgm-remove-row-btn"
                          type="button"
                          onClick={() => removeMaterialRow(idx)}
                          disabled={materials.length === 1}
                        >
                          <Trash3 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bgm-section-total">
              Total materiales: <strong>{formatCurrency(materialsTotal)}</strong>
            </div>
          </div>

          {/* ── Labor ── */}
          <div className="bgm-section">
            <div className="bgm-section-header">
              <span className="bgm-section-title">Mano de obra</span>
              <button className="bgm-add-row-btn" type="button" onClick={addLaborRow}>
                <Plus size={14} />
                Agregar fila
              </button>
            </div>
            <div className="bgm-table-wrapper">
              <table className="bgm-table">
                <thead>
                  <tr>
                    <th className="col-desc">Descripción</th>
                    <th className="col-qty">Horas</th>
                    <th className="col-price">$/hora</th>
                    <th className="col-subtotal">Subtotal</th>
                    <th className="col-notes">Técnico</th>
                    <th className="col-action"></th>
                  </tr>
                </thead>
                <tbody>
                  {laborItems.map((item, idx) => (
                    <tr key={item.id}>
                      <td className="col-desc">
                        <input
                          className="bgm-input"
                          value={item.description}
                          onChange={e => updateLabor(idx, 'description', e.target.value)}
                          placeholder="Ej: Instalación de cableado"
                        />
                      </td>
                      <td className="col-qty">
                        <input
                          className="bgm-input bgm-input--num"
                          type="number"
                          min="0"
                          value={item.hours}
                          onChange={e => updateLabor(idx, 'hours', e.target.value)}
                        />
                      </td>
                      <td className="col-price">
                        <input
                          className="bgm-input bgm-input--num"
                          type="number"
                          min="0"
                          value={item.hourly_rate}
                          onChange={e => updateLabor(idx, 'hourly_rate', e.target.value)}
                        />
                      </td>
                      <td className="col-subtotal">
                        <span className="bgm-subtotal">{formatCurrency(item.subtotal)}</span>
                      </td>
                      <td className="col-notes">
                        <input
                          className="bgm-input"
                          value={item.technician}
                          onChange={e => updateLabor(idx, 'technician', e.target.value)}
                          placeholder="Nombre"
                        />
                      </td>
                      <td className="col-action">
                        <button
                          className="bgm-remove-row-btn"
                          type="button"
                          onClick={() => removeLaborRow(idx)}
                          disabled={laborItems.length === 1}
                        >
                          <Trash3 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bgm-section-total">
              Total mano de obra: <strong>{formatCurrency(laborTotal)}</strong>
            </div>
          </div>

          {/* ── Config row ── */}
          <div className="bgm-config-row">
            <div className="bgm-config-group">
              <label>Descuento (%)</label>
              <input
                type="number"
                className="bgm-config-input"
                min="0"
                max="100"
                value={discountPct}
                onChange={e => setDiscountPct(e.target.value)}
              />
            </div>
            <div className="bgm-config-group">
              <label>IVA (%)</label>
              <input
                type="number"
                className="bgm-config-input"
                min="0"
                value={taxPct}
                onChange={e => setTaxPct(e.target.value)}
              />
            </div>
            <div className="bgm-config-group">
              <label>Válido hasta</label>
              <input
                type="date"
                className="bgm-config-input"
                value={validUntil}
                onChange={e => setValidUntil(e.target.value)}
              />
            </div>
            <div className="bgm-config-group">
              <label>Días estimados</label>
              <input
                type="number"
                className="bgm-config-input"
                min="1"
                placeholder="7"
                value={completionDays}
                onChange={e => setCompletionDays(e.target.value)}
              />
            </div>
          </div>

          <div className="bgm-config-group" style={{ marginTop: '-0.5rem' }}>
            <label>Notas internas</label>
            <textarea
              className="bgm-config-input"
              value={internalNotes}
              onChange={e => setInternalNotes(e.target.value)}
              placeholder="Solo visibles para el equipo..."
              rows={3}
            />
          </div>

          {/* ── Live totals panel ── */}
          <div className="bgm-totals">
            <div className="bgm-totals-title">Resumen</div>
            <div className="bgm-totals-grid">
              <div className="bgm-totals-row"><span>Materiales</span><span>{formatCurrency(materialsTotal)}</span></div>
              <div className="bgm-totals-row"><span>Mano de obra</span><span>{formatCurrency(laborTotal)}</span></div>
              <div className="bgm-totals-row"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
              {Number(discountPct) > 0 && (
                <div className="bgm-totals-row discount">
                  <span>Descuento ({discountPct}%)</span>
                  <span>— {formatCurrency(discountAmt)}</span>
                </div>
              )}
              <div className="bgm-totals-row"><span>IVA ({taxPct}%)</span><span>{formatCurrency(taxAmt)}</span></div>
              <div className="bgm-totals-row total">
                <span>TOTAL</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="bgm-totals-row deposit">
                <span>Seña ({depositPct}%)</span>
                <span>{formatCurrency(depositAmt)}</span>
              </div>
              <div className="bgm-totals-row">
                <span>Pago final ({100 - depositPct}%)</span>
                <span>{formatCurrency(finalAmt)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bgm-footer">
          <button className="bgm-btn-cancel" onClick={onClose} disabled={isLoading}>
            Cancelar
          </button>
          <div className="bgm-footer-right">
            <button
              className="bgm-btn-save"
              onClick={handleSave}
              disabled={isLoading}
            >
              {saving ? (
                <><span className="bgm-spinner" /> Guardando...</>
              ) : (
                <><Save size={15} /> Guardar borrador</>
              )}
            </button>
            <button
              className="bgm-btn-pdf"
              onClick={handleGeneratePdf}
              disabled={isLoading}
            >
              {generating ? (
                <><span className="bgm-spinner" /> Generando PDF...</>
              ) : (
                <><FileEarmarkPdf size={15} /> Guardar y generar PDF</>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BudgetGeneratorModal;