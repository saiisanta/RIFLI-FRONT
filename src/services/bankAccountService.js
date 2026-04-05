import api from './api';

const bankAccountService = {
  getBankAccount: async () => {
    try {
      const response = await api.get('/bank-accounts');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createBankAccount: async (accountData) => {
    try {
      const response = await api.post('/bank-accounts', accountData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateBankAccount: async (accountData) => {
    try {
      const response = await api.put('/bank-accounts', accountData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  toggleBankAccount: async () => {
    try {
      const response = await api.patch('/bank-accounts/toggle');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default bankAccountService;