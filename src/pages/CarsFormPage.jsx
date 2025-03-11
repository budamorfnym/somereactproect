// src/pages/CarsFormPage.jsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCars } from '../hooks/useCars';
import CarForm from '../components/cars/CarForm';

const CarFormPage = ({ showSuccess }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCarById, cars, loadUserCars } = useCars();
  
  // Загрузка автомобилей, если они еще не загружены
  useEffect(() => {
    if (cars.length === 0) {
      loadUserCars();
    }
  }, [cars.length, loadUserCars]);
  
  // Заголовок страницы
  const pageTitle = id ? 'Редактирование автомобиля' : 'Добавление нового автомобиля';
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
        {pageTitle}
      </h1>
      
      <CarForm showSuccess={showSuccess} />
    </div>
  );
};

export default CarFormPage;