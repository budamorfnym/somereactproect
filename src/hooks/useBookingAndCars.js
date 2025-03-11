import { useContext } from 'react';
import { BookingAndCarsContext } from '../contexts/BookingAndCarsContext';

/**
 * Хук для доступа к объединенному контексту бронирований и автомобилей
 * @returns {Object} Объект с состоянием и методами для бронирований и автомобилей
 */
export const useBookingAndCars = () => {
  const context = useContext(BookingAndCarsContext);
  
  if (!context) {
    throw new Error('useBookingAndCars должен использоваться внутри BookingAndCarsProvider');
  }
  
  return context;
};

/**
 * Хук только для доступа к функциональности бронирований
 * Для обратной совместимости
 */
export const useBooking = () => {
  const {
    bookings,
    availableSlots,
    getUserBookings,
    createBooking,
    cancelBooking,
    getBookingDetails,
    getAvailableSlots,
    loading
  } = useBookingAndCars();
  
  return {
    bookings,
    availableSlots,
    getUserBookings,
    createBooking,
    cancelBooking,
    getBookingDetails,
    getAvailableSlots,
    loading
  };
};

/**
 * Хук только для доступа к функциональности автомобилей
 * Для обратной совместимости
 */
export const useCars = () => {
  const {
    cars,
    selectedCar,
    setSelectedCar,
    loadUserCars,
    getCarById,
    addCar,
    updateCar,
    deleteCar,
    loading
  } = useBookingAndCars();
  
  return {
    cars,
    selectedCar,
    setSelectedCar,
    loadUserCars,
    getCarById,
    addCar,
    updateCar,
    deleteCar,
    loading
  };
};

export default useBookingAndCars;