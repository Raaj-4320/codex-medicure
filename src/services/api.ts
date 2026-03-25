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
  getUsers: () => api.fetch('/users'),

  // Pharmacies
  getPharmacies: (params: any = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.fetch(`/pharmacies${query ? `?${query}` : ''}`);
  },

  // Medicines
  getMedicines: (params: any = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.fetch(`/medicines${query ? `?${query}` : ''}`);
  },

  // Inventory
  getInventory: (pharmacyId?: string) => 
    api.fetch(`/inventory${pharmacyId ? `?pharmacyId=${pharmacyId}` : ''}`),
  updateInventory: (id: string, data: any) => 
    api.fetch(`/inventory/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // Orders
  getOrders: (params: { customerId?: string; pharmacyId?: string; status?: string } = {}) => {
    const query = new URLSearchParams(params as any).toString();
    return api.fetch(`/orders${query ? `?${query}` : ''}`);
  },
  createOrder: (data: any) => api.fetch('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateOrder: (id: string, data: any) => api.fetch(`/orders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),

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
  processPayment: (data: { orderId: string; amount: number; method: string }) => 
    api.fetch('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Notifications
  getNotifications: (userId: string) => api.fetch(`/notifications?userId=${userId}`),
};
