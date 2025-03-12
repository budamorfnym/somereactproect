import apiService from './api';

/**
 * Enhanced booking service with comprehensive API integration
 */
export const bookingService = {
  /**
   * Create a new booking
   * 
   * @param {Object} bookingData Booking data
   * @param {string} bookingData.serviceId Service ID
   * @param {Array} bookingData.options Selected option IDs
   * @param {string} bookingData.date Date in YYYY-MM-DD format
   * @param {string} bookingData.time Time in HH:MM format
   * @param {string} bookingData.carId Car ID
   * @param {string} bookingData.comment Optional comment
   * @param {number} bookingData.pointsToUse Loyalty points to use
   * @returns {Promise<Object>} Created booking data
   */
  createBooking: async (bookingData) => {
    try {
      const response = await apiService.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 409) {
        throw new Error('Выбранное время уже занято. Пожалуйста, выберите другое время');
      } else if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Не удалось создать запись');
    }
  },
  
  /**
   * Get all bookings for the current user
   * 
   * @param {Object} filters Optional filters
   * @param {string} filters.status Filter by status
   * @param {string} filters.dateFrom Filter by date from
   * @param {string} filters.dateTo Filter by date to
   * @returns {Promise<Array>} List of bookings
   */
  getUserBookings: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Add filters to query params if provided
      for (const [key, value] of Object.entries(filters)) {
        if (value) {
          params.append(key, value);
        }
      }
      
      const response = await apiService.get('/bookings/user', { params });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Не удалось загрузить список записей');
    }
  },
  
  /**
   * Get booking details by ID
   * 
   * @param {string} bookingId Booking ID
   * @returns {Promise<Object>} Booking details
   */
  getBookingDetails: async (bookingId) => {
    try {
      const response = await apiService.get(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new Error('Запись не найдена');
      } else if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Не удалось загрузить детали записи');
    }
  },
  
  /**
   * Cancel a booking
   * 
   * @param {string} bookingId Booking ID
   * @param {string} reason Cancellation reason
   * @returns {Promise<Object>} Cancellation result
   */
  cancelBooking: async (bookingId, reason = '') => {
    try {
      const response = await apiService.put(`/bookings/${bookingId}/cancel`, { reason });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        throw new Error('Невозможно отменить эту запись');
      } else if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Не удалось отменить запись');
    }
  },
  
  /**
   * Reschedule a booking
   * 
   * @param {string} bookingId Booking ID
   * @param {Object} data New date and time
   * @param {string} data.date New date in YYYY-MM-DD format
   * @param {string} data.time New time in HH:MM format
   * @returns {Promise<Object>} Updated booking data
   */
  rescheduleBooking: async (bookingId, data) => {
    try {
      const response = await apiService.put(`/bookings/${bookingId}/reschedule`, data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 409) {
        throw new Error('Выбранное время уже занято. Пожалуйста, выберите другое время');
      } else if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Не удалось перенести запись');
    }
  },
  
  /**
   * Get available time slots for a specific date
   * 
   * @param {string} date Date in YYYY-MM-DD format
   * @param {string} serviceId Optional service ID for duration-aware slots
   * @param {number} duration Optional service duration in minutes
   * @returns {Promise<Array>} List of available time slots
   */
  getAvailableSlots: async (date, serviceId = null, duration = null) => {
    try {
      let url = `/bookings/available-slots?date=${date}`;
      
      if (serviceId) {
        url += `&serviceId=${serviceId}`;
      }
      
      if (duration) {
        url += `&duration=${duration}`;
      }
      
      const response = await apiService.get(url);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Не удалось загрузить доступные слоты времени');
    }
  },
  
  /**
   * Get booking stats for the current user
   * 
   * @returns {Promise<Object>} Booking statistics
   */
  getUserBookingStats: async () => {
    try {
      const response = await apiService.get('/bookings/stats');
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Не удалось загрузить статистику записей');
    }
  },
  
  /**
   * Rate a completed booking
   * 
   * @param {string} bookingId Booking ID
   * @param {Object} data Rating data
   * @param {number} data.rating Rating (1-5)
   * @param {string} data.comment Optional comment
   * @returns {Promise<Object>} Rating result
   */
  rateBooking: async (bookingId, data) => {
    try {
      const response = await apiService.post(`/bookings/${bookingId}/rate`, data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        throw new Error('Можно оценить только завершенные записи');
      } else if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Не удалось оценить запись');
    }
  },
  
  /**
   * Add additional options to an existing booking
   * 
   * @param {string} bookingId Booking ID
   * @param {Array} optionIds Option IDs to add
   * @returns {Promise<Object>} Updated booking data
   */
  addOptionsToBooking: async (bookingId, optionIds) => {
    try {
      const response = await apiService.post(`/bookings/${bookingId}/options`, { optionIds });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Не удалось добавить опции к записи');
    }
  },
  
  /**
   * Remove options from an existing booking
   * 
   * @param {string} bookingId Booking ID
   * @param {Array} optionIds Option IDs to remove
   * @returns {Promise<Object>} Updated booking data
   */
  removeOptionsFromBooking: async (bookingId, optionIds) => {
    try {
      const response = await apiService.delete(`/bookings/${bookingId}/options`, { 
        data: { optionIds } 
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Не удалось удалить опции из записи');
    }
  },
  
  /**
   * Update booking comment
   * 
   * @param {string} bookingId Booking ID
   * @param {string} comment New comment
   * @returns {Promise<Object>} Updated booking data
   */
  updateBookingComment: async (bookingId, comment) => {
    try {
      const response = await apiService.put(`/bookings/${bookingId}/comment`, { comment });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Не удалось обновить комментарий к записи');
    }
  },
  
  // Admin-specific methods
  
  /**
   * Get all bookings (admin only)
   * 
   * @param {Object} filters Optional filters
   * @param {string} filters.status Filter by status
   * @param {string} filters.dateFrom Filter by date from
   * @param {string} filters.dateTo Filter by date to
   * @param {string} filters.search Search term
   * @param {number} filters.page Page number
   * @param {number} filters.limit Items per page
   * @returns {Promise<Object>} Paginated bookings data
   */
  getAllBookings: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Add filters to query params
      for (const [key, value] of Object.entries(filters)) {
        if (value) {
          params.append(key, value);
        }
      }
      
      const response = await apiService.get('/admin/bookings', { params });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Не удалось загрузить список записей');
    }
  },
  
  /**
   * Update booking status (admin only)
   * 
   * @param {string} bookingId Booking ID
   * @param {Object} data Status update data
   * @param {string} data.status New status
   * @param {string} data.comment Optional comment
   * @returns {Promise<Object>} Updated booking data
   */
  updateBookingStatus: async (bookingId, data) => {
    try {
      const response = await apiService.put(`/admin/bookings/${bookingId}/status`, data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        throw new Error('Недопустимый статус или переход статуса');
      } else if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Не удалось обновить статус записи');
    }
  },
  
  /**
   * Get booking dashboard data (admin only)
   * 
   * @param {string} period Period (today, week, month, year)
   * @returns {Promise<Object>} Dashboard data
   */
  getBookingDashboard: async (period = 'week') => {
    try {
      const response = await apiService.get(`/admin/dashboard/bookings?period=${period}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Не удалось загрузить данные дашборда');
    }
  }
};

export default bookingService;