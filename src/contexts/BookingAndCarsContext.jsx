import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { bookingService } from '../services/bookingService';
import { carsService } from '../services/carsService';
import { useNotification } from '../hooks/useNotification';

export const BookingAndCarsContext = createContext();

export const BookingAndCarsProvider = ({ children }) => {
  // Booking state
  const [bookings, setBookings] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  
  // Cars state
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  
  // Shared state
  const [loading, setLoading] = useState(false);
  
  const { success, error } = useNotification();
  
  // Initial load of data when component mounts
  useEffect(() => {
    // Only load cars initially - bookings will be loaded on demand
    loadUserCars();
  }, []);
  
  // ======= Booking-related methods =======
  
  // Get user bookings
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
  
  // Create a new booking
  const createBooking = useCallback(async (bookingData) => {
    try {
      setLoading(true);
      const result = await bookingService.createBooking(bookingData);
      
      // Update bookings list with new booking
      setBookings(prev => [result, ...prev]);
      
      success('Запись успешно создана');
      return result;
    } catch (err) {
      error(err.response?.data?.message || 'Не удалось создать запись');
      console.error('Error creating booking:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [error, success]);
  
  // Cancel a booking
  const cancelBooking = useCallback(async (bookingId, reason = '') => {
    try {
      setLoading(true);
      await bookingService.cancelBooking(bookingId, reason);
      
      // Update booking status in state
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'cancelled' } 
            : booking
        )
      );
      
      success('Запись успешно отменена');
      return true;
    } catch (err) {
      error(err.response?.data?.message || 'Не удалось отменить запись');
      console.error('Error cancelling booking:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [error, success]);
  
  // Get booking details
  const getBookingDetails = useCallback(async (bookingId) => {
    try {
      setLoading(true);
      const data = await bookingService.getBookingDetails(bookingId);
      return data;
    } catch (err) {
      error(err.response?.data?.message || 'Не удалось загрузить детали записи');
      console.error('Error loading booking details:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [error]);
  
  // Get available time slots
  const getAvailableSlots = useCallback(async (date) => {
    try {
      setLoading(true);
      const data = await bookingService.getAvailableSlots(date);
      setAvailableSlots(data);
      return data;
    } catch (err) {
      error('Не удалось загрузить доступные слоты времени');
      console.error('Error loading available slots:', err);
      
      // Return empty array instead of throwing
      setAvailableSlots([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [error]);
  
  // ======= Car-related methods =======
  
  // Load user cars
  const loadUserCars = useCallback(async () => {
    try {
      setLoading(true);
      const data = await carsService.getUserCars();
      setCars(data);
      
      // If there are cars but no selected car, select the first one
      if (data.length > 0 && !selectedCar) {
        setSelectedCar(data[0]);
      }
      
      return data;
    } catch (err) {
      error('Не удалось загрузить список автомобилей');
      console.error('Error loading user cars:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [error, selectedCar]);
  
  // Get car by ID
  const getCarById = useCallback((carId) => {
    return cars.find(car => car.id === carId) || null;
  }, [cars]);
  
  // Add new car
  const addCar = useCallback(async (carData) => {
    try {
      setLoading(true);
      const newCar = await carsService.addCar(carData);
      
      // Update cars state with new car
      setCars(prevCars => [...prevCars, newCar]);
      
      // If this is the first car, set it as selected
      if (cars.length === 0) {
        setSelectedCar(newCar);
      }
      
      success('Автомобиль успешно добавлен');
      return newCar;
    } catch (err) {
      error('Не удалось добавить автомобиль');
      console.error('Error adding car:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cars.length, error, success]);
  
  // Update car
  const updateCar = useCallback(async (carId, carData) => {
    try {
      setLoading(true);
      const updatedCar = await carsService.updateCar(carId, carData);
      
      // Update cars state with updated car
      setCars(prevCars => 
        prevCars.map(car => car.id === carId ? updatedCar : car)
      );
      
      // Update selectedCar if it's the one being updated
      if (selectedCar && selectedCar.id === carId) {
        setSelectedCar(updatedCar);
      }
      
      success('Автомобиль успешно обновлен');
      return updatedCar;
    } catch (err) {
      error('Не удалось обновить автомобиль');
      console.error('Error updating car:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [error, selectedCar, success]);
  
  // Delete car
  const deleteCar = useCallback(async (carId) => {
    try {
      setLoading(true);
      await carsService.deleteCar(carId);
      
      // Update cars state by removing deleted car
      const updatedCars = cars.filter(car => car.id !== carId);
      setCars(updatedCars);
      
      // If the deleted car was selected, select another one if available
      if (selectedCar && selectedCar.id === carId) {
        setSelectedCar(updatedCars.length > 0 ? updatedCars[0] : null);
      }
      
      success('Автомобиль успешно удален');
    } catch (err) {
      error('Не удалось удалить автомобиль');
      console.error('Error deleting car:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cars, error, selectedCar, success]);
  
  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    // Booking state and methods
    bookings,
    availableSlots,
    getUserBookings,
    createBooking,
    cancelBooking,
    getBookingDetails,
    getAvailableSlots,
    
    // Cars state and methods
    cars,
    selectedCar,
    setSelectedCar,
    loadUserCars,
    getCarById,
    addCar,
    updateCar,
    deleteCar,
    
    // Shared state
    loading
  }), [
    // Booking deps
    bookings, 
    availableSlots, 
    getUserBookings,
    createBooking,
    cancelBooking,
    getBookingDetails,
    getAvailableSlots,
    
    // Cars deps
    cars,
    selectedCar,
    loadUserCars,
    getCarById,
    addCar,
    updateCar,
    deleteCar,
    
    // Shared deps
    loading
  ]);
  
  return (
    <BookingAndCarsContext.Provider value={contextValue}>
      {children}
    </BookingAndCarsContext.Provider>
  );
};