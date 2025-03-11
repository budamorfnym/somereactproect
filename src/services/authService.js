import api from './api';

/**
 * Authentication service for handling auth-related API calls
 */
export const authService = {
  /**
   * Login with email/phone and password
   * 
   * @param {Object} credentials User credentials
   * @param {string} credentials.email Email or phone
   * @param {string} credentials.password Password
   * @param {boolean} credentials.remember Remember user
   * @returns {Promise<Object>} User data and token
   */
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * Register a new user account
   * 
   * @param {Object} userData User registration data
   * @param {string} userData.name User's name
   * @param {string} userData.email User's email
   * @param {string} userData.phone User's phone (optional)
   * @param {string} userData.password User's password
   * @returns {Promise<Object>} User data and token
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Validate current auth token
   * 
   * @returns {Promise<Object>} Validation result
   */
  validateToken: async () => {
    try {
      const response = await api.post('/auth/validate-token');
      return response.data;
    } catch (error) {
      return { valid: false };
    }
  },

  /**
   * Request password reset
   * 
   * @param {Object} data Password reset request data
   * @param {string} data.email User's email
   * @returns {Promise<Object>} Request result
   */
  forgotPassword: async (data) => {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  },

  /**
   * Reset password with token
   * 
   * @param {Object} data Password reset data
   * @param {string} data.token Reset token
   * @param {string} data.password New password
   * @returns {Promise<Object>} Reset result
   */
  resetPassword: async (data) => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  /**
   * Update user profile
   * 
   * @param {Object} userData Updated profile data
   * @returns {Promise<Object>} Updated user data
   */
  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },

  /**
   * Change user password
   * 
   * @param {Object} passwordData Password change data
   * @param {string} passwordData.currentPassword Current password
   * @param {string} passwordData.newPassword New password
   * @returns {Promise<Object>} Change result
   */
  changePassword: async (passwordData) => {
    const response = await api.post('/users/change-password', passwordData);
    return response.data;
  },

  /**
   * Upload profile image
   * 
   * @param {FormData} formData Form data with image
   * @returns {Promise<Object>} Upload result with image URL
   */
  uploadProfileImage: async (formData) => {
    const response = await api.post('/users/profile/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  /**
   * Get user profile
   * 
   * @returns {Promise<Object>} User profile data
   */
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  /**
   * Verify email with token
   * 
   * @param {string} token Verification token
   * @returns {Promise<Object>} Verification result
   */
  verifyEmail: async (token) => {
    const response = await api.post(`/auth/verify-email/${token}`);
    return response.data;
  },

  /**
   * Resend verification email
   * 
   * @param {Object} data Email data
   * @param {string} data.email User's email
   * @returns {Promise<Object>} Request result
   */
  resendVerificationEmail: async (data) => {
    const response = await api.post('/auth/resend-verification', data);
    return response.data;
  }
};