// src/components/services/timeSlotsService.js
import api from '../../config/api';

export const timeSlotsService = {
  /**
   * Получение доступных временных слотов на указанную дату
   * 
   * @param {string} date Дата в формате YYYY-MM-DD
   * @returns {Promise<Array>} Массив доступных временных слотов
   */
  getAvailableTimeSlots: async (date) => {
    try {
      const response = await api.get(`/time-slots/available?date=${date}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching available time slots:', error);
      throw error;
    }
  },

  /**
   * Проверка доступности конкретного временного слота
   * 
   * @param {string} date Дата в формате YYYY-MM-DD
   * @param {string} time Время в формате HH:MM
   * @returns {Promise<boolean>} Доступность слота
   */
  checkSlotAvailability: async (date, time) => {
    try {
      const response = await api.get(`/time-slots/check?date=${date}&time=${time}`);
      return response.data.available;
    } catch (error) {
      console.error('Error checking slot availability:', error);
      throw error;
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