import axios, { AxiosInstance } from 'axios';
import { PageResponse } from '../types';

const API_BASE = 'http://localhost:8080/api';

const instance: AxiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ensure default category exists and return its id
const getOrCreateDefaultCategory = async (): Promise<number> => {
  try {
    const resp = await instance.get('/categories', { params: { page: 0, size: 1 } });
    const page = resp.data as any;
    if (page && page.totalElements > 0 && page.content && page.content.length > 0) {
      return page.content[0].id;
    }
    const createResp = await instance.post('/categories', { name: 'Uncategorized' });
    return createResp.data.id;
  } catch (err) {
    console.warn('Failed to ensure default category, falling back to id=1', err);
    return 1;
  }
};

// Add request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
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
      `${endpoint}?${params.toString()}`
    );
  },

  // GET single item
  getById: <T>(endpoint: string, id: number) => {
    return instance.get<T>(`${endpoint}/${id}`);
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
      return instance.post<T>(endpoint, normalized);
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
      return instance.put<T>(`${endpoint}/${id}`, normalized);
    };

    return prepare();
  },

  // DELETE
  delete: (endpoint: string, id: number) => {
    return instance.delete(`${endpoint}/${id}`);
  },

  // GET all (without pagination)
  getAll: <T>(endpoint: string) => {
    return instance.get<T[]>(endpoint);
  },

  // Search with query
  search: <T>(endpoint: string, query: string, page: number = 0, size: number = 12) => {
    return instance.get<PageResponse<T>>(endpoint, {
      params: { q: query, page, size },
    });
  },
};

export default apiService;
