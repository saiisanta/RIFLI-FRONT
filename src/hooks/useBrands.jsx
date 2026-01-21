import { useState, useCallback } from 'react';
import brandService from '../services/brandService';

const useBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBrands = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await brandService.getBrands();
      setBrands(Array.isArray(data) ? data : data.brands || []);
      return data;
    } catch (err) {
      setError(err.message || 'Error al cargar marcas');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    brands,
    loading,
    error,
    fetchBrands,
    clearError,
  };
};

export default useBrands;