// src/services/loyaltyService.js
import api from './api';

export const loyaltyService = {
  /**
   * Получение текущего баланса баллов лояльности пользователя
   * 
   * @returns {Promise<Object>} Информация о баллах
   */
  getLoyaltyPoints: async () => {
    try {
      const response = await api.get('/loyalty/points');
      return response.data;
    } catch (error) {
      console.error('Error fetching loyalty points:', error);
      
      // Временная заглушка для разработки
      return { points: 250 };
    }
  },

  /**
   * Получение текущего статуса лояльности пользователя
   * 
   * @returns {Promise<Object>} Информация о статусе
   */
  getLoyaltyStatus: async () => {
    try {
      const response = await api.get('/loyalty/status');
      return response.data;
    } catch (error) {
      console.error('Error fetching loyalty status:', error);
      
      // Временная заглушка для разработки
      return {
        name: 'Bronze',
        description: 'Бронзовый уровень',
        progress: 35,
        pointsEarned: 3500,
        pointsRequired: 10000,
        nextLevel: 'Silver'
      };
    }
  },

  /**
   * Получение истории баллов
   * 
   * @returns {Promise<Array>} История начислений и списаний
   */
  getPointsHistory: async () => {
    try {
      const response = await api.get('/loyalty/history');
      return response.data;
    } catch (error) {
      console.error('Error fetching points history:', error);
      
      // Временная заглушка для разработки
      return [
        { id: 1, date: '2023-08-01', amount: 120, type: 'credit', description: 'Начисление за комплексную мойку' },
        { id: 2, date: '2023-07-15', amount: 50, type: 'debit', description: 'Списание для оплаты услуги' },
        { id: 3, date: '2023-07-01', amount: 200, type: 'credit', description: 'Начисление за полировку' }
      ];
    }
  },

  /**
   * Получение доступных привилегий
   * 
   * @returns {Promise<Array>} Список привилегий
   */
  getLoyaltyPrivileges: async () => {
    try {
      const response = await api.get('/loyalty/privileges');
      return response.data;
    } catch (error) {
      console.error('Error fetching loyalty privileges:', error);
      
      // Временная заглушка для разработки
      return [
        { id: 1, name: 'Скидка 5%', description: 'На все услуги', isAvailable: true, requiredStatus: 'Bronze' },
        { id: 2, name: 'Приоритетная запись', description: 'Запись без очереди', isAvailable: false, requiredStatus: 'Silver' },
        { id: 3, name: 'Бесплатная чистка дисков', description: 'При заказе комплексной мойки', isAvailable: false, requiredStatus: 'Gold' }
      ];
    }
  },

  /**
   * Использование баллов для оплаты услуги
   * 
   * @param {string} bookingId ID записи
   * @param {number} pointsAmount Количество баллов
   * @returns {Promise<Object>} Результат использования баллов
   */
  usePoints: async (bookingId, pointsAmount) => {
    try {
      const response = await api.post('/loyalty/use-points', { bookingId, pointsAmount });
      return response.data;
    } catch (error) {
      console.error('Error using loyalty points:', error);
      throw error;
    }
  }
};