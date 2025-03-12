// src/hooks/useData.js
import { useContext } from 'react';
import { DataContext } from '../contexts/DataContext';

// Общий хук для доступа ко всем данным
export const useData = () => {
  return useContext(DataContext);
};

// Хуки для обратной совместимости
export const useServices = () => {
  const {
    services,
    categories,
    activeCategory,
    setCategory,
    getServicesByCategory,
    getServiceOptions,
    getServiceById,
    loading
  } = useContext(DataContext);
  
  return {
    services,
    categories,
    activeCategory,
    setCategory,
    getServicesByCategory,
    getServiceOptions,
    getServiceById,
    loading
  };
};

export const useBooking = () => {
  const {
    bookings,
    availableSlots,
    getUserBookings,
    createBooking,
    loading
  } = useContext(DataContext);
  
  return {
    bookings,
    availableSlots,
    getUserBookings,
    createBooking,
    loading
  };
};

export const useCars = () => {
  const {
    cars,
    selectedCar,
    setSelectedCar,
    loadUserCars,
    loading
  } = useContext(DataContext);
  
  return {
    cars,
    selectedCar,
    setSelectedCar,
    loadUserCars,
    loading
  };
};

export const useLoyalty = () => {
  const {
    points,
    status,
    history,
    privileges,
    loadLoyaltyData,
    loading
  } = useContext(DataContext);
  
  return {
    points,
    status,
    history,
    privileges,
    loadLoyaltyData,
    loading
  };
};

export const useCompany = () => {
  const { companyInfo } = useContext(DataContext);
  return { companyInfo };
};