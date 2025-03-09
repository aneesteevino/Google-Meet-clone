import axios from 'axios';

const API_URL = 'http://localhost:5000/api';  // Changed to match server port

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error);
    return Promise.reject(error);
  }
);

// Test connection
export const testConnection = () => api.get('/test');

export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const createMeeting = () => api.post('/meetings/create');
export const joinMeeting = (meetingId) => api.post(`/meetings/join/${meetingId}`);

export default api;