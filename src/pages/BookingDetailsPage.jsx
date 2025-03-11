import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBooking } from '../hooks/useBooking';
import { useLoyalty } from '../hooks/useLoyalty';
import { useNotification } from '../hooks/useNotification';
import { Calendar, Clock, Car, CheckCircle, XCircle, AlertTriangle, ChevronLeft, Award } from 'lucide-react';
import { formatDate, formatTime, formatCurrency } from '../utils/formatters';
import LoadingSpinner from '../components/common/LoadingSpinner';

const BookingDetailsPage = () => {
  const { id } = useParams();
  const { getBookingDetails, cancelBooking, loading } = useBooking();
  const { points, usePoints } = useLoyalty();
  const { success, error } = useNotification();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [pointsToUse, setPointsToUse] = useState(0);
  const [showUsePointsModal, setShowUsePointsModal] = useState(false);

  // Load booking details
  useEffect(() => {
    const loadBookingDetails = async () => {
      try {
        const data = await getBookingDetails(id);
        setBooking(data);
      } catch (err) {
        error('Не удалось загрузить детали записи');
        navigate('/profile/bookings');
      }
    };

    loadBookingDetails();
  }, [id, getBookingDetails, error, navigate]);

  // Get status info and styling
  const getStatusInfo = (status) => {
    const statusMap = {
      'pending': { label: 'Ожидает подтверждения', color: 'text-yellow-500', bgColor: 'bg-yellow-500', icon: <AlertTriangle size={20} /> },
      'confirmed': { label: 'Подтверждена', color: 'text-green-500', bgColor: 'bg-green-500', icon: <CheckCircle size={20} /> },
      'in-progress': { label: 'В процессе', color: 'text-blue-500', bgColor: 'bg-blue-500', icon: <Clock size={20} /> },
      'completed': { label: 'Завершена', color: 'text-green-500', bgColor: 'bg-green-500', icon: <CheckCircle size={20} /> },
      'cancelled': { label: 'Отменена', color: 'text-red-500', bgColor: 'bg-red-500', icon: <XCircle size={20} /> }
    };
    
    return statusMap[status] || { label: status, color: 'text-gray-400', bgColor: 'bg-gray-400', icon: <AlertTriangle size={20} /> };
  };

  // Handle booking cancellation
  const handleCancelBooking = async () => {
    try {
      await cancelBooking(id, cancellationReason);
      success('Запись успешно отменена');
      setShowCancelModal(false);
      
      // Update booking status
      setBooking(prev => ({ ...prev, status: 'cancelled' }));
    } catch (err) {
      error('Не удалось отменить запись');
    }
  };

  // Handle using loyalty points
  const handleUsePoints = async () => {
    if (pointsToUse <= 0 || pointsToUse > points) {
      error('Некорректное количество баллов');
      return;
    }

    try {
      await usePoints(id, pointsToUse);
      success(`Вы успешно использовали ${pointsToUse} баллов`);
      setShowUsePointsModal(false);
      
      // Reload booking details
      const updatedBooking = await getBookingDetails(id);
      setBooking(updatedBooking);
    } catch (err) {
      error('Не удалось использовать баллы лояльности');
    }
  };

  if (loading || !booking) {
    return <LoadingSpinner />;
  }

  const statusInfo = getStatusInfo(booking.status);
  const canCancel = ['pending', 'confirmed'].includes(booking.status);
  const canUsePoints = booking.status === 'confirmed' && !booking.pointsUsed && points > 0;
  const maxPoints = Math.min(points, Math.floor(booking.totalPrice * 0.5));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to="/profile/bookings"
          className="text-gray-400 hover:text-white flex items-center"
        >
          <ChevronLeft size={20} className="mr-2" /> Вернуться к списку записей
        </Link>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Запись #{booking.id}
              </h1>
              <div className="flex items-center">
                <span className={`flex items-center ${statusInfo.color} mr-4`}>
                  {statusInfo.icon}
                  <span className="ml-1">{statusInfo.label}</span>
                </span>
                <span className="text-gray-400">
                  Создана: {formatDate(new Date(booking.createdAt))}
                </span>
              </div>
            </div>
            
            {canCancel && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="mt-4 md:mt-0 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-200"
              >
                Отменить запись
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium text-white mb-4">Детали услуги</h2>
              
              <div className="bg-gray-900 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-medium text-white mb-2">
                  {booking.service?.name}
                </h3>
                <p className="text-gray-400 text-sm mb-3">
                  {booking.service?.description}
                </p>
                
                {booking.options?.length > 0 && (
                  <div className="mt-3">
                    <h4 className="text-white font-medium mb-2">Дополнительные опции:</h4>
                    <ul className="space-y-1 text-gray-400">
                      {booking.options.map(option => (
                        <li key={option.id} className="flex justify-between">
                          <span>{option.name}</span>
                          <span className="text-yellow-500">{formatCurrency(option.price)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="bg-gray-900 rounded-lg p-4">
                <h3 className="text-white font-medium mb-3">Детали записи</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Calendar size={20} className="text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <div className="text-white">Дата</div>
                      <div className="text-gray-400">
                        {formatDate(new Date(booking.date))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock size={20} className="text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <div className="text-white">Время</div>
                      <div className="text-gray-400">{formatTime(booking.time)}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Car size={20} className="text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <div className="text-white">Автомобиль</div>
                      <div className="text-gray-400">
                        {booking.carModel} • #{booking.carNumber}
                      </div>
                    </div>
                  </div>
                  
                  {booking.comment && (
                    <div className="pt-3 border-t border-gray-700">
                      <div className="text-white mb-1">Дополнительные комментарии:</div>
                      <div className="text-gray-400">{booking.comment}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-white mb-4">Оплата</h2>
              
              <div className="bg-gray-900 rounded-lg p-4 mb-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-400">
                    <span>Стоимость услуги:</span>
                    <span>{formatCurrency(booking.service?.price || 0)}</span>
                  </div>
                  
                  {booking.options?.length > 0 && (
                    <div className="flex justify-between text-gray-400">
                      <span>Дополнительные опции:</span>
                      <span>
                        {formatCurrency(
                          booking.options.reduce((sum, opt) => sum + opt.price, 0)
                        )}
                      </span>
                    </div>
                  )}
                  
                  {booking.discount > 0 && (
                    <div className="flex justify-between text-green-500">
                      <span>Скидка:</span>
                      <span>-{formatCurrency(booking.discount)}</span>
                    </div>
                  )}
                  
                  {booking.pointsUsed > 0 && (
                    <div className="flex justify-between text-yellow-500">
                      <span>Использовано баллов:</span>
                      <span>-{formatCurrency(booking.pointsUsed)}</span>
                    </div>
                  )}
                  
                  <div className="pt-2 mt-2 border-t border-gray-700">
                    <div className="flex justify-between font-medium">
                      <span className="text-white">Итого к оплате:</span>
                      <span className="text-yellow-500 text-lg">
                        {formatCurrency(booking.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {canUsePoints && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-yellow-500">
                        <Award size={20} className="mr-2" />
                        <span>Доступно баллов: {points}</span>
                      </div>
                      <button
                        onClick={() => setShowUsePointsModal(true)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm transition-colors duration-200"
                      >
                        Использовать баллы
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-900 rounded-lg p-4">
                <h3 className="text-white font-medium mb-3">Статус записи</h3>
                
                <div 
                  className={`mb-4 p-3 rounded-lg ${statusInfo.bgColor} bg-opacity-20 border border-${statusInfo.bgColor} border-opacity-40`}
                >
                  <div className="flex items-center">
                    {statusInfo.icon}
                    <span className={`ml-2 font-medium ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 text-sm mt-2">
                    {booking.status === 'pending' && 
                      'Ваша запись ожидает подтверждения со стороны администратора. Мы свяжемся с вами для подтверждения.'
                    }
                    {booking.status === 'confirmed' && 
                      'Ваша запись подтверждена. Пожалуйста, приезжайте к назначенному времени.'
                    }
                    {booking.status === 'in-progress' && 
                      'Ваш автомобиль в работе. Вы получите уведомление, когда услуга будет завершена.'
                    }
                    {booking.status === 'completed' && 
                      'Услуга выполнена. Спасибо, что выбрали наш сервис!'
                    }
                    {booking.status === 'cancelled' && 
                      'Запись была отменена.'
                    }
                  </p>
                </div>
                
                {booking.statusHistory && booking.statusHistory.length > 0 && (
                  <div>
                    <h4 className="text-white font-medium mb-2">История статусов:</h4>
                    <ul className="space-y-2">
                      {booking.statusHistory.map((item, index) => (
                        <li key={index} className="text-sm text-gray-400">
                          {formatDate(new Date(item.date))}: {item.status}
                          {item.note && ` - ${item.note}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Booking Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-medium text-white mb-4">Отмена записи</h3>
            <p className="text-gray-300 mb-4">
              Вы уверены, что хотите отменить запись? Это действие нельзя будет отменить.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Причина отмены (необязательно)
              </label>
              <textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white"
                rows="3"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors duration-200"
              >
                Отмена
              </button>
              <button
                onClick={handleCancelBooking}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
              >
                Подтвердить отмену
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Use Points Modal */}
      {showUsePointsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-medium text-white mb-4">
              Использование бонусных баллов
            </h3>
            <p className="text-gray-300 mb-4">
              У вас {points} доступных баллов. Вы можете использовать до {maxPoints} баллов 
              для оплаты этой записи (50% от стоимости).
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Количество баллов
              </label>
              <input
                type="number"
                value={pointsToUse}
                onChange={(e) => setPointsToUse(Math.min(maxPoints, Math.max(0, Number(e.target.value))))}
                className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white"
                min="0"
                max={maxPoints}
              />
            </div>
            
            <div className="mb-4 p-3 bg-gray-900 rounded">
              <div className="flex justify-between text-gray-300">
                <span>Стоимость услуги:</span>
                <span>{formatCurrency(booking.totalPrice)}</span>
              </div>
              <div className="flex justify-between text-yellow-500">
                <span>Оплата баллами:</span>
                <span>-{formatCurrency(pointsToUse)}</span>
              </div>
              <div className="flex justify-between text-white font-medium pt-2 mt-2 border-t border-gray-700">
                <span>Итого к оплате:</span>
                <span>{formatCurrency(booking.totalPrice - pointsToUse)}</span>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowUsePointsModal(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors duration-200"
              >
                Отмена
              </button>
              <button
                onClick={handleUsePoints}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors duration-200"
              >
                Использовать
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetailsPage;