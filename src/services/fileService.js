import api from '../api';

export const fileService = {
    uploadFile: async (file, folder = 'general') => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);
        const response = await api.post('/files/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
  
    getFile: async (fileId) => {
      try {
        const response = await api.get(`/files/${fileId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
  
    deleteFile: async (fileId) => {
      try {
        const response = await api.delete(`/files/${fileId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
  
    getFiles: async (params = {}) => {
      try {
        const response = await api.get('/files', { params });
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
  };
  
  export default {
    adminService,
    serviceService,
    quoteService,
    fileService,
  };