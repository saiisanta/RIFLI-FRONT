import api from "./api";

const orderService = {
  getOrders: async (params = {}) => {
    const {
      page = 1, limit = 10,
      status = "", payment_status = "", shipping_status = "",
    } = params;

    const query = { page, limit };
    if (status)          query.status          = status;
    if (payment_status)  query.payment_status  = payment_status;
    if (shipping_status) query.shipping_status = shipping_status;

    const response = await api.get("/orders", { params: query });
    return response.data;
  },

  getOrderById: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  createOrder: async ({ items, address_id, payment_method, customer_notes }) => {
    const response = await api.post("/orders", {
      address_id,
      payment_method,
      customer_notes,
      items: items.map((i) => ({
        product_id: i.product_id,
        quantity:   i.quantity,
      })),
    });
    return response.data;
  },

  cancelOrder: async (orderId, cancellation_reason = "") => {
    const response = await api.patch(`/orders/${orderId}/cancel`, {
      cancellation_reason,
    });
    return response.data;
  },

  confirmShipping: async (orderId, action, cancellation_reason = "") => {
    const response = await api.patch(`/orders/${orderId}/shipping/confirm`, {
      action,
      ...(cancellation_reason && { cancellation_reason }),
    });
    return response.data;
  },

  uploadPaymentProof: async (orderId, file, proofData = {}) => {
    const formData = new FormData();
    formData.append("proof", file);
    formData.append("payment_type", proofData.payment_type || "BANK_TRANSFER");

    if (proofData.amount)                 formData.append("amount",                proofData.amount);
    if (proofData.transaction_reference)  formData.append("transaction_reference", proofData.transaction_reference);
    if (proofData.transaction_date)       formData.append("transaction_date",      proofData.transaction_date);
    if (proofData.bank_name)              formData.append("bank_name",             proofData.bank_name);
    if (proofData.notes)                  formData.append("notes",                 proofData.notes);

    const response = await api.post(`/orders/${orderId}/proof`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  setShippingCost: async (orderId, { shipping_cost, internal_notes = "" }) => {
    const response = await api.patch(`/orders/${orderId}/shipping`, {
      shipping_cost,
      internal_notes,
    });
    return response.data;
  },

  reviewProof: async (orderId, { proof_id, action, admin_notes = "", rejection_reason = "" }) => {
    const response = await api.patch(`/orders/${orderId}/proof/review`, {
      proof_id,
      action,
      admin_notes,
      ...(action === "reject" && { rejection_reason }),
    });
    return response.data;
  },

  updateOrderStatus: async (orderId, statusData) => {
    const response = await api.patch(`/orders/${orderId}/status`, statusData);
    return response.data;
  },
};

export default orderService;