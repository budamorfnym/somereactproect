import axios from 'axios';
import { getToken, setToken, clearAuth } from '../utils/tokenStorage';

// Create base API instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://api.a1detailing.kg/api/v1',
  timeout: 15000, // Increased timeout to 15s
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add timing info for performance monitoring
    config.metadata = { startTime: new Date() };
    
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request ID for tracing
    config.headers['X-Request-ID'] = Math.random().toString(36).substring(2, 15);
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const { startTime } = response.config.metadata || {};
    if (startTime) {
      response.duration = new Date() - startTime;
      console.debug(`Request to ${response.config.url} took ${response.duration}ms`);
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle token expiration (status 401)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await api.post('/auth/refresh', { refreshToken });
          
          // Update tokens
          setToken(response.data.token);
          localStorage.setItem('refresh_token', response.data.refreshToken);
          
          // Update the auth header
          originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
          
          // Retry original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Token refresh failed, clean up auth data
        clearAuth();
        localStorage.removeItem('refresh_token');
        
        // Redirect to login if not already on login page
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/login')) {
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        }
      }
    }
    
    // Network errors
    if (!error.response) {
      // Log network error
      console.error('Network error:', error);
      
      // Show user-friendly error
      if (error.message.includes('timeout')) {
        return Promise.reject({
          response: {
            data: {
              message: 'Превышено время ожидания запроса. Проверьте подключение к интернету.'
            }
          }
        });
      }
      
      if (error.message.includes('Network Error')) {
        return Promise.reject({
          response: {
            data: {
              message: 'Ошибка сети. Проверьте подключение к интернету.'
            }
          }
        });
      }
    }
    
    // Handle server errors with more specific messages
    if (error.response && error.response.status >= 500) {
      console.error('Server error:', error.response);
      return Promise.reject({
        ...error,
        response: {
          ...error.response,
          data: {
            ...error.response.data,
            message: error.response.data.message || 'Произошла ошибка на сервере. Пожалуйста, попробуйте позже.'
          }
        }
      });
    }
    
    return Promise.reject(error);
  }
);

export default api;