import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBooking } from '../../hooks/useBooking';
import { formatDate, formatTime } from '../../utils/formatters';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const ProfileBookings = () => {
  const { bookings, getUserBookings, loading } = useBooking();
  const [filter, setFilter] = useState('all');
  
  // Загрузка записей при первом рендере
  useEffect(() => {
    getUserBookings();
  }, [getUserBookings]);
  
  // Фильтрация записей
  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(booking => {
        if (filter === 'active') {
          return ['pending', 'confirmed', 'in-progress'].includes(booking.status);
        } else if (filter === 'completed') {
          return booking.status === 'completed';
        } else if (filter === 'cancelled') {
          return booking.status === 'cancelled';
        }
        return true;
      });
  
  // Получение информации о статусе
  const getStatusInfo = (status) => {
    const statusMap = {
      'pending': { label: 'Ожидает подтверждения', color: 'text-yellow-500', icon: <Clock size={16} /> },
      'confirmed': { label: 'Подтверждена', color: 'text-green-500', icon: <CheckCircle size={16} /> },
      'in-progress': { label: 'В процессе', color: 'text-blue-500', icon: <Clock size={16} /> },
      'completed': { label: 'Завершена', color: 'text-green-500', icon: <CheckCircle size={16} /> },
      'cancelled': { label: 'Отменена', color: 'text-red-500', icon: <XCircle size={16} /> }
    };
    
    return statusMap[status] || { label: status, color: 'text-gray-400', icon: <Clock size={16} /> };
  };
  
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-white">Мои записи</h2>
      </div>
      
      {/* Фильтры */}
      <div className="bg-gray-900 px-6 py-3 border-b border-gray-700">
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1 rounded text-sm ${filter === 'all' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            onClick={() => setFilter('all')}
          >
            Все записи
          </button>
          <button
            className={`px-3 py-1 rounded text-sm ${filter === 'active' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            onClick={() => setFilter('active')}
          >
            Активные
          </button>
          <button
            className={`px-3 py-1 rounded text-sm ${filter === 'completed' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            onClick={() => setFilter('completed')}
          >
            Завершенные
          </button>
          <button
            className={`px-3 py-1 rounded text-sm ${filter === 'cancelled' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            onClick={() => setFilter('cancelled')}
          >
            Отмененные
          </button>
        </div>
      </div>
      
      {/* Список записей */}
      <div className="p-6">
        {loading ? (
          <LoadingSpinner />
        ) : filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map(booking => {
              const statusInfo = getStatusInfo(booking.status);
              
              return (
                <div 
                  key={booking.id}
                  className="bg-gray-900 rounded-lg border border-gray-700 p-4"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div>
                      <div className="flex items-center mb-2">
                        <span className={`flex items-center ${statusInfo.color} mr-3`}>
                          {statusInfo.icon}
                          <span className="ml-1">{statusInfo.label}</span>
                        </span>
                        <span className="text-gray-400 text-sm">ID: {booking.id}</span>
                      </div>
                      
                      <h3 className="text-lg font-medium text-white mb-1">{booking.service?.name}</h3>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400">
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          <span>{formatDate(new Date(booking.date))}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          <span>{formatTime(booking.time)}</span>
                        </div>
                        <div>{booking.carModel} • #{booking.carNumber}</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0 flex flex-col md:items-end">
                      <div className="text-yellow-500 font-bold">{booking.totalPrice.toLocaleString()} сом</div>
                      <Link
                        to={`/booking/${booking.id}`}
                        className="flex items-center text-red-600 hover:text-red-500 mt-2"
                      >
                        <Eye size={14} className="mr-1" /> Подробнее
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertCircle size={48} className="text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">Записей не найдено</h3>
            <p className="text-gray-400 mb-4">
              {filter === 'all' 
                ? 'У вас пока нет ни одной записи на услуги' 
                : `У вас нет ${filter === 'active' ? 'активных' : filter === 'completed' ? 'завершенных' : 'отмененных'} записей`}
            </p>
            <Link
              to="/services"
              className="inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-200"
            >
              Записаться на услугу
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileBookings;