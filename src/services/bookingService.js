import api from './api';

export const bookingService = {
  // Создание новой записи
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // Получение всех записей пользователя
  getUserBookings: async () => {
    const response = await api.get('/bookings/user');
    return response.data;
  },

  // Отмена записи
  cancelBooking: async (bookingId) => {
    const response = await api.put(`/bookings/${bookingId}/cancel`);
    return response.data;
  },

  // Получение деталей записи
  getBookingDetails: async (bookingId) => {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  },

  // Получение доступных дат и времени
  getAvailableSlots: async (date) => {
    const response = await api.get(`/bookings/available-slots?date=${date}`);
    return response.data;
  }
};