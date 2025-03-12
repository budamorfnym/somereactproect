import axios from 'axios';
import { getToken, setToken, clearAuth } from '../utils/tokenStorage';

// API base URL - should be set in environment variables
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.a1detailing.com/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Track pending requests for potential cancellation
const pendingRequests = new Map();

// Generate a unique request ID
const generateRequestId = (config) => {
  const { method, url, params, data } = config;
  return `${method}:${url}:${JSON.stringify(params)}:${JSON.stringify(data)}`;
};

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    // Add timing info for performance tracking
    config.metadata = { startTime: new Date() };
    
    // Generate request ID for tracking
    const requestId = generateRequestId(config);
    config.requestId = requestId;

    // Add authentication token if available
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Cancel any duplicate requests (optional, can be controlled via config)
    if (config.cancelDuplicates && pendingRequests.has(requestId)) {
      const controller = pendingRequests.get(requestId);
      controller.abort();
      pendingRequests.delete(requestId);
    }
    
    // Set up request cancellation
    const controller = new AbortController();
    config.signal = controller.signal;
    pendingRequests.set(requestId, controller);
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Clean up request tracking
    const requestId = response.config.requestId;
    if (requestId && pendingRequests.has(requestId)) {
      pendingRequests.delete(requestId);
    }
    
    // Calculate and log request duration
    const { startTime } = response.config.metadata || {};
    if (startTime) {
      const duration = new Date() - startTime;
      response.duration = duration;
      
      // Log timing for performance monitoring
      if (process.env.NODE_ENV === 'development') {
        console.debug(`Request to ${response.config.url} took ${duration}ms`);
      }
    }
    
    return response;
  },
  async (error) => {
    // Clean up request tracking
    if (error.config && error.config.requestId) {
      const requestId = error.config.requestId;
      if (pendingRequests.has(requestId)) {
        pendingRequests.delete(requestId);
      }
    }
    
    // Handle canceled requests
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message);
      return Promise.reject(error);
    }
    
    // Handle token expiration (401 errors)
    if (error.response && error.response.status === 401) {
      if (error.config && !error.config._retry) {
        error.config._retry = true;
        
        try {
          // Get refresh token
          const refreshToken = localStorage.getItem('refresh_token');
          if (!refreshToken) {
            // No refresh token available, force logout
            clearAuth();
            window.dispatchEvent(new CustomEvent('auth:unauthorized'));
            return Promise.reject(error);
          }
          
          // Try to refresh the token
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken
          });
          
          if (response.data && response.data.token) {
            // Update tokens in storage
            setToken(response.data.token);
            localStorage.setItem('refresh_token', response.data.refreshToken);
            
            // Update authorization header
            api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            error.config.headers['Authorization'] = `Bearer ${response.data.token}`;
            
            // Retry the original request
            return api(error.config);
          } else {
            // Invalid response, force logout
            clearAuth();
            window.dispatchEvent(new CustomEvent('auth:unauthorized'));
            return Promise.reject(error);
          }
        } catch (refreshError) {
          // Token refresh failed, clean up auth data
          clearAuth();
          window.dispatchEvent(new CustomEvent('auth:unauthorized'));
          return Promise.reject(refreshError);
        }
      } else {
        // Already retried or other 401 error, force logout
        clearAuth();
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      }
    }
    
    // Enhanced error handling with better user feedback
    if (!error.response) {
      // Network errors
      if (error.message.includes('timeout')) {
        return Promise.reject({
          ...error,
          response: {
            data: {
              message: 'Запрос превысил время ожидания. Проверьте подключение к интернету.',
              code: 'TIMEOUT_ERROR'
            }
          }
        });
      }
      
      if (error.message.includes('Network Error')) {
        return Promise.reject({
          ...error,
          response: {
            data: {
              message: 'Отсутствует подключение к интернету. Проверьте сетевое соединение.',
              code: 'NETWORK_ERROR'
            }
          }
        });
      }
    }
    
    // Server errors (500+)
    if (error.response && error.response.status >= 500) {
      return Promise.reject({
        ...error,
        response: {
          ...error.response,
          data: {
            ...error.response.data,
            message: error.response.data.message || 'Произошла ошибка на сервере. Пожалуйста, попробуйте позже.',
            code: 'SERVER_ERROR'
          }
        }
      });
    }
    
    // Too Many Requests (429)
    if (error.response && error.response.status === 429) {
      return Promise.reject({
        ...error,
        response: {
          ...error.response,
          data: {
            ...error.response.data,
            message: 'Слишком много запросов. Пожалуйста, попробуйте позже.',
            code: 'RATE_LIMIT_ERROR'
          }
        }
      });
    }
    
    // Generic error handler
    return Promise.reject(error);
  }
);

// API service methods
const apiService = {
  // Core request methods
  get: async (endpoint, options = {}) => {
    return api.get(endpoint, options);
  },
  
  post: async (endpoint, data = {}, options = {}) => {
    return api.post(endpoint, data, options);
  },
  
  put: async (endpoint, data = {}, options = {}) => {
    return api.put(endpoint, data, options);
  },
  
  patch: async (endpoint, data = {}, options = {}) => {
    return api.patch(endpoint, data, options);
  },
  
  delete: async (endpoint, options = {}) => {
    return api.delete(endpoint, options);
  },
  
  // File upload with progress tracking
  uploadFile: async (endpoint, formData, onProgress) => {
    return api.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      }
    });
  },
  
  // Convenience method for file download
  downloadFile: async (endpoint, filename, options = {}) => {
    const response = await api.get(endpoint, { 
      ...options,
      responseType: 'blob' 
    });
    
    // Create a download link and trigger it
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return response;
  },
  
  // Cancel all pending requests (useful when unmounting components)
  cancelPendingRequests: (reason = 'Request canceled') => {
    pendingRequests.forEach((controller) => {
      controller.abort(reason);
    });
    pendingRequests.clear();
  }
};

export default apiService;