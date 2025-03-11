import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useServices } from '../hooks/useServices';
import { useCars } from '../hooks/useCars';
import { useBooking } from '../hooks/useBooking';
import { useTimeSlots } from '../hooks/useTimeSlots';
import { useLoyalty } from '../hooks/useLoyalty';
import { useNotification } from '../hooks/useNotification';
import { useAuth } from '../hooks/useAuth';
import ImprovedBookingCalendar from '../components/booking/ImprovedBookingCalendar';
import BookingSummary from '../components/booking/BookingSummary';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';
import { validateDate, validateTime } from '../utils/validators';

const BookingPage = ({ showSuccess }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  const { success, error } = useNotification();
  
  // Service states
  const [selectedService, setSelectedService] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [serviceOptions, setServiceOptions] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  
  // Date and time states
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
  // Car state
  const [comment, setComment] = useState('');
  
  // Loyalty points
  const [pointsToUse, setPointsToUse] = useState(0);
  
  // Loading state
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Hooks
  const { services, getServiceOptions } = useServices();
  const { cars, selectedCar, setSelectedCar, loadUserCars } = useCars();
  const { createBooking } = useBooking();
  const { reserveSlot } = useTimeSlots();
  const { points: loyaltyPoints } = useLoyalty();
  
  // Get initial service and car from location state
  const initialService = location.state?.selectedService || null;
  const initialCar = location.state?.selectedCar || null;
  
  // Load cars on component mount
  useEffect(() => {
    loadUserCars();
    
    // Set initial car if provided
    if (initialCar) {
      setSelectedCar(initialCar);
    }
  }, [loadUserCars, initialCar, setSelectedCar]);
  
  // Set initial service if provided in location state
  useEffect(() => {
    if (initialService) {
      setSelectedService(initialService);
    }
  }, [initialService]);
  
  // Load service options when service changes
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
  
  // Calculate total price and duration
  useEffect(() => {
    if (!selectedService) {
      setTotalPrice(0);
      setTotalDuration(0);
      return;
    }
    
    let price = selectedService.price;
    let duration = selectedService.duration;
    
    // Add options
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
  
  // Reset points to use when totalPrice changes
  useEffect(() => {
    setPointsToUse(0);
  }, [totalPrice]);
  
  // Handlers
  const handleServiceChange = (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    setSelectedService(service);
    setSelectedOptions([]);
    // Reset date and time when service changes
    setSelectedDate('');
    setSelectedTime('');
  };
  
  const handleOptionToggle = (optionId) => {
    setSelectedOptions(prevOptions => {
      if (prevOptions.includes(optionId)) {
        return prevOptions.filter(id => id !== optionId);
      } else {
        return [...prevOptions, optionId];
      }
    });
    // Reset date and time when options change
    setSelectedDate('');
    setSelectedTime('');
  };
  
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(''); // Reset time when date changes
  };
  
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };
  
  const handlePointsChange = (points) => {
    setPointsToUse(points);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname }});
      return;
    }
    
    // Validation
    if (!selectedService) {
      error('Пожалуйста, выберите услугу');
      return;
    }
    
    if (!selectedCar) {
      error('Пожалуйста, выберите автомобиль');
      return;
    }
    
    if (!selectedDate || !validateDate(selectedDate)) {
      error('Пожалуйста, выберите корректную дату');
      return;
    }
    
    if (!selectedTime || !validateTime(selectedTime)) {
      error('Пожалуйста, выберите корректное время');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Try to reserve the time slot first
      await reserveSlot(selectedDate, selectedTime, totalDuration);
      
      // Create booking
      const bookingData = {
        serviceId: selectedService.id,
        options: selectedOptions,
        date: selectedDate,
        time: selectedTime,
        carId: selectedCar.id,
        comment: comment.trim(),
        pointsToUse: pointsToUse
      };
      
      const result = await createBooking(bookingData);
      
      // Show success message
      success('Запись успешно создана!');
      
      if (showSuccess) {
        showSuccess('Вы успешно записались на услугу!');
      }
      
      // Navigate to bookings page
      navigate('/profile/bookings', { state: { newBooking: result } });
      
    } catch (err) {
      console.error('Booking error:', err);
      error(err.response?.data?.message || 'Не удалось создать запись. Пожалуйста, попробуйте позже.');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Render
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
        Запись на услугу
      </h1>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Service selection */}
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
                      <span>Время: {service.duration} мин.</span>
                      <span>Категория: {service.category}</span>
                    </div>
                  </div>
                ))}
                
                {loading && <LoadingSpinner />}
              </div>
            </div>
            
            {/* Options */}
            {selectedService && serviceOptions.length > 0 && (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
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
            
            {/* Car selection */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium text-white">Выберите автомобиль</h2>
                <Link 
                  to="/cars/add"
                  className="text-red-600 hover:text-red-500 text-sm"
                >
                  + Добавить автомобиль
                </Link>
              </div>
              
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
                        <div className="text-white font-medium">{car.model}</div>
                        <div className="text-gray-400 text-sm ml-auto">
                          #{car.plateNumber} {car.color && `• ${car.color}`} {car.year && `• ${car.year}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-400 mb-4">У вас пока нет добавленных автомобилей</p>
                  <Link 
                    to="/cars/add"
                    className="inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-200"
                  >
                    Добавить автомобиль
                  </Link>
                </div>
              )}
            </div>
            
            {/* Comment */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-medium text-white mb-4">Комментарий</h2>
              
              <textarea 
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Дополнительные пожелания к заказу..."
                className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white"
              ></textarea>
            </div>
          </div>
          
          {/* Right column - Calendar and summary */}
          <div>
            {/* Calendar */}
            {selectedService && (
              <div className="mb-6">
                <ImprovedBookingCalendar
                  onSelectDate={handleDateSelect}
                  onSelectTime={handleTimeSelect}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  serviceId={selectedService.id}
                  duration={totalDuration}
                />
              </div>
            )}
            
            {/* Order summary */}
            <BookingSummary
              selectedService={selectedService}
              selectedOptions={selectedOptions.map(id => serviceOptions.find(o => o.id === id)).filter(Boolean)}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              selectedCar={selectedCar}
              totalPrice={totalPrice}
              totalDuration={totalDuration}
              pointsToUse={pointsToUse}
              loyaltyPoints={loyaltyPoints}
              onUsePoints={handlePointsChange}
              loading={loading}
            />
            
            {/* Submit button */}
            <div className="mt-6">
              <button
                type="submit"
                className="w-full bg-red-600 text-white px-4 py-3 rounded-md font-medium hover:bg-red-700 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={!selectedService || !selectedCar || !selectedDate || !selectedTime || submitting}
              >
                {submitting ? <LoadingSpinner /> : 'Подтвердить запись'}
              </button>
              
              <p className="text-sm text-gray-400 text-center mt-2">
                Внесение предоплаты не требуется. Оплата производится при оказании услуги.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BookingPage;