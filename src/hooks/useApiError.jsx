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
  setGeneralError(null);
  setFieldErrors({});

  if (!err) return;

  // Axios / Fetch: si viene dentro de response.data
  const apiError = err.response?.data || err;

  // ── Formato 1: express-validator ──────────
  if (apiError.errors && Array.isArray(apiError.errors)) {
    const fieldMap = {};
    const general = [];

    apiError.errors.forEach(({ msg, path }) => {
      if (path && watchedFields.includes(path)) {
        if (!fieldMap[path]) fieldMap[path] = [];
        fieldMap[path].push(msg);
      } else {
        general.push(msg);
      }
    });

    if (Object.keys(fieldMap).length) setFieldErrors(fieldMap);
    if (general.length) setGeneralError(general.join(' · '));
    return;
  }

  // ── Formato 2: error simple ──────────
  if (apiError.error && typeof apiError.error === 'string') {
    setGeneralError(apiError.error);
    return;
  }

  // ── Formato 3: message ──────────
  if (apiError.message) {
    setGeneralError(apiError.message);
    return;
  }

  if (typeof apiError === 'string') {
    setGeneralError(apiError);
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