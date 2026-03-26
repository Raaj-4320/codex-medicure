const API_BASE = '/api';

export const api = {
  async fetch(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Something went wrong');
    }
    return response.json();
  },

  // Auth
  login: (email: string) => api.fetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),

  // Users
  getUsers: (params: any = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.fetch(`/users${query ? `?${query}` : ''}`);
  },
  createUser: (data: any) => api.fetch('/users', { method: 'POST', body: JSON.stringify(data) }),
  updateUser: (id: string, data: any) => api.fetch(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteUser: (id: string) => api.fetch(`/users/${id}`, { method: 'DELETE' }),

  // Pharmacies
  getPharmacies: (params: any = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.fetch(`/pharmacies${query ? `?${query}` : ''}`);
  },
  updatePharmacy: (id: string, data: any) => api.fetch(`/pharmacies/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),

  // Medicines
  getMedicines: (params: any = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.fetch(`/medicines${query ? `?${query}` : ''}`);
  },
  createMedicine: (data: any) => api.fetch('/medicines', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateMedicine: (id: string, data: any) => api.fetch(`/medicines/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  deleteMedicine: (id: string) => api.fetch(`/medicines/${id}`, { method: 'DELETE' }),

  // Inventory
  getInventory: (params: any = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.fetch(`/inventory${query ? `?${query}` : ''}`);
  },
  createInventory: (data: any) => api.fetch('/inventory', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateInventory: (id: string, data: any) => api.fetch(`/inventory/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  deleteInventory: (id: string) => api.fetch(`/inventory/${id}`, {
    method: 'DELETE',
  }),

  // Orders
  getOrders: (params: any = {}) => {
    const query = new URLSearchParams(params as any).toString();
    return api.fetch(`/orders${query ? `?${query}` : ''}`);
  },
  getOrderById: (id: string) => api.fetch(`/orders/${id}`),
  createOrder: (data: any) => api.fetch('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateOrder: (id: string, data: any) => api.fetch(`/orders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  deleteOrder: (id: string) => api.fetch(`/orders/${id}`, { method: 'DELETE' }),

  // Delivery Assignments
  getDeliveryAssignments: (params: { deliveryStaffId?: string; status?: string } = {}) => {
    const query = new URLSearchParams(params as any).toString();
    return api.fetch(`/delivery-assignments${query ? `?${query}` : ''}`);
  },
  createDeliveryAssignment: (data: any) => api.fetch('/delivery-assignments', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateDeliveryAssignment: (id: string, data: any) => api.fetch(`/delivery-assignments/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),

  // Payments
  getPayments: (params: any = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.fetch(`/payments${query ? `?${query}` : ''}`);
  },
  processPayment: (data: { orderId: string; amount: number; method: string }) =>
    api.fetch('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Prescriptions
  getPrescriptions: (params: any = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.fetch(`/prescriptions${query ? `?${query}` : ''}`);
  },
  createPrescription: (data: any) => api.fetch('/prescriptions', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updatePrescription: (id: string, data: any) => api.fetch(`/prescriptions/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),

  // Returns
  getReturns: (params: any = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.fetch(`/returns${query ? `?${query}` : ''}`);
  },
  updateReturn: (id: string, data: any) => api.fetch(`/returns/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),

  // Payouts
  getPayouts: (params: any = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.fetch(`/payouts${query ? `?${query}` : ''}`);
  },
  updatePayout: (id: string, data: any) => api.fetch(`/payouts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),

  // Tickets
  getTickets: (params: any = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.fetch(`/tickets${query ? `?${query}` : ''}`);
  },
  createTicket: (data: any) => api.fetch('/tickets', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateTicket: (id: string, data: any) => api.fetch(`/tickets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),

  // Analytics
  getAnalytics: (params: { sellerId: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return api.fetch(`/analytics${query ? `?${query}` : ''}`);
  },

  // Compliance
  getCompliance: (params: { sellerId?: string; status?: string } = {}) => {
    const query = new URLSearchParams(params as any).toString();
    return api.fetch(`/compliance${query ? `?${query}` : ''}`);
  },
  createCompliance: (data: any) => api.fetch('/compliance', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateCompliance: (id: string, data: any) => api.fetch(`/compliance/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),

  // Notifications
  getNotifications: (params: { userId?: string } = {}) => {
    const query = new URLSearchParams(params as any).toString();
    return api.fetch(`/notifications${query ? `?${query}` : ''}`);
  },
  updateNotification: (id: string, data: any) => api.fetch(`/notifications/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  deleteNotification: (id: string) => api.fetch(`/notifications/${id}`, { method: 'DELETE' }),
};
