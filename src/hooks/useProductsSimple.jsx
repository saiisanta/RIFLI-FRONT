import { useState, useEffect, useCallback } from "react";
import productService from "../services/productService";

export const useProductsSimple = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    limit: 100
  });

  const fetchProducts = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productService.getProducts({
        page: 1,
        limit: 100,
        ...filters
      });
      
      if (response.products) {
        setProducts(response.products);
        setPagination({
          currentPage: response.currentPage || 1,
          totalPages: response.totalPages || 1,
          totalProducts: response.totalProducts || response.products.length,
          limit: response.limit || 100
        });
      } else if (Array.isArray(response)) {
        setProducts(response);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalProducts: response.length,
          limit: 100
        });
      } else {
        throw new Error("Formato de respuesta inesperado");
      }
    } catch (err) {
      console.error("Error loading products:", err);
      setError(err.message || "Error al cargar productos");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const reload = useCallback((filters = {}) => {
    fetchProducts(filters);
  }, [fetchProducts]);

  return { 
    products, 
    loading, 
    error, 
    reload,
    pagination
  };
};