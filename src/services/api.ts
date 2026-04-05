import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }),
  
  getProfile: () => api.get('/auth/profile'),
};

// Client APIs
export const clientAPI = {
  getAll: () => api.get('/clients'),
  
  getById: (id: string) => api.get(`/clients/${id}`),
  
  create: (data: any) => api.post('/clients', data),
  
  update: (id: string, data: any) => api.put(`/clients/${id}`, data),
  
  delete: (id: string) => api.delete(`/clients/${id}`),
  
  search: (query: string) => api.get(`/clients/search?q=${query}`),
};

// Team APIs
export const teamAPI = {
  getAll: () => api.get('/team'),
  
  getById: (id: string) => api.get(`/team/${id}`),
  
  create: (data: any) => api.post('/team', data),
  
  update: (id: string, data: any) => api.put(`/team/${id}`, data),
  
  delete: (id: string) => api.delete(`/team/${id}`),
  
  search: (query: string) => api.get(`/team/search?q=${query}`),
};

// Payment APIs
export const paymentAPI = {
  getAll: () => api.get('/payments'),
  
  getById: (id: string) => api.get(`/payments/${id}`),
  
  create: (data: any) => api.post('/payments', data),
  
  update: (id: string, data: any) => api.put(`/payments/${id}`, data),
  
  delete: (id: string) => api.delete(`/payments/${id}`),
  
  getByClient: (clientId: string) => api.get(`/payments/client/${clientId}`),
};

// Dashboard APIs
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  
  getRecentActivity: () => api.get('/dashboard/recent-activity'),
};

// File Upload APIs
export const uploadAPI = {
  uploadFile: (file: File, uploadType: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadType', uploadType);
    
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  downloadFile: (type: string, filename: string) => 
    api.get(`/upload/download/${type}/${filename}`, {
      responseType: 'blob',
    }),
  
  viewFile: (type: string, filename: string) => 
    `${API_URL}/upload/view/${type}/${filename}`,
  
  deleteFile: (type: string, filename: string) => 
    api.delete(`/upload/${type}/${filename}`),
  
  getSignedUrl: (type: string, filename: string, expiresIn: number = 3600) =>
    api.get(`/upload/signed-url/${type}/${filename}?expiresIn=${expiresIn}`),
};

export default api;
