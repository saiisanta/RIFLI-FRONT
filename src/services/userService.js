import api from './api';

const userService = {
  //en authService
  //requestPasswordReset: async (email) => {
  //  try {
  //   const response = await api.post('/users/request-reset', { email });
  //    return response.data;
  //  } catch (error) {
  //    throw error.response?.data || error;
  //  }
 // },
 // resetPassword: async (token, newPassword) => {
  //  try {
  //    const response = await api.post(`/users/reset-password/${token}`, {
  //     newPassword
  //   });
  //    return response.data;
   // } catch (error) {
   //   throw error.response?.data || error;
  //  }
//  },


  getMyProfile: async () => {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateMyProfile: async (userData) => {
    try {
      const response = await api.put('/users/me', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteMyProfile: async () => {
    try {
      const response = await api.delete('/users/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/users/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },


  getUsers: async (params = {}) => {
    try {
      const { page = 1, limit = 10, search = '', role = '' } = params;
      const response = await api.get('/users', {
        params: { page, limit, search, role },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getUserById: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getUserProfile: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/profile`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // ==================== NO IMPLEMENTADOS====================
  
  // Crear usuario (admin)
  // createUser: async (userData) => {
  //   try {
  //     const response = await api.post('/users', userData);
  //     return response.data;
  //   } catch (error) {
  //     throw error.response?.data || error;
  //   }
  // },

  // Actualizar usuario completo (admin)
  // updateUser: async (userId, userData) => {
  //   try {
  //     const response = await api.put(`/users/${userId}`, userData);
  //     return response.data;
  //   } catch (error) {
  //     throw error.response?.data || error;
  //   }
  // },

  // Actualizar usuario parcial (admin)
  // patchUser: async (userId, userData) => {
  //   try {
  //     const response = await api.patch(`/users/${userId}`, userData);
  //     return response.data;
  //   } catch (error) {
  //     throw error.response?.data || error;
  //   }
  // },

  // Actualizar avatar
  // updateAvatar: async (userId, formData) => {
  //   try {
  //     const response = await api.patch(`/users/${userId}/avatar`, formData, {
  //       headers: { 'Content-Type': 'multipart/form-data' }
  //     });
  //     return response.data;
  //   } catch (error) {
  //     throw error.response?.data || error;
  //   }
  // },

  // Historial de actividad
  // getUserActivity: async (userId, params = {}) => {
  //   try {
  //     const { page = 1, limit = 20 } = params;
  //     const response = await api.get(`/users/${userId}/activity`, {
  //       params: { page, limit }
  //     });
  //     return response.data;
  //   } catch (error) {
  //     throw error.response?.data || error;
  //   }
  // },
};

export default userService;