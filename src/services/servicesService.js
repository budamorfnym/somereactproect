import apiService from './api';

export const servicesService = {
  /**
   * Get all available services
   * 
   * @returns {Promise<Array>} List of services
   */
  getAllServices: async () => {
    try {
      const response = await apiService.get('/services');
      return response.data;
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  },

  /**
   * Get services by category
   * 
   * @param {string} categoryId Category ID
   * @returns {Promise<Array>} List of services in category
   */
  getServicesByCategory: async (categoryId) => {
    try {
      const response = await apiService.get(`/services/category/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching services for category ${categoryId}:`, error);
      throw error;
    }
  },

  /**
   * Get service details by ID
   * 
   * @param {string} serviceId Service ID
   * @returns {Promise<Object>} Service details
   */
  getServiceById: async (serviceId) => {
    try {
      const response = await apiService.get(`/services/${serviceId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching service with ID ${serviceId}:`, error);
      throw error;
    }
  },

  /**
   * Get options for a service
   * 
   * @param {string} serviceId Service ID
   * @returns {Promise<Array>} List of service options
   */
  getServiceOptions: async (serviceId) => {
    try {
      const response = await apiService.get(`/services/${serviceId}/options`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching options for service ${serviceId}:`, error);
      throw error;
    }
  },

  /**
   * Get all service categories
   * 
   * @returns {Promise<Array>} List of categories
   */
  getCategories: async () => {
    try {
      const response = await apiService.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  /**
   * Get category by ID
   * 
   * @param {string} categoryId Category ID
   * @returns {Promise<Object>} Category details
   */
  getCategoryById: async (categoryId) => {
    try {
      const response = await apiService.get(`/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category with ID ${categoryId}:`, error);
      throw error;
    }
  },

  // Admin-only methods

  /**
   * Create new service (admin only)
   * 
   * @param {Object} serviceData Service data
   * @returns {Promise<Object>} Created service details
   */
  createService: async (serviceData) => {
    try {
      const response = await apiService.post('/admin/services', serviceData);
      return response.data;
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  },

  /**
   * Update service (admin only)
   * 
   * @param {string} serviceId Service ID
   * @param {Object} serviceData Updated service data
   * @returns {Promise<Object>} Updated service details
   */
  updateService: async (serviceId, serviceData) => {
    try {
      const response = await apiService.put(`/admin/services/${serviceId}`, serviceData);
      return response.data;
    } catch (error) {
      console.error(`Error updating service with ID ${serviceId}:`, error);
      throw error;
    }
  },

  /**
   * Delete service (admin only)
   * 
   * @param {string} serviceId Service ID
   * @returns {Promise<void>}
   */
  deleteService: async (serviceId) => {
    try {
      await apiService.delete(`/admin/services/${serviceId}`);
    } catch (error) {
      console.error(`Error deleting service with ID ${serviceId}:`, error);
      throw error;
    }
  },

  /**
   * Create new service option (admin only)
   * 
   * @param {string} serviceId Service ID
   * @param {Object} optionData Option data
   * @returns {Promise<Object>} Created option details
   */
  createServiceOption: async (serviceId, optionData) => {
    try {
      const response = await apiService.post(`/admin/services/${serviceId}/options`, optionData);
      return response.data;
    } catch (error) {
      console.error(`Error creating option for service ${serviceId}:`, error);
      throw error;
    }
  },

  /**
   * Update service option (admin only)
   * 
   * @param {string} serviceId Service ID
   * @param {string} optionId Option ID
   * @param {Object} optionData Updated option data
   * @returns {Promise<Object>} Updated option details
   */
  updateServiceOption: async (serviceId, optionId, optionData) => {
    try {
      const response = await apiService.put(`/admin/services/${serviceId}/options/${optionId}`, optionData);
      return response.data;
    } catch (error) {
      console.error(`Error updating option ${optionId} for service ${serviceId}:`, error);
      throw error;
    }
  },

  /**
   * Delete service option (admin only)
   * 
   * @param {string} serviceId Service ID
   * @param {string} optionId Option ID
   * @returns {Promise<void>}
   */
  deleteServiceOption: async (serviceId, optionId) => {
    try {
      await apiService.delete(`/admin/services/${serviceId}/options/${optionId}`);
    } catch (error) {
      console.error(`Error deleting option ${optionId} for service ${serviceId}:`, error);
      throw error;
    }
  },

  /**
   * Create new category (admin only)
   * 
   * @param {Object} categoryData Category data
   * @returns {Promise<Object>} Created category details
   */
  createCategory: async (categoryData) => {
    try {
      const response = await apiService.post('/admin/categories', categoryData);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  /**
   * Update category (admin only)
   * 
   * @param {string} categoryId Category ID
   * @param {Object} categoryData Updated category data
   * @returns {Promise<Object>} Updated category details
   */
  updateCategory: async (categoryId, categoryData) => {
    try {
      const response = await apiService.put(`/admin/categories/${categoryId}`, categoryData);
      return response.data;
    } catch (error) {
      console.error(`Error updating category with ID ${categoryId}:`, error);
      throw error;
    }
  },

  /**
   * Delete category (admin only)
   * 
   * @param {string} categoryId Category ID
   * @returns {Promise<void>}
   */
  deleteCategory: async (categoryId) => {
    try {
      await apiService.delete(`/admin/categories/${categoryId}`);
    } catch (error) {
      console.error(`Error deleting category with ID ${categoryId}:`, error);
      throw error;
    }
  }
};