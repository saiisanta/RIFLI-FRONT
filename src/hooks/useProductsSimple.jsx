import { useState, useEffect, useCallback } from "react";

export const useProductsSimple = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("http://localhost:4001/api/products");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error("Error loading products:", err);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const reload = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, reload };
};