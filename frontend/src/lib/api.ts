const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4017/api';

interface RequestOptions {
  method?: string;
  body?: unknown;
  token?: string | null;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'İstek başarısız' }));
    throw new ApiError(response.status, error.message || 'İstek başarısız');
  }

  return response.json();
}

export const api = {
  auth: {
    register: (data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      framingShopName: string;
      phone?: string;
      city?: string;
      state?: string;
    }) => request('/auth/register', { method: 'POST', body: data }),

    login: (data: { email: string; password: string }) =>
      request('/auth/login', { method: 'POST', body: data }),

    me: (token: string) => request('/auth/me', { token }),
  },

  dashboard: {
    stats: (token: string) => request('/dashboard/stats', { token }),
  },

  workBenches: {
    list: (token: string, params?: { page?: number; status?: string; zone?: string }) => {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.status) query.set('status', params.status);
      if (params?.zone) query.set('zone', params.zone);
      const qs = query.toString();
      return request(`/work-benches${qs ? `?${qs}` : ''}`, { token });
    },
    create: (token: string, data: Record<string, unknown>) =>
      request('/work-benches', { method: 'POST', body: data, token }),
    update: (token: string, id: string, data: Record<string, unknown>) =>
      request(`/work-benches/${id}`, { method: 'PATCH', body: data, token }),
    delete: (token: string, id: string) =>
      request(`/work-benches/${id}`, { method: 'DELETE', token }),
  },

  framingOrders: {
    list: (token: string, params?: { page?: number; status?: string }) => {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.status) query.set('status', params.status);
      const qs = query.toString();
      return request(`/framing-orders${qs ? `?${qs}` : ''}`, { token });
    },
    create: (token: string, data: Record<string, unknown>) =>
      request('/framing-orders', { method: 'POST', body: data, token }),
    update: (token: string, id: string, data: Record<string, unknown>) =>
      request(`/framing-orders/${id}`, { method: 'PATCH', body: data, token }),
    delete: (token: string, id: string) =>
      request(`/framing-orders/${id}`, { method: 'DELETE', token }),
  },

  equipmentMaintenance: {
    list: (token: string, params?: { status?: string; priority?: string }) => {
      const query = new URLSearchParams();
      if (params?.status) query.set('status', params.status);
      if (params?.priority) query.set('priority', params.priority);
      const qs = query.toString();
      return request(`/equipment-maintenance${qs ? `?${qs}` : ''}`, { token });
    },
    create: (token: string, data: Record<string, unknown>) =>
      request('/equipment-maintenance', { method: 'POST', body: data, token }),
    update: (token: string, id: string, data: Record<string, unknown>) =>
      request(`/equipment-maintenance/${id}`, { method: 'PATCH', body: data, token }),
    delete: (token: string, id: string) =>
      request(`/equipment-maintenance/${id}`, { method: 'DELETE', token }),
  },

  qualityChecklist: {
    list: (token: string, params?: { page?: number; status?: string }) => {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.status) query.set('status', params.status);
      const qs = query.toString();
      return request(`/quality-checklists${qs ? `?${qs}` : ''}`, { token });
    },
    create: (token: string, data: Record<string, unknown>) =>
      request('/quality-checklists', { method: 'POST', body: data, token }),
    update: (token: string, id: string, data: Record<string, unknown>) =>
      request(`/quality-checklists/${id}`, { method: 'PATCH', body: data, token }),
    delete: (token: string, id: string) =>
      request(`/quality-checklists/${id}`, { method: 'DELETE', token }),
  },

  mouldingOrders: {
    list: (token: string, params?: { page?: number; status?: string; mouldingProfile?: string }) => {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.status) query.set('status', params.status);
      if (params?.mouldingProfile) query.set('mouldingProfile', params.mouldingProfile);
      const qs = query.toString();
      return request(`/moulding-orders${qs ? `?${qs}` : ''}`, { token });
    },
    create: (token: string, data: Record<string, unknown>) =>
      request('/moulding-orders', { method: 'POST', body: data, token }),
    update: (token: string, id: string, data: Record<string, unknown>) =>
      request(`/moulding-orders/${id}`, { method: 'PATCH', body: data, token }),
    delete: (token: string, id: string) =>
      request(`/moulding-orders/${id}`, { method: 'DELETE', token }),
  },

  pricingTiers: {
    list: (token: string, params?: { page?: number; status?: string }) => {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.status) query.set('status', params.status);
      const qs = query.toString();
      return request(`/pricing-tiers${qs ? `?${qs}` : ''}`, { token });
    },
    create: (token: string, data: Record<string, unknown>) =>
      request('/pricing-tiers', { method: 'POST', body: data, token }),
    update: (token: string, id: string, data: Record<string, unknown>) =>
      request(`/pricing-tiers/${id}`, { method: 'PATCH', body: data, token }),
    delete: (token: string, id: string) =>
      request(`/pricing-tiers/${id}`, { method: 'DELETE', token }),
  },

  framingShop: {
    get: (token: string) => request('/framing-shop', { token }),
    update: (token: string, data: Record<string, unknown>) =>
      request('/framing-shop', { method: 'PATCH', body: data, token }),
  },
};

export { ApiError };
