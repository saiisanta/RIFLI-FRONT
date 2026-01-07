import { useState, useCallback } from 'react';
import productService from '../services/productService';

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const fetchProducts = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProducts(params);
      setProducts(data.products || data.data || []);
      if (data.pagination) {
        setPagination(data.pagination);
      }
      return data;
    } catch (err) {
      setError(err.message || 'Error al cargar productos');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductById = useCallback(async (productId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProductById(productId);
      setProduct(data.product || data);
      return data;
    } catch (err) {
      setError(err.message || 'Error al cargar producto');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (productData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.createProduct(productData);
      setProducts((prev) => [data.product || data, ...prev]);
      return data;
    } catch (err) {
      setError(err.message || 'Error al crear producto');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProduct = useCallback(async (productId, productData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.updateProduct(productId, productData);
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? data.product || data : p))
      );
      if (product?.id === productId) {
        setProduct(data.product || data);
      }
      return data;
    } catch (err) {
      setError(err.message || 'Error al actualizar producto');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [product]);

  const patchProduct = useCallback(async (productId, productData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.patchProduct(productId, productData);
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, ...data.product } : p))
      );
      if (product?.id === productId) {
        setProduct((prev) => ({ ...prev, ...data.product }));
      }
      return data;
    } catch (err) {
      setError(err.message || 'Error al actualizar producto');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [product]);

  const deleteProduct = useCallback(async (productId) => {
    try {
      setLoading(true);
      setError(null);
      await productService.deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      return true;
    } catch (err) {
      setError(err.message || 'Error al eliminar producto');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductReviews = useCallback(async (productId, params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProductReviews(productId, params);
      return data;
    } catch (err) {
      setError(err.message || 'Error al cargar reseñas');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createReview = useCallback(async (productId, reviewData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.createProductReview(productId, reviewData);
      return data;
    } catch (err) {
      setError(err.message || 'Error al crear reseña');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchProducts = useCallback(async (searchParams) => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.searchProducts(searchParams);
      setProducts(data.products || data.data || []);
      if (data.pagination) {
        setPagination(data.pagination);
      }
      return data;
    } catch (err) {
      setError(err.message || 'Error al buscar productos');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadImages = useCallback(async (productId, files) => {
    try {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('images', file);
      });
      const data = await productService.uploadProductImages(productId, formData);
      if (product?.id === productId) {
        setProduct((prev) => ({ ...prev, images: data.images }));
      }
      return data;
    } catch (err) {
      setError(err.message || 'Error al subir imágenes');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [product]);

  const deleteImage = useCallback(async (productId, imageId) => {
    try {
      setLoading(true);
      setError(null);
      await productService.deleteProductImage(productId, imageId);
      if (product?.id === productId) {
        setProduct((prev) => ({
          ...prev,
          images: prev.images.filter((img) => img.id !== imageId),
        }));
      }
      return true;
    } catch (err) {
      setError(err.message || 'Error al eliminar imagen');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [product]);

  const fetchRelatedProducts = useCallback(async (productId, limit = 4) => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getRelatedProducts(productId, limit);
      return data;
    } catch (err) {
      setError(err.message || 'Error al cargar productos relacionados');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFeaturedProducts = useCallback(async (limit = 8) => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getFeaturedProducts(limit);
      return data;
    } catch (err) {
      setError(err.message || 'Error al cargar productos destacados');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener productos en oferta
  const fetchProductsOnSale = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProductsOnSale(params);
      setProducts(data.products || data.data || []);
      if (data.pagination) {
        setPagination(data.pagination);
      }
      return data;
    } catch (err) {
      setError(err.message || 'Error al cargar productos en oferta');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar stock
  const updateStock = useCallback(async (productId, stockData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.updateProductStock(productId, stockData);
      if (product?.id === productId) {
        setProduct((prev) => ({ ...prev, stock: data.stock }));
      }
      return data;
    } catch (err) {
      setError(err.message || 'Error al actualizar stock');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [product]);

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Limpiar estado
  const clearState = useCallback(() => {
    setProducts([]);
    setProduct(null);
    setError(null);
    setPagination({ page: 1, limit: 12, total: 0, totalPages: 0 });
  }, []);

  return {
    products,
    product,
    loading,
    error,
    pagination,
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    patchProduct,
    deleteProduct,
    fetchProductReviews,
    createReview,
    searchProducts,
    uploadImages,
    deleteImage,
    fetchRelatedProducts,
    fetchFeaturedProducts,
    fetchProductsOnSale,
    updateStock,
    clearError,
    clearState,
  };
};

export default useProducts;