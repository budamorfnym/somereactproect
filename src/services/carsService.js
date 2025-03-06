import apiService from './api';

export const carsService = {
  /**
   * Get all cars for current user
   * 
   * @returns {Promise<Array>} List of user's cars
   */
  getUserCars: async () => {
    try {
      const response = await apiService.get('/cars');
      return response.data;
    } catch (error) {
      console.error('Error fetching user cars:', error);
      throw error;
    }
  },

  /**
   * Get car by ID
   * 
   * @param {string} carId Car ID
   * @returns {Promise<Object>} Car details
   */
  getCarById: async (carId) => {
    try {
      const response = await apiService.get(`/cars/${carId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching car with ID ${carId}:`, error);
      throw error;
    }
  },

  /**
   * Add new car
   * 
   * @param {Object} carData Car data
   * @returns {Promise<Object>} Added car details
   */
  addCar: async (carData) => {
    try {
      const response = await apiService.post('/cars', carData);
      return response.data;
    } catch (error) {
      console.error('Error adding car:', error);
      throw error;
    }
  },

  /**
   * Update car details
   * 
   * @param {string} carId Car ID
   * @param {Object} carData Updated car data
   * @returns {Promise<Object>} Updated car details
   */
  updateCar: async (carId, carData) => {
    try {
      const response = await apiService.put(`/cars/${carId}`, carData);
      return response.data;
    } catch (error) {
      console.error(`Error updating car with ID ${carId}:`, error);
      throw error;
    }
  },

  /**
   * Delete car
   * 
   * @param {string} carId Car ID
   * @returns {Promise<void>}
   */
  deleteCar: async (carId) => {
    try {
      await apiService.delete(`/cars/${carId}`);
    } catch (error) {
      console.error(`Error deleting car with ID ${carId}:`, error);
      throw error;
    }
  },

  /**
   * Upload car image
   * 
   * @param {string} carId Car ID
   * @param {FormData} formData Form data with image
   * @param {Function} onProgress Progress callback
   * @returns {Promise<Object>} Response with image URL
   */
  uploadCarImage: async (carId, formData, onProgress) => {
    try {
      const response = await apiService.uploadFile(`/cars/${carId}/image`, formData, onProgress);
      return response.data;
    } catch (error) {
      console.error(`Error uploading image for car with ID ${carId}:`, error);
      throw error;
    }
  }
};