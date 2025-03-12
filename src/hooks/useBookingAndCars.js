import { useContext } from 'react';
import { BookingAndCarsContext } from '../contexts/BookingAndCarsContext';

/**
 * Hook for accessing the unified booking and cars context
 * @returns {Object} Object with state and methods for bookings and cars
 */
export const useBookingAndCars = () => {
  const context = useContext(BookingAndCarsContext);
  
  if (!context) {
    throw new Error('useBookingAndCars must be used within BookingAndCarsProvider');
  }
  
  return context;
};

/**
 * Hook for accessing only booking functionality
 * For backward compatibility
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
 * Hook for accessing only cars functionality
 * For backward compatibility
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