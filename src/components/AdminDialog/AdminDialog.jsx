import React, { useEffect, useRef } from 'react';
import { ExclamationTriangle, X } from 'react-bootstrap-icons';
import './AdminDialog.scss';

/**
 * Reemplaza window.confirm y window.prompt con un dialog custom.
 *
 * Props:
 *  - open        {boolean}
 *  - type        {'confirm' | 'prompt'}   default: 'confirm'
 *  - variant     {'danger' | 'warning' | 'default'}  default: 'default'
 *  - title       {string}
 *  - message     {string}
 *  - placeholder {string}   solo para type='prompt'
 *  - confirmLabel {string}  default: 'Confirmar'
 *  - cancelLabel  {string}  default: 'Cancelar'
 *  - onConfirm   {(value?: string) => void}
 *  - onCancel    {() => void}
 */
const AdminDialog = ({
  open,
  type = 'confirm',
  variant = 'default',
  title,
  message,
  placeholder = '',
  confirmLabel = 'Confirmar',
  cancelLabel  = 'Cancelar',
  onConfirm,
  onCancel,
}) => {
  const inputRef    = useRef(null);
  const containerRef = useRef(null);

  // Focus automático
  useEffect(() => {
    if (!open) return;
    setTimeout(() => {
      if (type === 'prompt' && inputRef.current) {
        inputRef.current.focus();
      } else {
        containerRef.current?.querySelector('.adlg-confirm-btn')?.focus();
      }
    }, 50);
  }, [open, type]);

  // Cerrar con Escape
  useEffect(() => {
    if (!open) return;
    const handle = (e) => { if (e.key === 'Escape') onCancel?.(); };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [open, onCancel]);

  const handleConfirm = () => {
    if (type === 'prompt') {
      onConfirm?.(inputRef.current?.value || '');
    } else {
      onConfirm?.();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleConfirm();
  };

  if (!open) return null;

  return (
    <div className="adlg-overlay" onClick={onCancel}>
      <div
        ref={containerRef}
        className={`adlg-box adlg-box--${variant}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icono decorativo */}
        <div className={`adlg-icon adlg-icon--${variant}`}>
          <ExclamationTriangle size={20} />
        </div>

        {/* Contenido */}
        <div className="adlg-content">
          {title   && <p className="adlg-title">{title}</p>}
          {message && <p className="adlg-message">{message}</p>}

          {type === 'prompt' && (
            <textarea
              ref={inputRef}
              className="adlg-input"
              placeholder={placeholder}
              rows={3}
              onKeyDown={handleKeyDown}
            />
          )}
        </div>

        {/* Acciones */}
        <div className="adlg-actions">
          <button className="adlg-cancel-btn" onClick={onCancel}>
            <X size={14} />
            {cancelLabel}
          </button>
          <button
            className={`adlg-confirm-btn adlg-confirm-btn--${variant}`}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDialog;