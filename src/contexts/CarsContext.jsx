import React, { createContext, useState, useCallback } from 'react';
import { carsService } from '../services/carsService';
import { useNotification } from '../hooks/useNotification';

export const CarsContext = createContext();

export const CarsProvider = ({ children }) => {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { success, error } = useNotification();
  
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
  
  return (
    <CarsContext.Provider value={{
      cars,
      selectedCar,
      loading,
      setSelectedCar,
      loadUserCars,
      getCarById,
      addCar,
      updateCar,
      deleteCar
    }}>
      {children}
    </CarsContext.Provider>
  );
};