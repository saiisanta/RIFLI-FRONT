import React, { useState } from 'react';
import { FiX, FiAlertTriangle, FiTrash2 } from 'react-icons/fi';
import './DeleteAccountModal.scss';

const DeleteAccountModal = ({ onClose, onConfirm, loading, error }) => {
  const [confirmText, setConfirmText] = useState('');
  const [step, setStep] = useState(1); // 1: advertencia, 2: confirmación

  const CONFIRM_PHRASE = 'ELIMINAR MI CUENTA';
  const isConfirmValid = confirmText === CONFIRM_PHRASE;

  const handleNextStep = () => {
    setStep(2);
  };

  const handleConfirmDelete = () => {
    if (isConfirmValid) {
      onConfirm();
    }
  };

  return (
    <div className="delete-modal-overlay" onClick={onClose}>
      <div className="delete-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="delete-modal-header">
          <div className="delete-modal-header-content">
            <div className="delete-warning-icon">
              <FiAlertTriangle />
            </div>
            <h2>Eliminar Cuenta</h2>
          </div>
          <button onClick={onClose} className="delete-modal-close" aria-label="Cerrar">
            <FiX />
          </button>
        </div>

        {error && (
          <div className="delete-modal-error">
            {error}
          </div>
        )}

        <div className="delete-modal-content">
          {step === 1 ? (
            <>
              <div className="delete-warning-box">
                <h3>Esta acción es permanente e irreversible</h3>
                <p>Al eliminar tu cuenta:</p>
                <ul className="delete-consequences-list">
                  <li>
                    <FiAlertTriangle />
                    <span>Perderás acceso permanente a tu cuenta</span>
                  </li>
                  <li>
                    <FiAlertTriangle />
                    <span>Se eliminarán todos tus datos personales</span>
                  </li>
                  <li>
                    <FiAlertTriangle />
                    <span>Se cancelarán todos tus pedidos pendientes</span>
                  </li>
                  <li>
                    <FiAlertTriangle />
                    <span>No podrás recuperar tu información</span>
                  </li>
                  <li>
                    <FiAlertTriangle />
                    <span>Tendrás que crear una nueva cuenta para volver a usar nuestros servicios</span>
                  </li>
                </ul>
              </div>

              <div className="delete-recommendation-box">
                <h4>¿Estás seguro de que quieres continuar?</h4>
                <p>
                  Si solo deseas desactivar tu cuenta temporalmente, contacta con nuestro soporte.
                  Podemos ayudarte a resolver cualquier problema sin necesidad de eliminar tu cuenta.
                </p>
              </div>

              <div className="delete-modal-actions">
                <button
                  type="button"
                  onClick={onClose}
                  className="delete-modal-btn btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="delete-modal-btn btn-warning"
                >
                  <FiAlertTriangle />
                  Entiendo, continuar
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="delete-final-warning">
                <div className="delete-final-icon">
                  <FiTrash2 />
                </div>
                <h3>Confirmación Final</h3>
                <p>
                  Para confirmar la eliminación de tu cuenta, escribe exactamente la siguiente frase:
                </p>
                <div className="delete-phrase-box">
                  <code>{CONFIRM_PHRASE}</code>
                </div>
              </div>

              <div className="delete-form-group">
                <label htmlFor="confirmText">
                  Escribí la frase para confirmar *
                </label>
                <input
                  type="text"
                  id="confirmText"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  disabled={loading}
                  placeholder="ELIMINAR MI CUENTA"
                  className={confirmText && !isConfirmValid ? 'input-error' : ''}
                  autoComplete="off"
                />
                {confirmText && !isConfirmValid && (
                  <span className="delete-field-error">
                    La frase no coincide. Debe ser exactamente: {CONFIRM_PHRASE}
                  </span>
                )}
              </div>

              <div className="delete-modal-actions">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="delete-modal-btn btn-secondary"
                >
                  Volver
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={!isConfirmValid || loading}
                  className="delete-modal-btn btn-danger"
                >
                  {loading ? (
                    <>
                      <span className="delete-spinner-small"></span>
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <FiTrash2 />
                      Eliminar Mi Cuenta
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;