import { useState, useCallback } from 'react';

/**
 * Normaliza los dos formatos de error del backend:
 *   { error: 'string' }                          → error general
 *   { errors: [{ msg, path, location, ... }] }   → errores por campo (express-validator)
 *
 * @param {string[]} watchedFields - campos del formulario que queremos mapear
 */
const useApiError = (watchedFields = []) => {
  const [generalError, setGeneralError]   = useState(null);
  const [fieldErrors,  setFieldErrors]    = useState({});

  /**
   * Procesa el error capturado en el catch y lo distribuye.
   * @param {any} err - lo que llega del catch (objeto del back o Error nativo)
   */
  const handleApiError = useCallback((err) => {
    // Limpiar estado anterior
    setGeneralError(null);
    setFieldErrors({});

    if (!err) return;

    // ── Formato 1: { errors: [...] } — express-validator ──────────
    if (err.errors && Array.isArray(err.errors)) {
      const fieldMap   = {};
      const general    = [];

      err.errors.forEach(({ msg, path }) => {
        if (path && watchedFields.includes(path)) {
          // Error asociado a un campo conocido del form
          if (!fieldMap[path]) fieldMap[path] = [];
          fieldMap[path].push(msg);
        } else {
          // Sin campo o campo no vigilado → va al error general
          general.push(msg);
        }
      });

      if (Object.keys(fieldMap).length) setFieldErrors(fieldMap);
      if (general.length) setGeneralError(general.join(' · '));
      return;
    }

    // ── Formato 2: { error: 'string' } — error directo ────────────
    if (err.error && typeof err.error === 'string') {
      setGeneralError(err.error);
      return;
    }

    // ── Fallback: Error nativo de JS o string ──────────────────────
    if (err.message) {
      setGeneralError(err.message);
      return;
    }

    if (typeof err === 'string') {
      setGeneralError(err);
      return;
    }

    setGeneralError('Ocurrió un error inesperado. Intentá de nuevo.');
  }, [watchedFields]);

  const clearApiError = useCallback(() => {
    setGeneralError(null);
    setFieldErrors({});
  }, []);

  /**
   * Helper: devuelve el primer mensaje de error de un campo específico
   * para usarlo directamente en el JSX del input.
   */
  const getFieldError = useCallback((fieldName) => {
    const msgs = fieldErrors[fieldName];
    return msgs?.length ? msgs[0] : null;
  }, [fieldErrors]);

  return {
    generalError,
    fieldErrors,
    handleApiError,
    clearApiError,
    getFieldError,
  };
};

export default useApiError;