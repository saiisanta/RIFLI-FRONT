import api from '../api';

export const serviceService = {

    getServices: async (params = {}) => {
      try {
        const response = await api.get('/services', { params });
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
  
    getServiceById: async (serviceId) => {
      try {
        const response = await api.get(`/services/${serviceId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
  
    createService: async (serviceData) => {
      try {
        const response = await api.post('/services', serviceData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
  
    updateService: async (serviceId, serviceData) => {
      try {
        const response = await api.put(`/services/${serviceId}`, serviceData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
  
    deleteService: async (serviceId) => {
      try {
        const response = await api.delete(`/services/${serviceId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
  
    getServiceCategories: async () => {
      try {
        const response = await api.get('/services/categories');
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
  };