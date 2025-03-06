import React, { createContext, useState, useCallback } from 'react';
import { bookingService } from '../services/bookingService';
import { useNotification } from '../hooks/useNotification';

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const { success, error } = useNotification();
  
  // Получение записей пользователя
  const getUserBookings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await bookingService.getUserBookings();
      setBookings(data);
      return data;
    } catch (err) {
      error('Не удалось загрузить список ваших записей');
      console.error('Error loading bookings:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [error]);
  
  // Создание новой записи
  const createBooking = useCallback(async (bookingData) => {
    try {
      setLoading(true);
      const result = await bookingService.createBooking(bookingData);
      setBookings(prev => [result, ...prev]);
      success('Запись успешно создана');
      return result;
    } catch (err) {
      error('Не удалось создать запись');
      console.error('Error creating booking:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [error, success]);
  
  // Отмена записи
  const cancelBooking = useCallback(async (bookingId) => {
    try {
      setLoading(true);
      await bookingService.cancelBooking(bookingId);
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'cancelled' } 
            : booking
        )
      );
      success('Запись успешно отменена');
    } catch (err) {
      error('Не удалось отменить запись');
      console.error('Error cancelling booking:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [error, success]);
  
  // Получение деталей записи
  const getBookingDetails = useCallback(async (bookingId) => {
    try {
      setLoading(true);
      const data = await bookingService.getBookingDetails(bookingId);
      return data;
    } catch (err) {
      error('Не удалось загрузить детали записи');
      console.error('Error loading booking details:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [error]);
  
  // Получение доступных слотов времени
  const getAvailableSlots = useCallback(async (date) => {
    try {
      const data = await bookingService.getAvailableSlots(date);
      setAvailableSlots(data);
      return data;
    } catch (err) {
      error('Не удалось загрузить доступные слоты времени');
      console.error('Error loading available slots:', err);
      return [];
    }
  }, [error]);
  
  const value = {
    bookings,
    availableSlots,
    loading,
    getUserBookings,
    createBooking,
    cancelBooking,
    getBookingDetails,
    getAvailableSlots
  };
  
  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};