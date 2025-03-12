// src/components/admin/AdminBookings.jsx - оптимизированная версия
import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, XCircle, AlertTriangle, Clock
} from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import LoadingSpinner from '../common/LoadingSpinner';
import BookingFilters from './booking/BookingFilters';
import BookingTable from './booking/BookingTable';
import BookingPagination from './booking/BookingPagination';
import EmptyBookingState from './booking/EmptyBookingState';

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
  
  // Сброс фильтров
  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFilter('');
    navigate('/admin/bookings');
  };

  // Переход к деталям бронирования
  const handleViewBooking = (bookingId) => {
    navigate(`/admin/bookings/${bookingId}`);
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Управление записями</h1>
      
      {/* Фильтры */}
      <BookingFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        onApplyFilters={handleFilterChange}
        onResetFilters={handleResetFilters}
      />
      
      {/* Таблица записей */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-6">
            <LoadingSpinner />
          </div>
        ) : filteredBookings.length > 0 ? (
          <>
            <BookingTable 
              bookings={paginatedBookings}
              getStatusInfo={getStatusInfo}
              onViewBooking={handleViewBooking}
            />
            
            <BookingPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredBookings.length}
              perPage={perPage}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <EmptyBookingState 
            hasFilters={searchTerm || statusFilter !== 'all' || dateFilter}
          />
        )}
      </div>
    </div>
  );
};

export default AdminBookings;