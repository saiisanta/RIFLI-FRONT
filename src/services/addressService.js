import api from './api';

const addressService = {
  getMyAddresses: async () => {
    try {
      const response = await api.get('/addresses');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getAddressById: async (addressId) => {
    try {
      const response = await api.get(`/addresses/${addressId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * @param {Object} addressData
   * @param {string} addressData.alias
   * @param {string} addressData.street
   * @param {string} addressData.number
   * @param {string} addressData.floor
   * @param {string} addressData.apartment
   * @param {string} addressData.city
   * @param {string} addressData.province
   * @param {string} addressData.postal_code
   * @param {string} addressData.country
   * @param {string} addressData.additional_info
   * @param {boolean} addressData.is_default
   */
  createAddress: async (addressData) => {
    try {
      const response = await api.post('/addresses', addressData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateAddress: async (addressId, addressData) => {
    try {
      const response = await api.put(`/addresses/${addressId}`, addressData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteAddress: async (addressId) => {
    try {
      const response = await api.delete(`/addresses/${addressId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  setDefaultAddress: async (addressId) => {
    try {
        const response = await api.patch(`/addresses/${addressId}/default`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  validateArgentinaPostalCode: (postalCode) => {
    const patterns = [
      /^[A-Z]?\d{4}$/,
      /^[A-Z]\d{4}[A-Z]{3}$/
    ];
    return patterns.some(pattern => pattern.test(postalCode));
  },

  formatFullAddress: (address) => {
    if (!address) return '';
    
    let formatted = `${address.street} ${address.number}`;
    
    if (address.floor) formatted += `, Piso ${address.floor}`;
    if (address.apartment) formatted += `, Depto ${address.apartment}`;
    
    formatted += ` - ${address.city}, ${address.province}`;
    formatted += ` (CP ${address.postal_code})`;
    
    if (address.country && address.country !== 'Argentina') {
      formatted += `, ${address.country}`;
    }
    
    return formatted;
  }
};

export default addressService;