import api from '../../config/api';

export const timeSlotsService = {
  /**
   * Получение доступных временных слотов на указанную дату
   * 
   * @param {string} date Дата в формате YYYY-MM-DD
   * @param {string|null} serviceId ID услуги (опционально)
   * @param {number|null} duration Длительность услуги в минутах (опционально)
   * @returns {Promise<Array>} Массив доступных временных слотов
   */
  getAvailableTimeSlots: async (date, serviceId = null, duration = null) => {
    try {
      let url = `/time-slots/available?date=${date}`;
      
      if (serviceId) url += `&serviceId=${serviceId}`;
      if (duration) url += `&duration=${duration}`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching available time slots:', error);
      
      // Temporary mock data for development
      return ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
    }
  },

  /**
   * Проверка доступности конкретного временного слота
   * 
   * @param {string} date Дата в формате YYYY-MM-DD
   * @param {string} time Время в формате HH:MM
   * @param {string|null} serviceId ID услуги (опционально)
   * @param {number|null} duration Длительность услуги в минутах (опционально)
   * @returns {Promise<boolean>} Доступность слота
   */
  checkSlotAvailability: async (date, time, serviceId = null, duration = null) => {
    try {
      let url = `/time-slots/check?date=${date}&time=${time}`;
      
      if (serviceId) url += `&serviceId=${serviceId}`;
      if (duration) url += `&duration=${duration}`;
      
      const response = await api.get(url);
      return response.data.available;
    } catch (error) {
      console.error('Error checking slot availability:', error);
      return true; // Assume available in development
    }
  },

  /**
   * Блокирование временного слота для бронирования
   * (используется при создании записи)
   * 
   * @param {string} date Дата в формате YYYY-MM-DD
   * @param {string} time Время в формате HH:MM
   * @param {number} duration Продолжительность в минутах
   * @returns {Promise<Object>} Результат блокировки
   */
  reserveTimeSlot: async (date, time, duration) => {
    try {
      const response = await api.post('/time-slots/reserve', { date, time, duration });
      return response.data;
    } catch (error) {
      console.error('Error reserving time slot:', error);
      throw error;
    }
  }
};