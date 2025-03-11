import api from '../config/api';

export const timeSlotsService = {
  /**
   * Get available time slots for a specific date
   * 
   * @param {string} date Date in YYYY-MM-DD format
   * @param {string|null} serviceId Service ID (optional)
   * @param {number|null} duration Service duration in minutes (optional)
   * @returns {Promise<Array>} List of available time slots
   */
  getAvailableTimeSlots: async (date, serviceId = null, duration = null) => {
    let url = `/time-slots/available?date=${date}`;
    
    if (serviceId) url += `&serviceId=${serviceId}`;
    if (duration) url += `&duration=${duration}`;
    
    const response = await api.get(url);
    return response.data;
  },

  /**
   * Check if a specific time slot is available
   * 
   * @param {string} date Date in YYYY-MM-DD format
   * @param {string} time Time in HH:MM format
   * @param {string|null} serviceId Service ID (optional)
   * @param {number|null} duration Service duration in minutes (optional)
   * @returns {Promise<boolean>} Whether the slot is available
   */
  checkSlotAvailability: async (date, time, serviceId = null, duration = null) => {
    let url = `/time-slots/check?date=${date}&time=${time}`;
    
    if (serviceId) url += `&serviceId=${serviceId}`;
    if (duration) url += `&duration=${duration}`;
    
    const response = await api.get(url);
    return response.data.available;
  },

  /**
   * Reserve a time slot temporarily during booking process
   * 
   * @param {string} date Date in YYYY-MM-DD format
   * @param {string} time Time in HH:MM format
   * @param {number} duration Service duration in minutes
   * @returns {Promise<Object>} Reservation result
   */
  reserveTimeSlot: async (date, time, duration) => {
    const response = await api.post('/time-slots/reserve', { date, time, duration });
    return response.data;
  }
};