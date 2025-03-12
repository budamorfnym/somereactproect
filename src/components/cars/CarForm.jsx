import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCars } from '../../hooks/useBookingAndCars';
import { useNotification } from '../../hooks/useNotification';
import LoadingSpinner from '../common/LoadingSpinner';

const CarForm = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    model: '',
    year: new Date().getFullYear(),
    plateNumber: '',
    color: '',
    vin: ''
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const { addCar, updateCar, cars, loadUserCars } = useCars();
  const { success, error } = useNotification();
  const navigate = useNavigate();
  
  // Load car data when editing
  useEffect(() => {
    const loadCarData = async () => {
      // If we're editing (id exists), set editing mode
      if (id) {
        setIsEditing(true);
        setLoading(true);
        
        try {
          // Make sure cars are loaded
          if (cars.length === 0) {
            await loadUserCars();
          }
          
          // Find the car by id in the loaded cars
          const car = cars.find(c => c.id === id);
          
          if (car) {
            setFormData({
              model: car.model || '',
              year: car.year || new Date().getFullYear(),
              plateNumber: car.plateNumber || '',
              color: car.color || '',
              vin: car.vin || ''
            });
          } else {
            // Car not found
            error('Автомобиль не найден');
            navigate('/cars');
          }
        } catch (err) {
          error('Не удалось загрузить данные автомобиля');
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadCarData();
  }, [id, cars, loadUserCars, error, navigate]);
  
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.model || !formData.plateNumber) {
      error('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    try {
      setLoading(true);
      
      if (isEditing) {
        await updateCar(id, formData);
        success('Автомобиль успешно обновлен');
      } else {
        await addCar(formData);
        success('Автомобиль успешно добавлен');
      }
      
      navigate('/cars');
    } catch (err) {
      error(isEditing ? 'Не удалось обновить автомобиль' : 'Не удалось добавить автомобиль');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-6">
        {isEditing ? 'Редактирование автомобиля' : 'Добавление нового автомобиля'}
      </h2>
      
      {loading ? (
        <LoadingSpinner />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Марка и модель <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white"
                placeholder="Например: Toyota Camry"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Год выпуска
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                min="1900"
                max={new Date().getFullYear() + 1}
                className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Гос. номер <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="plateNumber"
                value={formData.plateNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white uppercase"
                placeholder="Например: B123ABC"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Цвет
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white"
                placeholder="Например: Белый"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                VIN-номер
              </label>
              <input
                type="text"
                name="vin"
                value={formData.vin}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white uppercase"
                placeholder="Например: WBA1S510605J02262"
              />
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors duration-200"
              onClick={() => navigate('/cars')}
            >
              Отмена
            </button>
            
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed flex-1"
              disabled={loading}
            >
              {loading ? <LoadingSpinner /> : (isEditing ? 'Сохранить' : 'Добавить автомобиль')}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CarForm;