import React, { useState, useEffect } from 'react';
import { Plus, X, ChevronDown, ChevronUp, Trash3, Image } from 'react-bootstrap-icons';
import './ServicesForm.scss';

const API_URL = import.meta.env.VITE_API_URL;

const SERVICE_TYPES = ['ELECTRICITY', 'SECURITY', 'GAS'];
const FIELD_TYPES = ['text', 'number', 'select', 'radio', 'checkbox', 'textarea'];

const TYPE_LABELS = {
  ELECTRICITY: 'Electricidad',
  SECURITY: 'Seguridad',
  GAS: 'Gas',
};

const defaultField = () => ({
  id: '',
  type: 'text',
  label: '',
  comment: '',
  required: false,
  placeholder: '',
  options: [],
  min: '',
  max: '',
  maxLength: '',
});

const ServicesForm = ({
  form,
  editId,
  currentService,
  formOpen,
  errorMsg,
  loading,
  onFormChange,
  onSubmit,
  onCancel,
  onToggleForm,
  onErrorClose,
}) => {
  // ── Features ──────────────────────────────────────────────
  const [features, setFeatures] = useState(['']);

  // ── Icon ──────────────────────────────────────────────────
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [existingIcon, setExistingIcon] = useState(null);

  // ── Images ────────────────────────────────────────────────
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);

  // ── Form Scheme ───────────────────────────────────────────
  const [schemeFields, setSchemeFields] = useState([]);

  // ── Sync on edit ──────────────────────────────────────────
  useEffect(() => {
    if (editId && currentService) {
      // Features
      const f = currentService.features;
      setFeatures(
        Array.isArray(f) && f.length > 0 ? f : ['']
      );

      // Icon
      setExistingIcon(currentService.icon || null);
      setIconFile(null);
      setIconPreview(null);

      // Images
      setExistingImages(currentService.images || []);
      setImagesToRemove([]);

      // Form scheme
      const scheme = currentService.form_schema || currentService.form_scheme;
      if (scheme && Array.isArray(scheme.fields) && scheme.fields.length > 0) {
        setSchemeFields(
          scheme.fields.map((field) => ({
            id: field.id || '',
            type: field.type || 'text',
            label: field.label || '',
            comment: field.comment || '',
            required: field.required || false,
            placeholder: field.placeholder || '',
            options: field.options || [],
            min: field.min !== undefined ? String(field.min) : '',
            max: field.max !== undefined ? String(field.max) : '',
            maxLength: field.maxLength !== undefined ? String(field.maxLength) : '',
          }))
        );
      } else {
        setSchemeFields([]);
      }
    } else {
      setFeatures(['']);
      setExistingIcon(null);
      setIconFile(null);
      setIconPreview(null);
      setExistingImages([]);
      setImagesToRemove([]);
      setSchemeFields([]);
    }
  }, [editId, currentService]);

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((p) => URL.revokeObjectURL(p));
      if (iconPreview) URL.revokeObjectURL(iconPreview);
    };
  }, []);

  // Reset new images/icon when form is cleared
  useEffect(() => {
    if (!editId && form.type === '') {
      setImages([]);
      setImagePreviews([]);
      setIconFile(null);
      if (iconPreview) URL.revokeObjectURL(iconPreview);
      setIconPreview(null);
      imagePreviews.forEach((p) => URL.revokeObjectURL(p));
    }
  }, [editId, form.type]);

  // ── Features handlers ─────────────────────────────────────
  const handleFeatureChange = (index, value) => {
    const next = [...features];
    next[index] = value;
    setFeatures(next);
  };

  const handleAddFeature = () => setFeatures([...features, '']);

  const handleRemoveFeature = (index) => {
    if (features.length > 1) {
      setFeatures(features.filter((_, i) => i !== index));
    }
  };

  // ── Icon handlers ─────────────────────────────────────────
  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (iconPreview) URL.revokeObjectURL(iconPreview);
    setIconFile(file);
    setIconPreview(URL.createObjectURL(file));
  };

  const handleRemoveIconFile = () => {
    if (iconPreview) URL.revokeObjectURL(iconPreview);
    setIconFile(null);
    setIconPreview(null);
  };

  const handleRemoveExistingIcon = () => {
    setExistingIcon(null);
  };

  // ── Image handlers ────────────────────────────────────────
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImages([...images, ...files]);
      setImagePreviews([...imagePreviews, ...files.map((f) => URL.createObjectURL(f))]);
    }
  };

  const handleRemoveImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleToggleRemoveExistingImage = (imgPath) => {
    if (imagesToRemove.includes(imgPath)) {
      setImagesToRemove(imagesToRemove.filter((img) => img !== imgPath));
    } else {
      setImagesToRemove([...imagesToRemove, imgPath]);
    }
  };

  // ── Form scheme handlers ──────────────────────────────────
  const handleAddSchemeField = () => setSchemeFields([...schemeFields, defaultField()]);

  const handleRemoveSchemeField = (index) => {
    setSchemeFields(schemeFields.filter((_, i) => i !== index));
  };

  const handleSchemeFieldChange = (index, key, value) => {
    const next = [...schemeFields];
    next[index] = { ...next[index], [key]: value };
    setSchemeFields(next);
  };

  const handleAddOption = (fieldIndex) => {
    const next = [...schemeFields];
    next[fieldIndex].options = [...(next[fieldIndex].options || []), ''];
    setSchemeFields(next);
  };

  const handleOptionChange = (fieldIndex, optionIndex, value) => {
    const next = [...schemeFields];
    next[fieldIndex].options[optionIndex] = value;
    setSchemeFields(next);
  };

  const handleRemoveOption = (fieldIndex, optionIndex) => {
    const next = [...schemeFields];
    next[fieldIndex].options = next[fieldIndex].options.filter((_, i) => i !== optionIndex);
    setSchemeFields(next);
  };

  // ── Submit ────────────────────────────────────────────────
  const handleCustomSubmit = (e) => {
    e.preventDefault();

    const cleanFeatures = features.filter((f) => f.trim() !== '');

    const cleanFields = schemeFields
      .filter((f) => f.label.trim() !== '' && f.id.trim() !== '')
      .map((f) => {
        const field = {
          id: f.id.trim(),
          type: f.type,
          label: f.label.trim(),
        };
        if (f.comment.trim()) field.comment = f.comment.trim();
        if (f.required) field.required = true;
        if (['text', 'number', 'select', 'textarea'].includes(f.type) && f.placeholder.trim()) {
          field.placeholder = f.placeholder.trim();
        }
        if (['select', 'radio'].includes(f.type)) {
          field.options = f.options.filter((o) => o.trim() !== '');
        }
        if (f.type === 'number') {
          if (f.min !== '') field.min = Number(f.min);
          if (f.max !== '') field.max = Number(f.max);
          if (f.required) {
            field.validation = { required: true };
          }
        }
        if (f.type === 'textarea' && f.maxLength !== '') {
          field.maxLength = Number(f.maxLength);
        }
        return field;
      });

    const customEvent = {
      preventDefault: () => {},
      features: cleanFeatures,
      form_schema: { fields: cleanFields },
      icon: iconFile,
      remove_icon: !existingIcon && !iconFile ? true : false,
      images,
      remove_images: imagesToRemove,
    };

    onSubmit(customEvent);
  };

  return (
    <section className={`service-form-section ${formOpen ? 'expanded' : 'collapsed'}`}>
      <div className="service-form-header">
        <h2>
          <Plus size={24} />
          {editId ? 'Editar servicio' : 'Agregar nuevo servicio'}
        </h2>
        <div className="service-form-header-buttons">
          {editId && (
            <button className="service-form-btn-cancel" onClick={onCancel}>
              <X size={20} />
              Cancelar
            </button>
          )}
          <button
            className="service-form-btn-toggle"
            onClick={onToggleForm}
            title={formOpen ? 'Ocultar formulario' : 'Mostrar formulario'}
          >
            {formOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      <div className="service-form-content">
        {errorMsg && (
          <div className="service-form-alert">
            {errorMsg}
            <button onClick={onErrorClose}>
              <X size={16} />
            </button>
          </div>
        )}

        <form onSubmit={handleCustomSubmit} className="service-form">
          {/* ── Información Básica ── */}
          <div className="service-form-section-title">
            <h3>Información Básica</h3>
          </div>

          <div className="service-form-row">
            <div className="service-form-group">
              <label>Tipo de servicio *</label>
              <input
                name="type"
                value={form.type}
                onChange={onFormChange}
                placeholder="Ej: Electricidad, Gas, Seguridad, Plomería…"
                required
              />
            </div>
          </div>

          <div className="service-form-section-title">
            <h3>Icono del servicio</h3>
            <small>Se mostrará como imagen representativa del servicio en la plataforma</small>
          </div>

          <div className="service-icon-upload-container">
            {/* Icono existente (modo edición) */}
            {existingIcon && !iconPreview && (
              <div className="service-icon-preview-wrapper">
                <div className="service-icon-preview-item">
                  <img
                    src={`${API_URL}${existingIcon}`}
                    alt="Icono actual"
                  />
                  <button
                    type="button"
                    className="btn-remove-icon"
                    onClick={handleRemoveExistingIcon}
                    title="Quitar icono actual"
                  >
                    <X size={16} />
                  </button>
                </div>
                <span className="service-icon-current-label">Icono actual — subí uno nuevo para reemplazarlo</span>
              </div>
            )}

            {/* Preview del nuevo icono seleccionado */}
            {iconPreview && (
              <div className="service-icon-preview-wrapper">
                <div className="service-icon-preview-item new">
                  <img src={iconPreview} alt="Nuevo icono" />
                  <button
                    type="button"
                    className="btn-remove-icon"
                    onClick={handleRemoveIconFile}
                    title="Quitar icono seleccionado"
                  >
                    <X size={16} />
                  </button>
                </div>
                <span className="service-icon-current-label">Nuevo icono seleccionado</span>
              </div>
            )}

            {/* Input file — siempre visible si no hay preview nuevo */}
            {!iconPreview && (
              <div className="service-form-file-wrapper service-form-file-wrapper--icon">
                <input
                  type="file"
                  name="service_icon"
                  accept="image/*"
                  onChange={handleIconChange}
                  id="service-icon-input"
                />
                <label htmlFor="service-icon-input" className="service-form-file-label">
                  <Image size={22} />
                  <span>{existingIcon ? 'Reemplazar icono' : 'Seleccionar icono'}</span>
                  <small>PNG, SVG o JPG recomendado</small>
                </label>
              </div>
            )}
          </div>

          <div className="service-form-group service-form-full-width">
            <label>Descripción corta</label>
            <input
              name="short_description"
              value={form.short_description}
              onChange={onFormChange}
              placeholder="Breve descripción del servicio (máx 500 caracteres)"
              maxLength={500}
            />
          </div>

          <div className="service-form-group service-form-full-width">
            <label>Descripción detallada</label>
            <textarea
              name="long_description"
              value={form.long_description}
              onChange={onFormChange}
              placeholder="Descripción completa del servicio..."
              rows="4"
            />
          </div>

          {/* ── Características ── */}
          <div className="service-form-section-title">
            <h3>Características del servicio</h3>
            <small>Lista de beneficios o garantías que ofrece este servicio</small>
          </div>

          <div className="service-features-container">
            {features.map((feat, index) => (
              <div key={index} className="service-feature-row">
                <input
                  type="text"
                  placeholder={`Ej: Garantía, Certificado, Soporte 24hs`}
                  value={feat}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                />
                <button
                  type="button"
                  className="btn-remove-feature"
                  onClick={() => handleRemoveFeature(index)}
                  disabled={features.length === 1}
                  title="Eliminar característica"
                >
                  <Trash3 size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn-add-feature"
              onClick={handleAddFeature}
            >
              <Plus size={18} />
              Agregar característica
            </button>
          </div>

          {/* ── Imágenes ── */}
          <div className="service-form-section-title">
            <h3>Imágenes del servicio</h3>
            <small>
              {editId
                ? 'Podés agregar nuevas imágenes o eliminar las existentes'
                : 'La primera imagen será la imagen principal'}
            </small>
          </div>

          <div className="service-images-container">
            {editId && existingImages.length > 0 && (
              <div className="service-existing-images-section">
                <h4 className="service-images-subtitle">Imágenes actuales</h4>
                <div className="service-image-previews">
                  {existingImages.map((img, index) => {
                    const isMarked = imagesToRemove.includes(img);
                    return (
                      <div
                        key={`existing-${index}`}
                        className={`service-image-preview-item ${isMarked ? 'marked-for-removal' : ''}`}
                      >
                        {index === 0 && !isMarked && (
                          <span className="service-main-image-badge">Principal</span>
                        )}
                        {isMarked && (
                          <span className="service-removal-badge">Se eliminará</span>
                        )}
                        <img
                          src={`${API_URL}${img}`}
                          alt={`Imagen ${index + 1}`}
                        />
                        <button
                          type="button"
                          className={`btn-remove-image ${isMarked ? 'undo' : ''}`}
                          onClick={() => handleToggleRemoveExistingImage(img)}
                          title={isMarked ? 'Cancelar eliminación' : 'Marcar para eliminar'}
                        >
                          {isMarked ? <Plus size={18} /> : <X size={18} />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {imagePreviews.length > 0 && (
              <div className="service-new-images-section">
                <h4 className="service-images-subtitle">Nuevas imágenes a agregar</h4>
                <div className="service-image-previews">
                  {imagePreviews.map((preview, index) => (
                    <div key={`new-${index}`} className="service-image-preview-item">
                      {index === 0 && existingImages.length === 0 && (
                        <span className="service-main-image-badge">Principal</span>
                      )}
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
              </div>
            )}

            <div className="service-form-file-wrapper">
              <input
                type="file"
                name="service_images"
                accept="image/*"
                onChange={handleImageChange}
                id="service-file-input"
                multiple
              />
              <label htmlFor="service-file-input" className="service-form-file-label">
                <Image size={24} />
                <span>Seleccionar imágenes</span>
                <small>Podés seleccionar múltiples imágenes</small>
              </label>
            </div>
          </div>

          {/* ── Constructor de Formulario (form_scheme) ── */}
          <div className="service-form-section-title">
            <h3>Constructor de formulario de cotización</h3>
            <small>
              Definí los campos que el cliente deberá completar al solicitar un presupuesto
              para este servicio
            </small>
          </div>

          <div className="scheme-builder">
            {schemeFields.length === 0 && (
              <p className="scheme-empty">
                Todavía no hay campos. Agregá el primero para configurar el formulario de cotización.
              </p>
            )}

            {schemeFields.map((field, fieldIndex) => (
              <div key={fieldIndex} className="scheme-field-card">
                <div className="scheme-field-card-header">
                  <span className="scheme-field-number">Campo {fieldIndex + 1}</span>
                  <button
                    type="button"
                    className="scheme-btn-remove-field"
                    onClick={() => handleRemoveSchemeField(fieldIndex)}
                    title="Eliminar campo"
                  >
                    <Trash3 size={15} />
                    Eliminar campo
                  </button>
                </div>

                <div className="scheme-field-row">
                  <div className="service-form-group">
                    <label>ID del campo *</label>
                    <input
                      type="text"
                      placeholder="Ej: superficie_m2"
                      value={field.id}
                      onChange={(e) => handleSchemeFieldChange(fieldIndex, 'id', e.target.value)}
                    />
                    <small className="service-form-hint">
                      Identificador único sin espacios (snake_case)
                    </small>
                  </div>

                  <div className="service-form-group">
                    <label>Tipo de campo *</label>
                    <select
                      value={field.type}
                      onChange={(e) => handleSchemeFieldChange(fieldIndex, 'type', e.target.value)}
                    >
                      {FIELD_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="service-form-group">
                    <label>Etiqueta visible *</label>
                    <input
                      type="text"
                      placeholder="Ej: Superficie (m²)"
                      value={field.label}
                      onChange={(e) => handleSchemeFieldChange(fieldIndex, 'label', e.target.value)}
                    />
                  </div>
                </div>

                <div className="service-form-group service-form-full-width">
                  <label>Comentario de ayuda</label>
                  <input
                    type="text"
                    placeholder="Aclaración que verá el cliente al completar este campo (opcional)"
                    value={field.comment}
                    onChange={(e) =>
                      handleSchemeFieldChange(fieldIndex, 'comment', e.target.value)
                    }
                  />
                </div>

                <div className="scheme-field-row">
                  {['text', 'number', 'select', 'textarea'].includes(field.type) && (
                    <div className="service-form-group">
                      <label>Placeholder</label>
                      <input
                        type="text"
                        placeholder="Texto de ejemplo dentro del campo"
                        value={field.placeholder}
                        onChange={(e) =>
                          handleSchemeFieldChange(fieldIndex, 'placeholder', e.target.value)
                        }
                      />
                    </div>
                  )}

                  {field.type === 'number' && (
                    <>
                      <div className="service-form-group">
                        <label>Mínimo</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={field.min}
                          onChange={(e) =>
                            handleSchemeFieldChange(fieldIndex, 'min', e.target.value)
                          }
                        />
                      </div>
                      <div className="service-form-group">
                        <label>Máximo</label>
                        <input
                          type="number"
                          placeholder="10000"
                          value={field.max}
                          onChange={(e) =>
                            handleSchemeFieldChange(fieldIndex, 'max', e.target.value)
                          }
                        />
                      </div>
                    </>
                  )}

                  {field.type === 'textarea' && (
                    <div className="service-form-group">
                      <label>Longitud máxima</label>
                      <input
                        type="number"
                        placeholder="500"
                        value={field.maxLength}
                        onChange={(e) =>
                          handleSchemeFieldChange(fieldIndex, 'maxLength', e.target.value)
                        }
                      />
                    </div>
                  )}
                </div>

                {/* Options for select / radio */}
                {['select', 'radio'].includes(field.type) && (
                  <div className="scheme-options-container">
                    <label className="scheme-options-label">Opciones disponibles</label>
                    {(field.options || []).map((opt, optIndex) => (
                      <div key={optIndex} className="scheme-option-row">
                        <input
                          type="text"
                          placeholder={`Opción ${optIndex + 1}`}
                          value={opt}
                          onChange={(e) =>
                            handleOptionChange(fieldIndex, optIndex, e.target.value)
                          }
                        />
                        <button
                          type="button"
                          className="scheme-btn-remove-option"
                          onClick={() => handleRemoveOption(fieldIndex, optIndex)}
                          title="Eliminar opción"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="scheme-btn-add-option"
                      onClick={() => handleAddOption(fieldIndex)}
                    >
                      <Plus size={15} />
                      Agregar opción
                    </button>
                  </div>
                )}

                {/* Required toggle */}
                {field.type !== 'checkbox' && (
                  <label className="scheme-required-toggle">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) =>
                        handleSchemeFieldChange(fieldIndex, 'required', e.target.checked)
                      }
                    />
                    <span>Campo obligatorio</span>
                  </label>
                )}
              </div>
            ))}

            <button
              type="button"
              className="btn-add-scheme-field"
              onClick={handleAddSchemeField}
            >
              <Plus size={18} />
              Agregar campo al formulario
            </button>
          </div>

          <button
            type="submit"
            className="service-form-btn-primary"
            disabled={loading}
          >
            <Plus size={20} />
            {loading ? 'Guardando...' : editId ? 'Guardar cambios' : 'Agregar servicio'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ServicesForm;