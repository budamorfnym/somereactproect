import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServices } from '../../hooks/useServices';
import { useCars } from '../../hooks/useCars';
import { useBooking } from '../../hooks/useBooking';
import { useNotification } from '../../hooks/useNotification';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';
import { Car } from 'lucide-react';

const ServiceBuilder = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [serviceOptions, setServiceOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const { services, getServiceOptions } = useServices();
  const { cars, selectedCar, setSelectedCar, loadUserCars } = useCars();
  const { createBooking, getAvailableSlots, availableSlots } = useBooking();
  const { success, error } = useNotification();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Загрузка опций при выборе услуги
  useEffect(() => {
    const loadServiceOptions = async () => {
      if (selectedService) {
        try {
          setLoading(true);
          const options = await getServiceOptions(selectedService.id);
          setServiceOptions(options);
        } catch (err) {
          error('Не удалось загрузить опции для услуги');
        } finally {
          setLoading(false);
        }
      }
    };

    loadServiceOptions();
  }, [selectedService, getServiceOptions, error]);

  // Расчет итоговой стоимости и длительности
  useEffect(() => {
    if (!selectedService) {
      setTotalPrice(0);
      setTotalDuration(0);
      return;
    }

    let price = selectedService.price;
    let duration = selectedService.duration;

    selectedOptions.forEach(optionId => {
      const option = serviceOptions.find(opt => opt.id === optionId);
      if (option) {
        price += option.price;
        duration += option.duration;
      }
    });

    setTotalPrice(price);
    setTotalDuration(duration);
  }, [selectedService, selectedOptions, serviceOptions]);

  // Загрузка доступных слотов времени при выборе даты
  useEffect(() => {
    const loadTimeSlots = async () => {
      if (selectedDate) {
        try {
          await getAvailableSlots(selectedDate);
        } catch (err) {
          error('Не удалось загрузить доступные слоты времени');
        }
      }
    };

    loadTimeSlots();
  }, [selectedDate, getAvailableSlots, error]);

  // Обработчики событий
  const handleServiceChange = (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    setSelectedService(service);
    setSelectedOptions([]);
  };

  const handleOptionToggle = (optionId) => {
    setSelectedOptions(prevOptions => {
      if (prevOptions.includes(optionId)) {
        return prevOptions.filter(id => id !== optionId);
      } else {
        return [...prevOptions, optionId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!selectedService || !selectedDate || !selectedTime || !selectedCar) {
      error('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    try {
      setLoading(true);
      
      const bookingData = {
        serviceId: selectedService.id,
        options: selectedOptions,
        date: selectedDate,
        time: selectedTime,
        carId: selectedCar.id,
        comment: ''
      };
      
      await createBooking(bookingData);
      success('Вы успешно записались на услугу!');
      navigate('/profile/bookings');
    } catch (err) {
      error('Не удалось создать запись. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  // Генерация дат для выбора (следующие 7 дней)
  const generateAvailableDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' })
      });
    }
    return dates;
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-4">Конструктор услуг</h2>
      <p className="text-gray-400 mb-6">
        Создайте свой индивидуальный пакет услуг, выбрав основные и дополнительные опции
      </p>
      
      {loading && <LoadingSpinner />}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-white mb-3">Выберите основную услугу</h3>
            <div className="bg-gray-900 p-4 rounded-lg space-y-3">
              {services.map(service => (
                <div key={service.id} className="flex items-center">
                  <input 
                    type="radio" 
                    id={`service-${service.id}`}
                    name="base-service"
                    className="mr-3"
                    checked={selectedService?.id === service.id}
                    onChange={() => handleServiceChange(service.id)}
                  />
                  <label htmlFor={`service-${service.id}`} className="flex-grow cursor-pointer">
                    <div className="text-white font-medium">{service.name}</div>
                    <div className="text-gray-400 text-sm flex justify-between items-center">
                      <span>Время: {service.duration} мин.</span>
                      <span className="text-yellow-500">{service.price.toLocaleString()} сом</span>
                    </div>
                  </label>
                </div>
              ))}
            </div>
            
            {selectedService && serviceOptions.length > 0 && (
              <>
                <h3 className="text-lg font-medium text-white mt-6 mb-3">Выберите дополнительные опции</h3>
                <div className="bg-gray-900 p-4 rounded-lg space-y-3">
                  {serviceOptions.map(option => (
                    <div key={option.id} className="flex items-start">
                      <input 
                        type="checkbox" 
                        id={`option-${option.id}`} 
                        className="mt-1 mr-3"
                        checked={selectedOptions.includes(option.id)}
                        onChange={() => handleOptionToggle(option.id)}
                      />
                      <label htmlFor={`option-${option.id}`} className="flex-grow cursor-pointer">
                        <div className="text-white font-medium">{option.name}</div>
                        <div className="text-gray-400 text-sm flex justify-between items-center">
                          <span>Время: +{option.duration} мин.</span>
                          <span className="text-yellow-500">+{option.price.toLocaleString()} сом</span>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-3">Выберите автомобиль</h3>
            <div className="bg-gray-900 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white">Мои автомобили:</span>
                <button 
                  type="button"
                  className="text-red-600 hover:text-red-500 text-sm flex items-center"
                  onClick={() => navigate('/cars/add')}
                >
                  + Добавить
                </button>
              </div>
              
              {isAuthenticated ? (
                cars.length > 0 ? (
                  <div className="space-y-3">
                    {cars.map(car => (
                      <div 
                        key={car.id} 
                        className={`border ${selectedCar?.id === car.id ? 'border-red-600 bg-gray-800' : 'border-gray-700'} rounded-lg p-3 cursor-pointer hover:border-gray-500 transition-colors duration-200`}
                        onClick={() => setSelectedCar(car)}
                      >
                        <div className="flex items-center">
                          <Car size={20} className="text-gray-400 mr-3" />
                          <div>
                            <div className="text-white font-medium">{car.model}</div>
                            <div className="text-gray-400 text-sm">
                              #{car.plateNumber} • {car.color} • {car.year}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 text-center py-4">
                    У вас пока нет добавленных автомобилей
                  </div>
                )
              ) : (
                <div className="text-gray-400 text-center py-4">
                  Войдите, чтобы выбрать автомобиль
                </div>
              )}
            </div>

            <h3 className="text-lg font-medium text-white mb-3">Выберите дату и время</h3>
            <div className="bg-gray-900 p-4 rounded-lg">
              <div className="grid grid-cols-4 gap-2 mb-4">
                {generateAvailableDates().map((date) => (
                  <div 
                    key={date.value}
                    className={`border ${selectedDate === date.value ? 'border-red-600 bg-gray-800' : 'border-gray-700'} rounded text-center p-2 cursor-pointer hover:border-gray-500 transition-colors duration-200`}
                    onClick={() => setSelectedDate(date.value)}
                  >
                    <div className="text-gray-400 text-xs">
                      {date.label.split(' ')[0]}
                    </div>
                    <div className="text-white font-medium">
                      {date.label.split(' ')[1]} {date.label.split(' ')[2]}
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedDate && (
                <div className="grid grid-cols-4 gap-2">
                  {availableSlots.length > 0 ? (
                    availableSlots.map((time, i) => (
                      <div 
                        key={i}
                        className={`border ${selectedTime === time ? 'border-red-600 bg-gray-800' : 'border-gray-700'} rounded text-center p-2 cursor-pointer hover:border-gray-500 transition-colors duration-200`}
                        onClick={() => setSelectedTime(time)}
                      >
                        <div className="text-white">{time}</div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-4 text-gray-400 text-center py-2">
                      На выбранную дату нет свободных слотов
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="mt-6 bg-gray-900 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-white mb-3">Итого</h3>
              <div className="flex justify-between text-gray-400 mb-2">
                <span>Основная услуга:</span>
                <span>{selectedService ? selectedService.price.toLocaleString() : 0} сом</span>
              </div>
              <div className="flex justify-between text-gray-400 mb-2">
                <span>Дополнительные опции:</span>
                <span>{totalPrice - (selectedService?.price || 0)} сом</span>
              </div>
              <div className="flex justify-between text-gray-400 mb-2">
                <span>Общее время:</span>
                <span>{totalDuration} мин</span>
              </div>
              <div className="border-t border-gray-700 my-2 pt-2 flex justify-between">
                <span className="font-medium text-white">Итоговая стоимость:</span>
                <span className="text-yellow-500 font-bold">{totalPrice.toLocaleString()} сом</span>
              </div>
              
              <button 
                type="submit" 
                className="w-full mt-4 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
                disabled={!selectedService || !selectedDate || !selectedTime || !selectedCar || loading}
              >
                {loading ? 'Обработка...' : 'Забронировать'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ServiceBuilder;