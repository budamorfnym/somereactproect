import apiService from './api';

export const authService = {
  /**
   * Login with email/phone and password
   * 
   * @param {Object} credentials User credentials
   * @param {string} credentials.email Email or phone
   * @param {string} credentials.password Password
   * @returns {Promise<Object>} Response with user and token
   */
  login: async (credentials) => {
    try {
      const response = await apiService.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Register new user
   * 
   * @param {Object} userData User data
   * @param {string} userData.name User name
   * @param {string} userData.email Email
   * @param {string} userData.phone Phone
   * @param {string} userData.password Password
   * @returns {Promise<Object>} Response with user and token
   */
  register: async (userData) => {
    try {
      const response = await apiService.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Request password reset
   * 
   * @param {Object} data Request data
   * @param {string} data.email Email
   * @returns {Promise<Object>} Response with success message
   */
  forgotPassword: async (data) => {
    try {
      const response = await apiService.post('/auth/forgot-password', data);
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  /**
   * Reset password with token
   * 
   * @param {Object} data Reset data
   * @param {string} data.token Reset token
   * @param {string} data.password New password
   * @returns {Promise<Object>} Response with success message
   */
  resetPassword: async (data) => {
    try {
      const response = await apiService.post('/auth/reset-password', data);
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  /**
   * Validate auth token
   * 
   * @returns {Promise<Object>} Response with validation result
   */
  validateToken: async () => {
    try {
      const response = await apiService.post('/auth/validate-token');
      return response.data;
    } catch (error) {
      console.error('Token validation error:', error);
      return { valid: false };
    }
  },

  /**
   * Update user profile
   * 
   * @param {Object} userData Updated user data
   * @returns {Promise<Object>} Updated user profile
   */
  updateProfile: async (userData) => {
    try {
      const response = await apiService.put('/users/profile', userData);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  /**
   * Change password
   * 
   * @param {Object} passwords Password data
   * @param {string} passwords.currentPassword Current password
   * @param {string} passwords.newPassword New password
   * @returns {Promise<Object>} Response with success message
   */
  changePassword: async (passwords) => {
    try {
      const response = await apiService.post('/users/change-password', passwords);
      return response.data;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },

  /**
   * Upload profile image
   * 
   * @param {FormData} formData Form data with image
   * @param {Function} onProgress Progress callback
   * @returns {Promise<Object>} Response with image URL
   */
  uploadProfileImage: async (formData, onProgress) => {
    try {
      const response = await apiService.uploadFile('/users/profile/image', formData, onProgress);
      return response.data;
    } catch (error) {
      console.error('Upload profile image error:', error);
      throw error;
    }
  }
};