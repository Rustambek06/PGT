import axios, { AxiosInstance } from 'axios';
import { PageResponse, AuthResponse } from '../types';

const API_BASE = 'https://personalgrowthtracker.onrender.com/auth';

const instance: AxiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ensure default category exists and return its id
const getOrCreateDefaultCategory = async (): Promise<number> => {
  try {
    const resp = await instance.get('/api/categories', { params: { page: 0, size: 1 } });
    const page = resp.data as any;
    if (page && page.totalElements > 0 && page.content && page.content.length > 0) {
      return page.content[0].id;
    }
    const createResp = await instance.post('/api/categories', { name: 'Uncategorized' });
    return createResp.data.id;
  } catch (err) {
    console.warn('Failed to ensure default category, falling back to id=1', err);
    return 1;
  }
};

// Add request interceptor
instance.interceptors.request.use(
  (config) => {
    const requestUrl = config.url || '';
    const isAuthRoute = requestUrl.startsWith('/auth') || requestUrl.startsWith('auth');
    if (!isAuthRoute) {
      const token = localStorage.getItem('token');
      if (token) {
        if (config.headers) {
          (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
        } else {
          config.headers = { Authorization: `Bearer ${token}` } as any;
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      // Token expired or invalid - logout
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userName');
      localStorage.removeItem('userId');
      window.location.href = '/login';
    }
    // For 403 Forbidden, don't logout - just reject the error
    return Promise.reject(error);
  }
);

export const apiService = {
  // GET with pagination
  getPaginated: <T>(
    endpoint: string,
    page: number = 0,
    size: number = 12,
    sort?: string
  ) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    if (sort) params.append('sort', sort);
    
    return instance.get<PageResponse<T>>(
      `/api${endpoint}?${params.toString()}`
    );
  },

  // GET single item
  getById: <T>(endpoint: string, id: number) => {
    return instance.get<T>(`/api${endpoint}/${id}`);
  },

  // Auth endpoints
  getUserName: () => {
    return localStorage.getItem('userName') || '';
  },

  setUserName: (name: string) => {
    localStorage.setItem('userName', name);
  },

  register: (name: string, email: string, password: string) => {
    return instance.post('/auth/register', { name, email, password });
  },

  login: async (email: string, password: string) => {
    const response = await instance.post<AuthResponse>('/auth/login', { email, password });
    const { token, name, id } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('userName', name);
    localStorage.setItem('userId', id.toString());
    return { token, name, id };
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    window.location.href = '/login';
  },

  // POST create
  create: <T>(endpoint: string, data: any) => {
    // if creating notes or tasks, ensure categoryId and proper dueDate format
    const normalized = { ...data };
    const prepare = async () => {
      if (endpoint.includes('/notes')) {
        if (!normalized.categoryId) {
          normalized.categoryId = await getOrCreateDefaultCategory();
        }
      }
      if (endpoint.includes('/tasks')) {
        if (!normalized.categoryId) {
          normalized.categoryId = await getOrCreateDefaultCategory();
        }
        if (normalized.dueDate && /^\d{4}-\d{2}-\d{2}$/.test(normalized.dueDate)) {
          normalized.dueDate = `${normalized.dueDate}T00:00:00`;
        }
      }
      return instance.post<T>(`/api${endpoint}`, normalized);
    };

    return prepare();
  },

  // PUT update
  update: <T>(endpoint: string, id: number, data: any) => {
    const normalized = { ...data };
    const prepare = async () => {
      if (endpoint.includes('/notes')) {
        if (!normalized.categoryId) {
          normalized.categoryId = await getOrCreateDefaultCategory();
        }
      }
      if (endpoint.includes('/tasks')) {
        if (!normalized.categoryId) {
          normalized.categoryId = await getOrCreateDefaultCategory();
        }
        if (normalized.dueDate && /^\d{4}-\d{2}-\d{2}$/.test(normalized.dueDate)) {
          normalized.dueDate = `${normalized.dueDate}T00:00:00`;
        }
      }
      return instance.put<T>(`/api${endpoint}/${id}`, normalized);
    };

    return prepare();
  },

  // DELETE
  delete: (endpoint: string, id: number) => {
    return instance.delete(`/api${endpoint}/${id}`);
  },

  // GET all (without pagination)
  getAll: <T>(endpoint: string) => {
    return instance.get<T[]>(`/api${endpoint}`);
  },

  // Search with query
  search: <T>(endpoint: string, query: string, page: number = 0, size: number = 12) => {
    return instance.get<PageResponse<T>>(`/api${endpoint}`, {
      params: { q: query, page, size },
    });
  },
};

export default apiService;
