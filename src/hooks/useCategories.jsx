import { useState, useCallback } from 'react';
import categoryService from '../services/categoryService';

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoryService.getCategories();
      setCategories(Array.isArray(data) ? data : data.categories || []);
      return data;
    } catch (err) {
      setError(err.message || 'Error al cargar categorías');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    clearError,
  };
};

export default useCategories;