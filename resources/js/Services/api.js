import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8585/api/v1';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
         console.log('Making request to:', config.baseURL + config.url);
        console.log('Full request config:', config);
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        console.log('Response from:', response.config.url, response);
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
    }
};

// Reimbursement API
export const reimbursementAPI = {
    // Employee endpoints
    create: (data) => api.post('/reimbursements', data),
    getMyReimbursements: () => api.get('/reimbursements'),
    getById: (id) => api.get(`/reimbursements/${id}`),
    
    // Manager endpoints
    getPending: () => api.get('/reimbursements/pending'),
    approve: (id, comments) => api.put(`/reimbursements/${id}/approve`, { comments }),
    reject: (id, comments) => api.put(`/reimbursements/${id}/reject`, { comments }),
    
    // Admin endpoints
    getAll: () => api.get('/reimbursements/all'),
};

// User API (Admin only)
export const userAPI = {
    getAll: () => api.get('/users'),
    getById: (id) => api.get(`/users/${id}`),
    create: (userData) => api.post('/users', userData),
    update: (id, userData) => api.put(`/users/${id}`, userData),
    delete: (id) => api.delete(`/users/${id}`),
};

export default api;

