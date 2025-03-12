import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCars } from '../hooks/useBookingAndCars';
import { useNotification } from '../hooks/useNotification';
import CarForm from '../components/cars/CarForm';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CarFormPage = ({ showSuccess, mode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars, loadUserCars, getCarById, loading } = useCars();
  const { error } = useNotification();
  
  // Load car data if needed
  useEffect(() => {
    // If we're in edit mode and cars aren't loaded yet
    if (id && cars.length === 0) {
      loadUserCars().catch(err => {
        console.error('Error loading cars:', err);
        error('Ошибка при загрузке данных автомобиля');
        navigate('/cars');
      });
    }
  }, [id, cars.length, loadUserCars, error, navigate]);
  
  // Check if car exists in edit mode
  useEffect(() => {
    if (id && cars.length > 0) {
      const car = getCarById(id);
      if (!car) {
        error('Автомобиль не найден');
        navigate('/cars');
      }
    }
  }, [id, cars, getCarById, error, navigate]);
  
  // Page title
  const pageTitle = id ? 'Редактирование автомобиля' : 'Добавление нового автомобиля';
  
  if (id && cars.length === 0 && loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">{pageTitle}</h1>
        <LoadingSpinner />
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">{pageTitle}</h1>
      <CarForm showSuccess={showSuccess} />
    </div>
  );
};

export default CarFormPage;