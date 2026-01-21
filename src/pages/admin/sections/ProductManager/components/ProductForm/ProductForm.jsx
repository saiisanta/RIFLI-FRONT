import React, { useState, useEffect } from 'react';
import { Plus, X, ChevronDown, ChevronUp, Trash3, Image } from 'react-bootstrap-icons';
import './ProductForm.scss';

const ProductForm = ({
  form,
  editId,
  formOpen,
  errorMsg,
  loading,
  categories = [],
  brands = [],
  onFormChange,
  onSubmit,
  onCancel,
  onToggleForm,
  onErrorClose
}) => {
  const [specifications, setSpecifications] = useState([{ key: '', value: '' }]);
  
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  useEffect(() => {
    if (form.specifications) {
      try {
        const parsed = JSON.parse(form.specifications);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const specsArray = parsed.map(spec => {
            const key = Object.keys(spec)[0];
            return { key, value: spec[key] };
          });
          setSpecifications(specsArray);
        }
      } catch (err) {
        console.error('Error parsing specifications:', err);
      }
    } else {
      setSpecifications([{ key: '', value: '' }]);
    }
  }, [form.specifications, editId]);

  const handleAddSpec = () => {
    setSpecifications([...specifications, { key: '', value: '' }]);
  };

  const handleRemoveSpec = (index) => {
    if (specifications.length > 1) {
      const newSpecs = specifications.filter((_, i) => i !== index);
      setSpecifications(newSpecs);
    }
  };

  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = value;
    setSpecifications(newSpecs);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImages([...images, ...files]);
      
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews([...imagePreviews, ...newPreviews]);
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    URL.revokeObjectURL(imagePreviews[index]);
    
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, []);

  useEffect(() => {
    if (!editId && form.name === '') {
      setImages([]);
      setImagePreviews([]);
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    }
  }, [editId, form.name]);

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    
    const specsArray = specifications
      .filter(spec => spec.key.trim() !== '')
      .map(spec => ({ [spec.key]: spec.value }));
    
    const customEvent = {
      preventDefault: () => {},
      specifications: specsArray.length > 0 ? JSON.stringify(specsArray) : '',
      images: images
    };
    
    onSubmit(customEvent);
  };

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

        <form onSubmit={handleCustomSubmit} className="product-form">
          <div className="product-form-section-title">
            <h3>Información Básica</h3>
          </div>

          <div className="product-form-row">
            <div className="product-form-group">
              <label>Nombre del producto *</label>
              <input 
                name="name" 
                value={form.name} 
                onChange={onFormChange} 
                placeholder="Ej: Cámara IP Domo 2MP"
                required 
              />
            </div>

            <div className="product-form-group">
              <label>SKU (Código único)</label>
              <input 
                name="sku" 
                value={form.sku} 
                onChange={onFormChange}
                placeholder="Ej: CAM-DOMO-001" 
              />
            </div>
          </div>

          <div className="product-form-group product-form-full-width">
            <label>Descripción corta</label>
            <input 
              name="short_description" 
              value={form.short_description} 
              onChange={onFormChange}
              placeholder="Breve descripción (máx 500 caracteres)"
              maxLength={500}
            />
          </div>

          <div className="product-form-group product-form-full-width">
            <label>Descripción detallada</label>
            <textarea 
              name="long_description" 
              value={form.long_description} 
              onChange={onFormChange}
              placeholder="Descripción completa del producto..."
              rows="4"
            />
          </div>

          {/* Categorización */}
          <div className="product-form-section-title">
            <h3>Categorización</h3>
          </div>

          <div className="product-form-row">
            <div className="product-form-group">
              <label>Categoría *</label>
              <select 
                name="category_id" 
                value={form.category_id} 
                onChange={onFormChange}
                required 
              >
                <option value="">Seleccionar categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="product-form-group">
              <label>Marca *</label>
              <select 
                name="brand_id" 
                value={form.brand_id} 
                onChange={onFormChange}
                required 
              >
                <option value="">Seleccionar marca</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="product-form-section-title">
            <h3>Precio y Stock</h3>
          </div>

          <div className="product-form-row">
            <div className="product-form-group">
              <label>Precio (ARS) *</label>
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
              <label>Descuento (%)</label>
              <input 
                type="number" 
                name="discount_percentage" 
                value={form.discount_percentage} 
                onChange={onFormChange}
                placeholder="0"
                min="0"
                max="100"
                step="0.01"
              />
            </div>

            <div className="product-form-group">
              <label>Stock disponible *</label>
              <input 
                type="number" 
                name="stock" 
                value={form.stock} 
                onChange={onFormChange}
                placeholder="0"
                min="0"
                required 
              />
            </div>

            <div className="product-form-group">
              <label>Stock mínimo</label>
              <input 
                type="number" 
                name="min_stock" 
                value={form.min_stock} 
                onChange={onFormChange}
                placeholder="5"
                min="0"
              />
            </div>
          </div>

          <div className="product-form-section-title">
            <h3>Especificaciones Técnicas</h3>
          </div>

          <div className="specifications-container">
            {specifications.map((spec, index) => (
              <div key={index} className="specification-row">
                <div className="spec-input-group">
                  <input 
                    type="text"
                    placeholder="Propiedad (ej: lumenes, color, resolución)"
                    value={spec.key}
                    onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                  />
                </div>
                <div className="spec-input-group">
                  <input 
                    type="text"
                    placeholder="Valor (ej: 9000, Frío, 1080p)"
                    value={spec.value}
                    onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                  />
                </div>
                <button 
                  type="button"
                  className="btn-remove-spec"
                  onClick={() => handleRemoveSpec(index)}
                  disabled={specifications.length === 1}
                  title="Eliminar especificación"
                >
                  <Trash3 size={16} />
                </button>
              </div>
            ))}
            
            <button 
              type="button"
              className="btn-add-spec"
              onClick={handleAddSpec}
            >
              <Plus size={18} />
              Agregar especificación
            </button>
          </div>

          <div className="product-form-section-title">
            <h3>Imágenes del Producto</h3>
            <small>La primera imagen será la imagen principal</small>
          </div>

          <div className="images-container">
            {imagePreviews.length > 0 && (
              <div className="image-previews">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="image-preview-item">
                    {index === 0 && <span className="main-image-badge">Principal</span>}
                    <img src={preview} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      className="btn-remove-image"
                      onClick={() => handleRemoveImage(index)}
                      title="Eliminar imagen"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="product-form-file-wrapper">
              <input 
                type="file" 
                name="product_images" 
                accept="image/*" 
                onChange={handleImageChange}
                id="product-file-input"
                multiple
              />
              <label htmlFor="product-file-input" className="product-form-file-label">
                <Image size={24} />
                <span>Seleccionar imágenes</span>
                <small>Puedes seleccionar múltiples imágenes</small>
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