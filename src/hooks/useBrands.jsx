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

  const createBrand = useCallback(async (brandData) => {
    try {
      setLoading(true);
      setError(null);
      const newBrand = await brandService.createBrand(brandData);
      setBrands(prev => [...prev, newBrand]);
      return newBrand;
    } catch (err) {
      setError(err.message || 'Error al crear marca');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBrand = useCallback(async (brandId, brandData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedBrand = await brandService.updateBrand(brandId, brandData);
      setBrands(prev => prev.map(b => b.id === brandId ? updatedBrand : b));
      return updatedBrand;
    } catch (err) {
      setError(err.message || 'Error al actualizar marca');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteBrand = useCallback(async (brandId) => {
    try {
      setLoading(true);
      setError(null);
      await brandService.deleteBrand(brandId);
      setBrands(prev => prev.filter(b => b.id !== brandId));
    } catch (err) {
      setError(err.message || 'Error al eliminar marca');
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
    createBrand,
    updateBrand,
    deleteBrand,
    clearError,
  };
};

export default useBrands;