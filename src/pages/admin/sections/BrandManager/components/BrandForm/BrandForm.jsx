import React from 'react';
import { Plus, X, ChevronDown, ChevronUp, Image } from 'react-bootstrap-icons';
import './BrandForm.scss';

const BrandForm = ({
  form,
  editId,
  formOpen,
  errorMsg,
  loading,
  imagePreview,
  onFormChange,
  onSubmit,
  onCancel,
  onRemoveImage,
  onToggleForm,
  onErrorClose
}) => {
  return (
    <section className={`brand-form-section ${formOpen ? 'expanded' : 'collapsed'}`}>
      <div className="brand-form-header">
        <h2>
          <Plus size={24} />
          {editId ? "Editar marca" : "Agregar nueva marca"}
        </h2>
        <div className="brand-form-header-buttons">
          {editId && (
            <button className="brand-form-btn-cancel" onClick={onCancel}>
              <X size={20} />
              Cancelar
            </button>
          )}
          <button 
            className="brand-form-btn-toggle"
            onClick={onToggleForm}
            title={formOpen ? "Ocultar formulario" : "Mostrar formulario"}
          >
            {formOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      <div className="brand-form-content">
        {errorMsg && (
          <div className="brand-form-alert">
            {errorMsg}
            <button onClick={onErrorClose}><X size={16} /></button>
          </div>
        )}

        <form onSubmit={onSubmit} className="brand-form">
          <div className="brand-form-row">
            <div className="brand-form-group">
              <label>Nombre de la marca *</label>
              <input 
                name="name" 
                value={form.name} 
                onChange={onFormChange} 
                placeholder="Ej: Hikvision, Dahua, TP-Link"
                required 
              />
            </div>
          </div>

          <div className="brand-form-section-title">
            <h3>Logo de la Marca</h3>
            <small>Imagen que representará la marca</small>
          </div>

          <div className="images-container">
            {imagePreview && (
              <div className="image-preview-single">
                <div className="image-preview-item">
                  <img src={imagePreview} alt="Preview del logo" />
                  <button
                    type="button"
                    className="btn-remove-image"
                    onClick={onRemoveImage}
                    title="Eliminar imagen"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            )}

            <div className="brand-form-file-wrapper">
              <input 
                type="file" 
                name="logo_url" 
                accept="image/*" 
                onChange={onFormChange}
                id="brand-logo-input"
              />
              <label htmlFor="brand-logo-input" className="brand-form-file-label">
                <Image size={24} />
                <span>Seleccionar logo</span>
                <small>Formatos: JPG, PNG, SVG (máx. 2MB)</small>
              </label>
            </div>
          </div>

          <button type="submit" className="brand-form-btn-primary" disabled={loading}>
            <Plus size={20} />
            {loading ? 'Guardando...' : (editId ? "Guardar cambios" : "Agregar marca")}
          </button>
        </form>
      </div>
    </section>
  );
};

export default BrandForm;