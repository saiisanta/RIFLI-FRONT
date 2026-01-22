import React from 'react';
import { Plus, X, ChevronDown, ChevronUp, Image } from 'react-bootstrap-icons';
import './CategoryForm.scss';

const CategoryForm = ({
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
    <section className={`category-form-section ${formOpen ? 'expanded' : 'collapsed'}`}>
      <div className="category-form-header">
        <h2>
          <Plus size={24} />
          {editId ? "Editar categoría" : "Agregar nueva categoría"}
        </h2>
        <div className="category-form-header-buttons">
          {editId && (
            <button className="category-form-btn-cancel" onClick={onCancel}>
              <X size={20} />
              Cancelar
            </button>
          )}
          <button 
            className="category-form-btn-toggle"
            onClick={onToggleForm}
            title={formOpen ? "Ocultar formulario" : "Mostrar formulario"}
          >
            {formOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      <div className="category-form-content">
        {errorMsg && (
          <div className="category-form-alert">
            {errorMsg}
            <button onClick={onErrorClose}><X size={16} /></button>
          </div>
        )}

        <form onSubmit={onSubmit} className="category-form">
          <div className="category-form-row">
            <div className="category-form-group">
              <label>Nombre de la categoría *</label>
              <input 
                name="name" 
                value={form.name} 
                onChange={onFormChange} 
                placeholder="Ej: Cámaras de Seguridad"
                required 
              />
            </div>
          </div>

          <div className="category-form-group category-form-full-width">
            <label>Descripción</label>
            <textarea 
              name="description" 
              value={form.description} 
              onChange={onFormChange}
              placeholder="Descripción de la categoría..."
              rows="4"
            />
          </div>

          <div className="category-form-section-title">
            <h3>Ícono de la Categoría</h3>
            <small>Imagen que representará la categoría</small>
          </div>

          <div className="images-container">
            {imagePreview && (
              <div className="image-preview-single">
                <div className="image-preview-item">
                  <img src={imagePreview} alt="Preview del ícono" />
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

            <div className="category-form-file-wrapper">
              <input 
                type="file" 
                name="icon" 
                accept="image/*" 
                onChange={onFormChange}
                id="category-icon-input"
              />
              <label htmlFor="category-icon-input" className="category-form-file-label">
                <Image size={24} />
                <span>Seleccionar ícono</span>
                <small>Formatos: JPG, PNG, SVG (máx. 2MB)</small>
              </label>
            </div>
          </div>

          <button type="submit" className="category-form-btn-primary" disabled={loading}>
            <Plus size={20} />
            {loading ? 'Guardando...' : (editId ? "Guardar cambios" : "Agregar categoría")}
          </button>
        </form>
      </div>
    </section>
  );
};

export default CategoryForm;