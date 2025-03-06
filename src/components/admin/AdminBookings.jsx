import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Calendar, Clock, 
  CheckCircle, XCircle, AlertTriangle, 
  Eye, ChevronRight, ChevronLeft
} from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { formatDate, formatTime } from '../../utils/formatters';
import LoadingSpinner from '../common/LoadingSpinner';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  
  const { api } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  
  const perPage = 10; // Количество записей на странице
  
  // Получаем параметры из URL при первом рендере
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    const date = params.get('date');
    const search = params.get('search');
    
    if (status) setStatusFilter(status);
    if (date) setDateFilter(date);
    if (search) setSearchTerm(search);
  }, [location.search]);
  
  // Загрузка бронирований
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        
        // В реальном проекте здесь была бы логика для передачи параметров фильтрации
        const response = await api.get('/admin/bookings');
        setBookings(response.data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, [api]);
  
  // Фильтрация и поиск бронирований
  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      // Фильтрация по статусу
      if (statusFilter !== 'all' && booking.status !== statusFilter) {
        return false;
      }
      
      // Фильтрация по дате
      if (dateFilter) {
        const bookingDate = new Date(booking.date).toISOString().split('T')[0];
        if (bookingDate !== dateFilter) {
          return false;
        }
      }
      
      // Поиск по имени, телефону или модели автомобиля
      if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        return (
          booking.user?.name?.toLowerCase().includes(lowerSearch) ||
          booking.user?.phone?.toLowerCase().includes(lowerSearch) ||
          booking.carModel?.toLowerCase().includes(lowerSearch) ||
          booking.carNumber?.toLowerCase().includes(lowerSearch)
        );
      }
      
      return true;
    });
  }, [bookings, statusFilter, dateFilter, searchTerm]);
  
  // Пагинация
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * perPage;
    return filteredBookings.slice(startIndex, startIndex + perPage);
  }, [filteredBookings, currentPage]);
  
  // Общее количество страниц
  const totalPages = Math.ceil(filteredBookings.length / perPage);
  
  // Обработчик изменения страницы
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  
  // Обработчик фильтрации
  const handleFilterChange = () => {
    // Обновляем URL с новыми параметрами
    const params = new URLSearchParams();
    if (statusFilter !== 'all') params.append('status', statusFilter);
    if (dateFilter) params.append('date', dateFilter);
    if (searchTerm) params.append('search', searchTerm);
    
    navigate({ search: params.toString() });
    setCurrentPage(1); // Сбрасываем на первую страницу
  };
  
  // Функция для получения информации о статусе
  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { label: 'Ожидает', icon: <AlertTriangle size={16} />, color: 'text-yellow-500' };
      case 'confirmed':
        return { label: 'Подтверждена', icon: <CheckCircle size={16} />, color: 'text-green-500' };
      case 'in-progress':
        return { label: 'В процессе', icon: <Clock size={16} />, color: 'text-blue-500' };
      case 'completed':
        return { label: 'Завершена', icon: <CheckCircle size={16} />, color: 'text-green-500' };
      case 'cancelled':
        return { label: 'Отменена', icon: <XCircle size={16} />, color: 'text-red-500' };
      default:
        return { label: 'Неизвестно', icon: <AlertTriangle size={16} />, color: 'text-gray-400' };
    }
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Управление записями</h1>
      
      {/* Фильтры и поиск */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg block w-full pl-10 p-2.5"
              placeholder="Поиск по имени, телефону..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Filter size={16} className="text-gray-400" />
              </div>
              <select
                className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg block w-full pl-10 p-2.5"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Все статусы</option>
                <option value="pending">Ожидают</option>
                <option value="confirmed">Подтверждены</option>
                <option value="in-progress">В процессе</option>
                <option value="completed">Завершены</option>
                <option value="cancelled">Отменены</option>
              </select>
            </div>
            
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Calendar size={16} className="text-gray-400" />
              </div>
              <input
                type="date"
                className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg block w-full pl-10 p-2.5"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-200 flex-grow"
              onClick={handleFilterChange}
            >
              Применить фильтры
            </button>
            
            <button
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors duration-200"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setDateFilter('');
                navigate('/admin/bookings');
              }}
            >
              Сбросить
            </button>
          </div>
        </div>
      </div>
      
      {/* Записи */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-6">
            <LoadingSpinner />
          </div>
        ) : filteredBookings.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-300">
                <thead className="bg-gray-700 text-white text-xs uppercase">
                  <tr>
                    <th className="px-6 py-3">Клиент</th>
                    <th className="px-6 py-3">Услуга</th>
                    <th className="px-6 py-3">Автомобиль</th>
                    <th className="px-6 py-3">Дата и время</th>
                    <th className="px-6 py-3">Сумма</th>
                    <th className="px-6 py-3">Статус</th>
                    <th className="px-6 py-3 text-right">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBookings.map((booking) => {
                    const statusInfo = getStatusInfo(booking.status);
                    
                    return (
                      <tr key={booking.id} className="border-b border-gray-700 hover:bg-gray-700">
                        <td className="px-6 py-4">
                          <div className="font-medium text-white">{booking.user?.name || 'Н/Д'}</div>
                          <div className="text-gray-400 text-xs">{booking.user?.phone || 'Н/Д'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-white">{booking.service?.name || 'Н/Д'}</div>
                          <div className="text-gray-400 text-xs">
                            {booking.options?.length > 0 ? `+ ${booking.options.length} опций` : 'Без опций'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-white">{booking.carModel || 'Н/Д'}</div>
                          <div className="text-gray-400 text-xs">{booking.carNumber || 'Н/Д'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-white">
                            {booking.date ? formatDate(new Date(booking.date)) : 'Н/Д'}
                          </div>
                          <div className="text-gray-400 text-xs">{formatTime(booking.time) || 'Н/Д'}</div>
                        </td>
                        <td className="px-6 py-4 font-medium text-yellow-500">
                          {booking.totalPrice ? `${booking.totalPrice.toLocaleString()} ₽` : 'Н/Д'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`flex items-center ${statusInfo.color}`}>
                            {statusInfo.icon}
                            <span className="ml-1">{statusInfo.label}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            className="text-red-600 hover:text-red-500 transition-colors duration-200"
                            onClick={() => navigate(`/admin/bookings/${booking.id}`)}
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Пагинация */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center p-4 border-t border-gray-700">
                <div className="text-sm text-gray-400">
                  Показано {(currentPage - 1) * perPage + 1} - {Math.min(currentPage * perPage, filteredBookings.length)} из {filteredBookings.length}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    className="flex items-center px-3 py-1 border border-gray-700 rounded-md text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={`px-3 py-1 rounded-md ${
                        page === currentPage
                          ? 'bg-red-600 text-white'
                          : 'text-gray-300 hover:bg-gray-700'
                      }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    className="flex items-center px-3 py-1 border border-gray-700 rounded-md text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-6 text-center text-gray-400">
            <p className="mb-2">Записи не найдены</p>
            <p className="text-sm">
              {searchTerm || statusFilter !== 'all' || dateFilter ? (
                'Попробуйте изменить параметры поиска или фильтрации'
              ) : (
                'Пока нет записей на услуги'
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;