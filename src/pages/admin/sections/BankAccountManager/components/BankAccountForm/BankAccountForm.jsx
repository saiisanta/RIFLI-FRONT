import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, X, Bank2 } from 'react-bootstrap-icons';
import './BankAccountForm.scss';

const ACCOUNT_TYPES = [
  { value: 'SAVINGS', label: 'Caja de ahorro' },
  { value: 'CHECKING', label: 'Cuenta corriente' },
];

const defaultForm = {
  bank_name: '',
  account_type: 'SAVINGS',
  account_number: '',
  cbu: '',
  alias: '',
  holder_name: '',
  holder_document: '',
  holder_cuit: '',
};

const BankAccountForm = ({ account, loading, errorMsg, onSubmit, onErrorClose }) => {
  const [form, setForm] = useState(defaultForm);
  const [formOpen, setFormOpen] = useState(true);

  useEffect(() => {
    if (account) {
      setForm({
        bank_name: account.bank_name || '',
        account_type: account.account_type || 'SAVINGS',
        account_number: account.account_number || '',
        cbu: account.cbu || '',
        alias: account.alias || '',
        holder_name: account.holder_name || '',
        holder_document: account.holder_document || '',
        holder_cuit: account.holder_cuit || '',
      });
    } else {
      setForm(defaultForm);
    }
  }, [account]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, alias: form.alias || undefined };
    await onSubmit(payload);
  };

  return (
    <section className={`ba-form-section ${formOpen ? 'expanded' : 'collapsed'}`}>
      <div className="ba-form-header">
        <h2>
          <Bank2 size={20} />
          {account ? 'Editar cuenta bancaria' : 'Registrar cuenta bancaria'}
        </h2>
        <button
          type="button"
          className="ba-form-btn-toggle"
          onClick={() => setFormOpen(!formOpen)}
          aria-label="Expandir/colapsar formulario"
        >
          {formOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      <div className="ba-form-content">
        {errorMsg && (
          <div className="ba-form-alert">
            <span>{typeof errorMsg === 'string' ? errorMsg : errorMsg?.error || 'Error al guardar'}</span>
            <button type="button" onClick={onErrorClose} aria-label="Cerrar error">
              <X size={16} />
            </button>
          </div>
        )}

        <form className="ba-form" onSubmit={handleSubmit}>
          <div className="ba-form-section-title">
            <h3>Datos del banco</h3>
          </div>

          <div className="ba-form-row">
            <div className="ba-form-group">
              <label>Nombre del banco *</label>
              <input
                type="text"
                name="bank_name"
                value={form.bank_name}
                onChange={handleChange}
                placeholder="Ej: Banco Galicia"
                required
              />
            </div>
            <div className="ba-form-group">
              <label>Tipo de cuenta *</label>
              <select name="account_type" value={form.account_type} onChange={handleChange} required>
                {ACCOUNT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div className="ba-form-group">
              <label>Número de cuenta *</label>
              <input
                type="text"
                name="account_number"
                value={form.account_number}
                onChange={handleChange}
                placeholder="Ej: 0000123456789"
                required
              />
            </div>
          </div>

          <div className="ba-form-section-title">
            <h3>Datos de transferencia</h3>
          </div>

          <div className="ba-form-row">
            <div className="ba-form-group">
              <label>CBU *</label>
              <input
                type="text"
                name="cbu"
                value={form.cbu}
                onChange={handleChange}
                placeholder="22 dígitos"
                maxLength={22}
                required
              />
              <small className="ba-form-hint">Exactamente 22 dígitos numéricos</small>
            </div>
            <div className="ba-form-group">
              <label>Alias <span className="ba-optional">(opcional)</span></label>
              <input
                type="text"
                name="alias"
                value={form.alias}
                onChange={handleChange}
                placeholder="Ej: empresa.pagos"
                maxLength={50}
              />
            </div>
          </div>

          <div className="ba-form-section-title">
            <h3>Datos del titular</h3>
          </div>

          <div className="ba-form-row">
            <div className="ba-form-group">
              <label>Nombre del titular *</label>
              <input
                type="text"
                name="holder_name"
                value={form.holder_name}
                onChange={handleChange}
                placeholder="Ej: Empresa S.A."
                required
              />
            </div>
            <div className="ba-form-group">
              <label>DNI / Documento *</label>
              <input
                type="text"
                name="holder_document"
                value={form.holder_document}
                onChange={handleChange}
                placeholder="Ej: 20123456"
                required
              />
            </div>
            <div className="ba-form-group">
              <label>CUIT *</label>
              <input
                type="text"
                name="holder_cuit"
                value={form.holder_cuit}
                onChange={handleChange}
                placeholder="11 dígitos sin guiones"
                maxLength={11}
                required
              />
              <small className="ba-form-hint">Exactamente 11 dígitos sin guiones</small>
            </div>
          </div>

          <button type="submit" className="ba-form-btn-primary" disabled={loading}>
            {loading ? 'Guardando...' : account ? 'Guardar cambios' : 'Registrar cuenta'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default BankAccountForm;