import api from './api';

const productService = {
  
  getProducts: async (params = {}) => {
    try {
      const {
        page = 1,
        limit = 12,
        search = '',
        category = '',
        minPrice = '',
        maxPrice = '',
        sort = '',
        inStock = '',
      } = params;
      const response = await api.get('/products', {
        params: { page, limit, search, category, minPrice, maxPrice, sort, inStock },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getProductById: async (productId) => {
    try {
      const response = await api.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateProduct: async (productId, productData) => {
    try {
      const response = await api.put(`/products/${productId}`, productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  patchProduct: async (productId, productData) => {
    try {
      const response = await api.patch(`/products/${productId}`, productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteProduct: async (productId) => {
    try {
      const response = await api.delete(`/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getProductReviews: async (productId, params = {}) => {
    try {
      const { page = 1, limit = 10, sort = 'recent' } = params;
      const response = await api.get(`/products/${productId}/reviews`, {
        params: { page, limit, sort },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createProductReview: async (productId, reviewData) => {
    try {
      const response = await api.post(`/products/${productId}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getProductsByCategory: async (categoryId, params = {}) => {
    try {
      const { page = 1, limit = 12, sort = '' } = params;
      const response = await api.get(`/products/category/${categoryId}`, {
        params: { page, limit, sort },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  searchProducts: async (searchParams) => {
    try {
      const response = await api.get('/products/search', {
        params: searchParams,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  uploadProductImages: async (productId, formData) => {
    try {
      const response = await api.post(`/products/${productId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteProductImage: async (productId, imageId) => {
    try {
      const response = await api.delete(`/products/${productId}/images/${imageId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getRelatedProducts: async (productId, limit = 4) => {
    try {
      const response = await api.get(`/products/${productId}/related`, {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getFeaturedProducts: async (limit = 8) => {
    try {
      const response = await api.get('/products/featured', {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getProductsOnSale: async (params = {}) => {
    try {
      const { page = 1, limit = 12 } = params;
      const response = await api.get('/products/on-sale', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateProductStock: async (productId, stockData) => {
    try {
      const response = await api.patch(`/products/${productId}/stock`, stockData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default productService;