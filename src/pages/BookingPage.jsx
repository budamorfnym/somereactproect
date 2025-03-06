import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useServices } from '../hooks/useServices';
import { useCars } from '../hooks/useCars';
import { useBooking } from '../hooks/useBooking';
import { useNotification } from '../hooks/useNotification';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';
import { Car, Calendar, Clock } from 'lucide-react';

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { success, error } = useNotification();
  
  // Получение предварительно выбранной услуги или автомобиля из state (если есть)
  const initialService = location.state?.selectedService || null;
  const initialCar = location.state?.selectedCar || null;
  
  // Состояния
  const [selectedService, setSelectedService] = useState(initialService);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [comment, setComment] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [serviceOptions, setServiceOptions] = useState([]);
  
  // Хуки
  const { services, getServiceOptions } = useServices();
  const { cars, selectedCar, setSelectedCar, loadUserCars } = useCars();
  const { createBooking, getAvailableSlots, availableSlots } = useBooking();
  
  // Загрузка автомобилей при первом рендере
  useEffect(() => {
    loadUserCars();
    
    // Установка предварительно выбранной машины
    if (initialCar) {
      setSelectedCar(initialCar);
    }
  }, [loadUserCars, initialCar, setSelectedCar]);
  
  // Загрузка опций при выборе услуги
  useEffect(() => {
    const loadServiceOptions = async () => {
      if (selectedService) {
        try {
          setLoading(true);
          const options = await getServiceOptions(selectedService.id);
          setServiceOptions(options || []);
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
        comment: comment.trim()
      };
      
      const result = await createBooking(bookingData);
      success('Вы успешно записались на услугу!');
      navigate('/profile/bookings', { state: { newBooking: result } });
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
  
  if (loading && !selectedService) {
    return <LoadingSpinner fullscreen />;
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
        Запись на услугу
      </h1>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Левая колонка - выбор услуги и опций */}
          <div className="md:col-span-2">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-medium text-white mb-4">Выберите услугу</h2>
              
              <div className="space-y-4">
                {services.map(service => (
                  <div 
                    key={service.id}
                    className={`border ${
                      selectedService?.id === service.id ? 'border-red-600 bg-gray-700' : 'border-gray-700'
                    } rounded-lg p-4 cursor-pointer hover:border-gray-500 transition-colors duration-200`}
                    onClick={() => handleServiceChange(service.id)}
                  >
                    <div className="flex justify-between">
                      <h3 className="text-lg font-medium text-white">{service.name}</h3>
                      <span className="text-yellow-500 font-semibold">{service.price.toLocaleString()} сом</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{service.description}</p>
                    <div className="flex justify-between text-sm text-gray-400 mt-2">
                      <span className="flex items-center"><Clock size={14} className="mr-1" /> {service.duration} мин.</span>
                      <span>{service.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {selectedService && serviceOptions.length > 0 && (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-medium text-white mb-4">Дополнительные опции</h2>
                
                <div className="space-y-3">
                  {serviceOptions.map(option => (
                    <div 
                      key={option.id}
                      className={`border ${
                        selectedOptions.includes(option.id) ? 'border-red-600 bg-gray-700' : 'border-gray-700'
                      } rounded-lg p-4 cursor-pointer hover:border-gray-500 transition-colors duration-200`}
                      onClick={() => handleOptionToggle(option.id)}
                    >
                      <div className="flex items-start">
                        <input 
                          type="checkbox"
                          className="mt-1 mr-3"
                          checked={selectedOptions.includes(option.id)}
                          onChange={() => {}}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <h3 className="font-medium text-white">{option.name}</h3>
                            <span className="text-yellow-500">+{option.price.toLocaleString()} сом</span>
                          </div>
                          {option.description && (
                            <p className="text-gray-400 text-sm mt-1">{option.description}</p>
                          )}
                          <div className="text-gray-400 text-sm mt-1">
                            Дополнительное время: +{option.duration} мин.
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Правая колонка - выбор автомобиля, даты и времени */}
          <div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-medium text-white mb-4">Ваш автомобиль</h2>
              
              {cars.length > 0 ? (
                <div className="space-y-3">
                  {cars.map(car => (
                    <div 
                      key={car.id}
                      className={`border ${
                        selectedCar?.id === car.id ? 'border-red-600 bg-gray-700' : 'border-gray-700'
                      } rounded-lg p-3 cursor-pointer hover:border-gray-500 transition-colors duration-200`}
                      onClick={() => setSelectedCar(car)}
                    >
                      <div className="flex items-center">
                        <Car size={20} className="text-gray-400 mr-3" />
                        <div>
                          <div className="text-white font-medium">{car.model}</div>
                          <div className="text-gray-400 text-sm">
                            #{car.plateNumber} • {car.color || 'Цвет не указан'} • {car.year || ''}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-400 mb-3">У вас пока нет добавленных автомобилей</p>
                  <Link 
                    to="/cars/add"
                    className="inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-200"
                  >
                    Добавить автомобиль
                  </Link>
                </div>
              )}
            </div>
            
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-medium text-white mb-4">Дата и время</h2>
              
              <div className="mb-4">
                <h3 className="font-medium text-white mb-2">Выберите дату</h3>
                <div className="grid grid-cols-3 gap-2">
                  {generateAvailableDates().map((date) => (
                    <div 
                      key={date.value}
                      className={`border ${
                        selectedDate === date.value ? 'border-red-600 bg-gray-700' : 'border-gray-700'
                      } rounded text-center p-2 cursor-pointer hover:border-gray-500 transition-colors duration-200`}
                      onClick={() => setSelectedDate(date.value)}
                    >
                      <div className="text-gray-400 text-xs">
                        {date.label.split(' ')[0]}
                      </div>
                      <div className="text-white">
                        {date.label.split(' ')[1]} {date.label.split(' ')[2]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedDate && (
                <div>
                  <h3 className="font-medium text-white mb-2">Выберите время</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots && availableSlots.length > 0 ? (
                      availableSlots.map((time, i) => (
                        <div 
                          key={i}
                          className={`border ${
                            selectedTime === time ? 'border-red-600 bg-gray-700' : 'border-gray-700'
                          } rounded text-center p-2 cursor-pointer hover:border-gray-500 transition-colors duration-200`}
                          onClick={() => setSelectedTime(time)}
                        >
                          <div className="text-white">{time}</div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-3 text-center py-3 text-gray-400">
                        На выбранную дату нет доступных слотов
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-medium text-white mb-4">Комментарий</h2>
              
              <textarea 
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Дополнительные пожелания или информация"
                className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white"
              ></textarea>
            </div>
            
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-medium text-white mb-4">Итого</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-400">
                  <span>Основная услуга:</span>
                  <span>{selectedService ? selectedService.price.toLocaleString() : 0} сом</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Дополнительные опции:</span>
                  <span>{(totalPrice - (selectedService?.price || 0)).toLocaleString()} сом</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Общее время:</span>
                  <span>{totalDuration} мин</span>
                </div>
                <div className="border-t border-gray-700 pt-2 mt-2">
                  <div className="flex justify-between font-medium">
                    <span className="text-white">К оплате:</span>
                    <span className="text-yellow-500 text-lg">{totalPrice.toLocaleString()} сом</span>
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={!selectedService || !selectedDate || !selectedTime || !selectedCar || loading}
                className="w-full bg-red-600 text-white px-4 py-3 rounded-md font-medium hover:bg-red-700 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                {loading ? 'Обработка...' : 'Подтвердить запись'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BookingPage;