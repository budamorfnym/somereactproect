import apiService from './api';
import { clearAuth } from '../utils/tokenStorage';

/**
 * Enhanced authentication service with proper error handling
 * and standardized response formatting
 */
export const authService = {
  /**
   * Login user with credentials
   * 
   * @param {Object} credentials User credentials
   * @param {string} credentials.email Email or phone
   * @param {string} credentials.password Password
   * @param {boolean} credentials.remember Remember login
   * @returns {Promise<Object>} User and token data
   */
  login: async (credentials) => {
    try {
      const response = await apiService.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      // Handle specific login errors with better messages
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 401) {
          throw new Error('Неверный логин или пароль');
        } else if (status === 403 && data.code === 'ACCOUNT_INACTIVE') {
          throw new Error('Аккаунт не активирован. Пожалуйста, проверьте почту для активации');
        } else if (data && data.message) {
          throw new Error(data.message);
        }
      }
      
      throw new Error('Не удалось выполнить вход. Пожалуйста, попробуйте позже');
    }
  },
  
  /**
   * Register new user
   * 
   * @param {Object} userData Registration data
   * @returns {Promise<Object>} Created user data and token
   */
  register: async (userData) => {
    try {
      const response = await apiService.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 409) {
          // Handle email/phone already in use
          if (data.code === 'EMAIL_IN_USE') {
            throw new Error('Этот email уже зарегистрирован');
          } else if (data.code === 'PHONE_IN_USE') {
            throw new Error('Этот номер телефона уже зарегистрирован');
          }
        } else if (data && data.message) {
          throw new Error(data.message);
        } else if (data && data.errors) {
          // Handle validation errors
          const firstError = data.errors[0];
          throw new Error(firstError.message || 'Ошибка в форме регистрации');
        }
      }
      
      throw new Error('Не удалось выполнить регистрацию. Пожалуйста, попробуйте позже');
    }
  },
  
  /**
   * Logout current user
   * 
   * @returns {Promise<void>}
   */
  logout: async () => {
    try {
      // Try to notify the server about logout
      await apiService.post('/auth/logout');
    } catch (error) {
      console.warn('Error during logout:', error);
    } finally {
      // Always clear auth data locally, even if server request fails
      clearAuth();
    }
  },
  
  /**
   * Validate current authentication token
   * 
   * @returns {Promise<Object>} Validation result with user data
   */
  validateToken: async () => {
    try {
      const response = await apiService.post('/auth/validate');
      return {
        valid: true,
        user: response.data.user
      };
    } catch (error) {
      return { valid: false };
    }
  },
  
  /**
   * Request password reset for email
   * 
   * @param {Object} data Password reset request data
   * @param {string} data.email User email
   * @returns {Promise<Object>} Request result
   */
  forgotPassword: async (data) => {
    try {
      const response = await apiService.post('/auth/forgot-password', data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Не удалось отправить запрос на сброс пароля');
    }
  },
  
  /**
   * Reset password with token
   * 
   * @param {Object} data Password reset data
   * @param {string} data.token Reset token from email
   * @param {string} data.password New password
   * @returns {Promise<Object>} Reset result
   */
  resetPassword: async (data) => {
    try {
      const response = await apiService.post('/auth/reset-password', data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        throw new Error('Недействительный или устаревший токен сброса пароля');
      } else if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Не удалось сбросить пароль');
    }
  },
  
  /**
   * Change password while authenticated
   * 
   * @param {Object} data Password change data
   * @param {string} data.currentPassword Current password
   * @param {string} data.newPassword New password
   * @returns {Promise<Object>} Change result
   */
  changePassword: async (data) => {
    try {
      const response = await apiService.post('/users/change-password', data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Текущий пароль указан неверно');
      } else if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Не удалось изменить пароль');
    }
  },
  
  /**
   * Update user profile
   * 
   * @param {Object} userData Updated profile data
   * @returns {Promise<Object>} Updated user data
   */
  updateProfile: async (userData) => {
    try {
      const response = await apiService.put('/users/profile', userData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Не удалось обновить профиль');
    }
  },
  
  /**
   * Upload profile image
   * 
   * @param {FormData} formData Form data with image file
   * @param {Function} onProgress Progress callback
   * @returns {Promise<Object>} Upload result with image URL
   */
  uploadProfileImage: async (formData, onProgress) => {
    try {
      const response = await apiService.uploadFile('/users/profile/image', formData, onProgress);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Не удалось загрузить изображение профиля');
    }
  },
  
  /**
   * Verify email with token
   * 
   * @param {string} token Verification token
   * @returns {Promise<Object>} Verification result
   */
  verifyEmail: async (token) => {
    try {
      const response = await apiService.post(`/auth/verify-email/${token}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        throw new Error('Недействительный или устаревший токен подтверждения');
      } else if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Не удалось подтвердить email');
    }
  },
  
  /**
   * Resend verification email
   * 
   * @param {Object} data Email data
   * @param {string} data.email User email
   * @returns {Promise<Object>} Request result
   */
  resendVerificationEmail: async (data) => {
    try {
      const response = await apiService.post('/auth/resend-verification', data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Не удалось отправить письмо для подтверждения');
    }
  }
};

export default authService;