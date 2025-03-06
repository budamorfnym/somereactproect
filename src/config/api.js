import axios from 'axios';
import { getToken, removeToken } from '../utils/tokenStorage';

// Create base API instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://api.a1detailing.kg/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 unauthorized errors (expired or invalid token)
    if (error.response && error.response.status === 401) {
      // Remove token
      removeToken();
      
      // Redirect to login if not already on login page
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login')) {
        window.location.href = `/login?redirect=${currentPath}`;
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;