import React from 'react';
import { Plus, X, ChevronDown, ChevronUp } from 'react-bootstrap-icons';
import './ProductForm.scss';

const ProductForm = ({
  form,
  editId,
  formOpen,
  errorMsg,
  loading,
  onFormChange,
  onSubmit,
  onCancel,
  onToggleForm,
  onErrorClose
}) => {
  return (
    <section className={`product-form-section ${formOpen ? 'expanded' : 'collapsed'}`}>
      <div className="product-form-header">
        <h2>
          <Plus size={24} />
          {editId ? "Editar producto" : "Agregar nuevo producto"}
        </h2>
        <div className="product-form-header-buttons">
          {editId && (
            <button className="product-form-btn-cancel" onClick={onCancel}>
              <X size={20} />
              Cancelar
            </button>
          )}
          <button 
            className="product-form-btn-toggle"
            onClick={onToggleForm}
            title={formOpen ? "Ocultar formulario" : "Mostrar formulario"}
          >
            {formOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      <div className="product-form-content">
        {errorMsg && (
          <div className="product-form-alert">
            {errorMsg}
            <button onClick={onErrorClose}><X size={16} /></button>
          </div>
        )}

        <form onSubmit={onSubmit} className="product-form">
          <div className="product-form-row">
            <div className="product-form-group">
              <label>Nombre del producto</label>
              <input 
                name="name" 
                value={form.name} 
                onChange={onFormChange} 
                placeholder="Ej: Laptop HP"
                required 
              />
            </div>

            <div className="product-form-group">
              <label>Marca</label>
              <input 
                name="marca" 
                value={form.marca} 
                onChange={onFormChange}
                placeholder="Ej: HP" 
                required 
              />
            </div>
          </div>

          <div className="product-form-group product-form-full-width">
            <label>Descripción</label>
            <textarea 
              name="description" 
              value={form.description} 
              onChange={onFormChange}
              placeholder="Describe las características del producto..."
              rows="4"
              required 
            />
          </div>

          <div className="product-form-row">
            <div className="product-form-group">
              <label>Precio (ARS)</label>
              <input 
                type="number" 
                name="price" 
                value={form.price} 
                onChange={onFormChange}
                placeholder="0.00"
                step="0.01"
                required 
              />
            </div>

            <div className="product-form-group">
              <label>Categoría</label>
              <input 
                name="categoria" 
                value={form.categoria} 
                onChange={onFormChange}
                placeholder="Ej: Electrónica"
                required 
              />
            </div>

            <div className="product-form-group">
              <label>Stock disponible</label>
              <input 
                type="number" 
                name="stock" 
                value={form.stock} 
                onChange={onFormChange}
                placeholder="0"
                required 
              />
            </div>
          </div>

          <div className="product-form-group product-form-full-width">
            <label>Imagen del producto</label>
            <div className="product-form-file-wrapper">
              <input 
                type="file" 
                name="image" 
                accept="image/*" 
                onChange={onFormChange}
                id="product-file-input"
              />
              <label htmlFor="product-file-input" className="product-form-file-label">
                {form.image ? form.image.name : "Seleccionar imagen..."}
              </label>
            </div>
          </div>

          <button type="submit" className="product-form-btn-primary" disabled={loading}>
            <Plus size={20} />
            {loading ? 'Guardando...' : (editId ? "Guardar cambios" : "Agregar producto")}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ProductForm;