import React, { createContext, useState, useEffect, useCallback } from 'react';
import { servicesService } from '../services/servicesService';
import { useNotification } from '../hooks/useNotification';

export const ServicesContext = createContext();

export const ServicesProvider = ({ children }) => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const { error } = useNotification();

  // Load services and categories on component mount
  useEffect(() => {
    loadServices();
    loadCategories();
  }, []);

  // Load all services
  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      const data = await servicesService.getAllServices();
      setServices(data);
    } catch (err) {
      error('Не удалось загрузить список услуг');
      console.error('Error loading services:', err);
    } finally {
      setLoading(false);
    }
  }, [error]);

  // Load all categories
  const loadCategories = useCallback(async () => {
    try {
      const data = await servicesService.getCategories();
      // Add "All" category at the beginning
      const allCategories = [
        { id: 'all', name: 'Все услуги', icon: '🚗' },
        ...data
      ];
      setCategories(allCategories);
    } catch (err) {
      error('Не удалось загрузить категории услуг');
      console.error('Error loading categories:', err);
    }
  }, [error]);

  // Get services by category
  const getServicesByCategory = useCallback((categoryId = 'all') => {
    if (categoryId === 'all') {
      return services;
    }
    return services.filter(service => service.category === categoryId);
  }, [services]);

  // Get service options
  const getServiceOptions = useCallback(async (serviceId) => {
    try {
      return await servicesService.getServiceOptions(serviceId);
    } catch (err) {
      error('Не удалось загрузить опции услуги');
      console.error('Error loading service options:', err);
      return [];
    }
  }, [error]);

  // Set active category
  const setCategory = (categoryId) => {
    setActiveCategory(categoryId);
  };

  // Get service by ID
  const getServiceById = useCallback((serviceId) => {
    return services.find(service => service.id === serviceId) || null;
  }, [services]);

  return (
    <ServicesContext.Provider value={{
      services,
      categories,
      activeCategory,
      loading,
      setCategory,
      getServicesByCategory,
      getServiceOptions,
      getServiceById,
      loadServices,
      loadCategories
    }}>
      {children}
    </ServicesContext.Provider>
  );
};