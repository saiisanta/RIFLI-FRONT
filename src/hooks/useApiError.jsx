import { useState, useCallback } from 'react';

const useApiError = (watchedFields = []) => {
  const [generalError, setGeneralError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [rateLimitError, setRateLimitError] = useState(null);

  const handleApiError = useCallback((err) => {
    setGeneralError(null);
    setFieldErrors({});
    setRateLimitError(null);

    if (!err) return;

    const status = err.response?.status;
    const data = err.response?.data || err;

    if (status === 429) {
      setRateLimitError(data?.error || 'Demasiados intentos. Intentá más tarde.');
      return;
    }

    if (data.errors && Array.isArray(data.errors)) {
      const fieldMap = {};
      const general = [];

      data.errors.forEach(({ msg, path }) => {
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

    if (data.error && typeof data.error === 'string') {
      setGeneralError(data.error);
      return;
    }

    if (data.message) {
      setGeneralError(data.message);
      return;
    }

    if (typeof data === 'string') {
      setGeneralError(data);
      return;
    }

    setGeneralError('Ocurrió un error inesperado.');
  }, [watchedFields]);

  const clearApiError = useCallback(() => {
    setGeneralError(null);
    setFieldErrors({});
    setRateLimitError(null);
  }, []);

  const clearRateLimitError = useCallback(() => {
    setRateLimitError(null);
  }, []);

  const getFieldError = useCallback((fieldName) => {
    const msgs = fieldErrors[fieldName];
    return msgs?.length ? msgs[0] : null;
  }, [fieldErrors]);

  return {
    generalError,
    fieldErrors,
    rateLimitError,
    handleApiError,
    clearApiError,
    clearRateLimitError,
    getFieldError,
  };
};

export default useApiError;