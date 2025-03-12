// src/contexts/DataContext.jsx
import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { servicesService } from '../services/servicesService';
import { bookingService } from '../services/bookingService';
import { carsService } from '../services/carsService';
import { loyaltyService } from '../services/loyaltyService';
import { useNotification } from '../hooks/useNotification';

// Создаем контекст
export const DataContext = createContext();

export const DataProvider = ({ children, companyInfo }) => {
  // Состояние из ServicesContext
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Состояние из BookingContext и CarsContext
  const [bookings, setBookings] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  
  // Состояние из LoyaltyContext
  const [points, setPoints] = useState(0);
  const [status, setStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const [privileges, setPrivileges] = useState([]);
  
  // Общее состояние загрузки
  const [loading, setLoading] = useState(true);
  
  const { error, success } = useNotification();
  
  // Загрузка начальных данных
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        
        // Загружаем сервисы и категории
        const [servicesData, categoriesData] = await Promise.all([
          servicesService.getAllServices(),
          servicesService.getCategories()
        ]);
        
        // Добавляем категорию "Все"
        const allCategories = [
          { id: 'all', name: 'Все услуги', icon: '🚗' },
          ...categoriesData
        ];
        
        setServices(servicesData);
        setCategories(allCategories);
      } catch (err) {
        error('Не удалось загрузить данные приложения');
        console.error('Error loading initial data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, [error]);

  // Методы из ServicesContext
  const getServicesByCategory = useCallback((categoryId = 'all') => {
    if (categoryId === 'all') {
      return services;
    }
    return services.filter(service => service.category === categoryId);
  }, [services]);
  
  const getServiceOptions = useCallback(async (serviceId) => {
    try {
      return await servicesService.getServiceOptions(serviceId);
    } catch (err) {
      error('Не удалось загрузить опции услуги');
      console.error('Error loading service options:', err);
      return [];
    }
  }, [error]);
  
  const setCategory = useCallback((categoryId) => {
    setActiveCategory(categoryId);
  }, []);
  
  const getServiceById = useCallback((serviceId) => {
    return services.find(service => service.id === serviceId) || null;
  }, [services]);
  
  // Методы из BookingContext
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
  
  // Методы из CarsContext
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
  
  // Методы из LoyaltyContext
  const loadLoyaltyData = useCallback(async () => {
    try {
      setLoading(true);
      const [pointsData, statusData, historyData, privilegesData] = await Promise.all([
        loyaltyService.getLoyaltyPoints(),
        loyaltyService.getLoyaltyStatus(),
        loyaltyService.getPointsHistory(),
        loyaltyService.getLoyaltyPrivileges()
      ]);
      
      setPoints(pointsData.points);
      setStatus(statusData);
      setHistory(historyData);
      setPrivileges(privilegesData);
    } catch (err) {
      error('Не удалось загрузить данные программы лояльности');
    } finally {
      setLoading(false);
    }
  }, [error]);

  // Объединяем всё состояние в один объект
  const contextValue = useMemo(() => ({
    // ServicesContext
    services,
    categories,
    activeCategory,
    setCategory,
    getServicesByCategory,
    getServiceOptions,
    getServiceById,
    
    // BookingContext
    bookings,
    availableSlots,
    getUserBookings,
    createBooking,
    
    // CarsContext
    cars,
    selectedCar,
    setSelectedCar,
    loadUserCars,
    
    // LoyaltyContext
    points,
    status,
    history,
    privileges,
    loadLoyaltyData,
    
    // Общее состояние
    loading,
    companyInfo
  }), [
    // ServicesContext deps
    services, categories, activeCategory, setCategory, getServicesByCategory,
    getServiceOptions, getServiceById,
    
    // BookingContext deps
    bookings, availableSlots, getUserBookings, createBooking,
    
    // CarsContext deps
    cars, selectedCar, setSelectedCar, loadUserCars,
    
    // LoyaltyContext deps
    points, status, history, privileges, loadLoyaltyData,
    
    // Общее состояние
    loading, companyInfo
  ]);

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};