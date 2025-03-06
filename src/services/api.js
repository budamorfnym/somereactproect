import api from '../config/api';

/**
 * Generic API service with common methods for CRUD operations
 */
const apiService = {
  /**
   * Send GET request to the specified endpoint
   * @param {string} endpoint API endpoint
   * @param {Object} params Query parameters
   * @returns {Promise} Promise with response data
   */
  get: async (endpoint, params = {}) => {
    try {
      const response = await api.get(endpoint, { params });
      return response;
    } catch (error) {
      console.error(`Error in GET ${endpoint}:`, error);
      throw error;
    }
  },

  /**
   * Send POST request to the specified endpoint
   * @param {string} endpoint API endpoint
   * @param {Object} data Request body
   * @returns {Promise} Promise with response data
   */
  post: async (endpoint, data = {}) => {
    try {
      const response = await api.post(endpoint, data);
      return response;
    } catch (error) {
      console.error(`Error in POST ${endpoint}:`, error);
      throw error;
    }
  },

  /**
   * Send PUT request to the specified endpoint
   * @param {string} endpoint API endpoint
   * @param {Object} data Request body
   * @returns {Promise} Promise with response data
   */
  put: async (endpoint, data = {}) => {
    try {
      const response = await api.put(endpoint, data);
      return response;
    } catch (error) {
      console.error(`Error in PUT ${endpoint}:`, error);
      throw error;
    }
  },

  /**
   * Send PATCH request to the specified endpoint
   * @param {string} endpoint API endpoint
   * @param {Object} data Request body
   * @returns {Promise} Promise with response data
   */
  patch: async (endpoint, data = {}) => {
    try {
      const response = await api.patch(endpoint, data);
      return response;
    } catch (error) {
      console.error(`Error in PATCH ${endpoint}:`, error);
      throw error;
    }
  },

  /**
   * Send DELETE request to the specified endpoint
   * @param {string} endpoint API endpoint
   * @returns {Promise} Promise with response data
   */
  delete: async (endpoint) => {
    try {
      const response = await api.delete(endpoint);
      return response;
    } catch (error) {
      console.error(`Error in DELETE ${endpoint}:`, error);
      throw error;
    }
  },

  /**
   * Upload file to the specified endpoint
   * @param {string} endpoint API endpoint
   * @param {FormData} formData Form data with file
   * @param {Function} onProgress Optional progress callback
   * @returns {Promise} Promise with response data
   */
  uploadFile: async (endpoint, formData, onProgress) => {
    try {
      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      });
      return response;
    } catch (error) {
      console.error(`Error in file upload to ${endpoint}:`, error);
      throw error;
    }
  },
};

export default apiService;