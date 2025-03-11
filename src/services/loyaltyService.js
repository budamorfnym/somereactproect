import api from './api';

/**
 * Service for handling loyalty-related API calls
 */
export const loyaltyService = {
  /**
   * Get current user's loyalty points balance
   * 
   * @returns {Promise<Object>} Loyalty points data
   */
  getLoyaltyPoints: async () => {
    const response = await api.get('/loyalty/points');
    return response.data;
  },

  /**
   * Get current user's loyalty status information
   * 
   * @returns {Promise<Object>} Loyalty status data
   */
  getLoyaltyStatus: async () => {
    const response = await api.get('/loyalty/status');
    return response.data;
  },

  /**
   * Get user's loyalty points history
   * 
   * @returns {Promise<Array>} History of points transactions
   */
  getPointsHistory: async () => {
    const response = await api.get('/loyalty/history');
    return response.data;
  },

  /**
   * Get available loyalty privileges
   * 
   * @returns {Promise<Array>} List of available privileges
   */
  getLoyaltyPrivileges: async () => {
    const response = await api.get('/loyalty/privileges');
    return response.data;
  },

  /**
   * Use loyalty points to pay for booking
   * 
   * @param {string} bookingId ID of the booking
   * @param {number} pointsAmount Amount of points to use
   * @returns {Promise<Object>} Result including remaining points
   */
  usePoints: async (bookingId, pointsAmount) => {
    const response = await api.post('/loyalty/use-points', { bookingId, pointsAmount });
    return response.data;
  }
};