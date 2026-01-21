import api from './api';

const brandService = {
  getBrands: async (params = {}) => {
    try {
      const response = await api.get('/brands', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getBrandById: async (brandId) => {
    try {
      const response = await api.get(`/brands/${brandId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createBrand: async (brandData) => {
    try {
      const response = await api.post('/brands', brandData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateBrand: async (brandId, brandData) => {
    try {
      const response = await api.put(`/brands/${brandId}`, brandData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteBrand: async (brandId) => {
    try {
      const response = await api.delete(`/brands/${brandId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default brandService;