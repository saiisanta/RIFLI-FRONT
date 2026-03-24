import api from "./api";

const orderService = {
  // ── Cliente ────────────────────────────────────────────────

  getOrders: async (params = {}) => {
    try {
      const {
        page = 1,
        limit = 10,
        status = "",
        payment_status = "",
        shipping_status = "",
      } = params;
      const query = { page, limit };
      if (status) query.status = status;
      if (payment_status) query.payment_status = payment_status;
      if (shipping_status) query.shipping_status = shipping_status;
      const response = await api.get("/orders", { params: query });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createOrder: async (orderData) => {
    try {
      const response = await api.post("/orders", orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  cancelOrder: async (orderId, cancellation_reason = "") => {
    try {
      const response = await api.patch(`/orders/${orderId}/cancel`, {
        cancellation_reason,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // NUEVO: cliente acepta o rechaza el precio de envío cotizado
  confirmShipping: async (orderId, action, cancellation_reason = "") => {
    try {
      const response = await api.patch(`/orders/${orderId}/shipping/confirm`, {
        action,
        ...(cancellation_reason && { cancellation_reason }),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  uploadPaymentProof: async (orderId, file, proofData = {}) => {
    try {
      const formData = new FormData();
      formData.append("proof", file);
      formData.append(
        "payment_type",
        proofData.payment_type || "BANK_TRANSFER",
      );
      if (proofData.amount) formData.append("amount", proofData.amount);
      if (proofData.transaction_reference)
        formData.append(
          "transaction_reference",
          proofData.transaction_reference,
        );
      if (proofData.transaction_date)
        formData.append("transaction_date", proofData.transaction_date);
      if (proofData.bank_name)
        formData.append("bank_name", proofData.bank_name);
      if (proofData.notes) formData.append("notes", proofData.notes);

      const response = await api.post(`/orders/${orderId}/proof`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // ── Admin ──────────────────────────────────────────────────

  setShippingCost: async (orderId, { shipping_cost, internal_notes = "" }) => {
    try {
      const response = await api.patch(`/orders/${orderId}/shipping`, {
        shipping_cost,
        internal_notes,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  reviewProof: async (
    orderId,
    { proof_id, action, admin_notes = "", rejection_reason = "" },
  ) => {
    try {
      const response = await api.patch(`/orders/${orderId}/proof/review`, {
        proof_id,
        action,
        admin_notes,
        ...(action === "reject" && { rejection_reason }),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateOrderStatus: async (orderId, statusData) => {
    try {
      const response = await api.patch(`/orders/${orderId}/status`, statusData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default orderService;