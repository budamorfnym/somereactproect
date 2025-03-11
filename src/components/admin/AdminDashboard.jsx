import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart2, Calendar, Users, Wrench, CreditCard, TrendingUp, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { formatDate, formatCurrency } from '../../utils/formatters';
import LoadingSpinner from '../common/LoadingSpinner';

const AdminDashboard = () => {
  const { api } = useAppContext();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    popularServices: []
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  
  // Load dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // In a real application, this would be a single API call to get all dashboard data
        // For this example, we'll simulate the API responses
        
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate statistics data
        setStats({
          todayBookings: 8,
          pendingBookings: 5,
          completedBookings: 120,
          totalRevenue: 256000,
          totalCustomers: 85,
          popularServices: [
            { id: 1, name: 'Комплексная мойка', count: 45 },
            { id: 2, name: 'Химчистка салона', count: 32 },
            { id: 3, name: 'Полировка кузова', count: 28 },
            { id: 4, name: 'Керамика', count: 15 },
            { id: 5, name: 'Тонировка', count: 12 }
          ]
        });
        
        // Simulate recent bookings
        setRecentBookings([
          {
            id: 'B123456',
            service: { name: 'Комплексная мойка' },
            user: { name: 'Алексей К.' },
            date: '2023-08-15',
            time: '14:30',
            status: 'completed',
            totalPrice: 2500
          },
          {
            id: 'B123457',
            service: { name: 'Химчистка салона' },
            user: { name: 'Мария В.' },
            date: '2023-08-15',
            time: '12:00',
            status: 'completed',
            totalPrice: 3800
          },
          {
            id: 'B123458',
            service: { name: 'Полировка фар' },
            user: { name: 'Дмитрий С.' },
            date: '2023-08-14',
            time: '16:45',
            status: 'completed',
            totalPrice: 1200
          },
          {
            id: 'B123459',
            service: { name: 'Керамика' },
            user: { name: 'Елена П.' },
            date: '2023-08-14',
            time: '10:30',
            status: 'cancelled',
            totalPrice: 18000
          },
          {
            id: 'B123460',
            service: { name: 'Тонировка' },
            user: { name: 'Игорь Л.' },
            date: '2023-08-13',
            time: '15:00',
            status: 'completed',
            totalPrice: 4500
          },
        ]);
        
        // Simulate upcoming bookings
        setUpcomingBookings([
          {
            id: 'B123461',
            service: { name: 'Комплексная мойка' },
            user: { name: 'Сергей Н.' },
            date: '2023-08-16',
            time: '10:00',
            status: 'confirmed',
            totalPrice: 2500
          },
          {
            id: 'B123462',
            service: { name: 'Химчистка салона' },
            user: { name: 'Анна К.' },
            date: '2023-08-16',
            time: '13:30',
            status: 'confirmed',
            totalPrice: 4000
          },
          {
            id: 'B123463',
            service: { name: 'Полировка кузова' },
            user: { name: 'Максим Д.' },
            date: '2023-08-16',
            time: '15:00',
            status: 'pending',
            totalPrice: 15000
          },
          {
            id: 'B123464',
            service: { name: 'Керамика' },
            user: { name: 'Олег В.' },
            date: '2023-08-17',
            time: '11:00',
            status: 'confirmed',
            totalPrice: 20000
          },
          {
            id: 'B123465',
            service: { name: 'Тонировка' },
            user: { name: 'Наталья П.' },
            date: '2023-08-17',
            time: '14:00',
            status: 'pending',
            totalPrice: 5000
          },
        ]);
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [api]);
  
  // Get status info for styling
  const getStatusInfo = (status) => {
    const statusMap = {
      'pending': { label: 'Ожидает', color: 'text-yellow-500', icon: <Clock size={16} /> },
      'confirmed': { label: 'Подтверждена', color: 'text-green-500', icon: <CheckCircle size={16} /> },
      'in-progress': { label: 'В процессе', color: 'text-blue-500', icon: <Clock size={16} /> },
      'completed': { label: 'Завершена', color: 'text-green-500', icon: <CheckCircle size={16} /> },
      'cancelled': { label: 'Отменена', color: 'text-red-500', icon: <XCircle size={16} /> }
    };
    
    return statusMap[status] || { label: status, color: 'text-gray-400', icon: <Clock size={16} /> };
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Панель управления</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center shadow-sm">
          <div className="bg-red-600 bg-opacity-20 p-3 rounded-lg mr-4">
            <Calendar size={24} className="text-red-600" />
          </div>
          <div>
            <div className="text-gray-400 text-sm">Записи сегодня</div>
            <div className="text-white text-xl font-bold">{stats.todayBookings}</div>
          </div>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center shadow-sm">
          <div className="bg-yellow-600 bg-opacity-20 p-3 rounded-lg mr-4">
            <Clock size={24} className="text-yellow-600" />
          </div>
          <div>
            <div className="text-gray-400 text-sm">Ожидают подтверждения</div>
            <div className="text-white text-xl font-bold">{stats.pendingBookings}</div>
          </div>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center shadow-sm">
          <div className="bg-green-600 bg-opacity-20 p-3 rounded-lg mr-4">
            <Users size={24} className="text-green-600" />
          </div>
          <div>
            <div className="text-gray-400 text-sm">Клиентов</div>
            <div className="text-white text-xl font-bold">{stats.totalCustomers}</div>
          </div>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center shadow-sm">
          <div className="bg-blue-600 bg-opacity-20 p-3 rounded-lg mr-4">
            <CreditCard size={24} className="text-blue-600" />
          </div>
          <div>
            <div className="text-gray-400 text-sm">Общая выручка</div>
            <div className="text-white text-xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Chart - This would be a real chart in a real application */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 lg:col-span-2 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-white">Статистика записей</h2>
            <div className="bg-gray-700 rounded-lg overflow-hidden flex text-sm">
              <button className="px-3 py-1 bg-red-600 text-white">Неделя</button>
              <button className="px-3 py-1 text-gray-300 hover:bg-gray-600">Месяц</button>
              <button className="px-3 py-1 text-gray-300 hover:bg-gray-600">Год</button>
            </div>
          </div>
          
          {/* Placeholder for chart */}
          <div className="bg-gray-900 rounded-lg h-64 flex items-center justify-center">
            <BarChart2 size={48} className="text-gray-700" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-900 p-3 rounded-lg">
              <div className="text-gray-400 text-sm">Записи</div>
              <div className="text-white font-bold">{stats.completedBookings}</div>
              <div className="text-green-500 text-xs flex items-center">
                <TrendingUp size={12} className="mr-1" /> +12.5%
              </div>
            </div>
            
            <div className="bg-gray-900 p-3 rounded-lg">
              <div className="text-gray-400 text-sm">Средний чек</div>
              <div className="text-white font-bold">3,250 ₽</div>
              <div className="text-green-500 text-xs flex items-center">
                <TrendingUp size={12} className="mr-1" /> +5.2%
              </div>
            </div>
            
            <div className="bg-gray-900 p-3 rounded-lg">
              <div className="text-gray-400 text-sm">Конверсия</div>
              <div className="text-white font-bold">76.4%</div>
              <div className="text-red-500 text-xs flex items-center">
                <TrendingUp size={12} className="mr-1" className="transform rotate-180" /> -2.8%
              </div>
            </div>
          </div>
        </div>
        
        {/* Popular Services */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-white">Популярные услуги</h2>
            <button className="text-sm text-red-600 hover:text-red-500" onClick={() => navigate('/admin/services')}>
              Все услуги
            </button>
          </div>
          
          <div className="space-y-4">
            {stats.popularServices.map((service, index) => (
              <div key={service.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-lg mr-3 flex items-center justify-center ${
                  index === 0 ? 'bg-yellow-600' : 
                  index === 1 ? 'bg-gray-500' : 
                  index === 2 ? 'bg-yellow-700' : 'bg-gray-700'
                } text-white font-medium`}>
                  {index + 1}
                </div>
                <div className="flex-grow">
                  <div className="text-white">{service.name}</div>
                  <div className="text-gray-400 text-sm">{service.count} записей</div>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            className="w-full mt-6 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors duration-200"
            onClick={() => navigate('/admin/services/new')}
          >
            Добавить услугу
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-sm">
          <div className="p-6 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-medium text-white">Недавние записи</h2>
            <button className="text-sm text-red-600 hover:text-red-500" onClick={() => navigate('/admin/bookings')}>
              Все записи
            </button>
          </div>
          
          <div className="divide-y divide-gray-700">
            {recentBookings.map(booking => {
              const statusInfo = getStatusInfo(booking.status);
              
              return (
                <div key={booking.id} className="p-4 hover:bg-gray-700 transition-colors duration-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center mb-1">
                        <span className="text-gray-400">{booking.id}</span>
                        <span className={`ml-2 flex items-center ${statusInfo.color}`}>
                          {statusInfo.icon}
                          <span className="ml-1 text-xs">{statusInfo.label}</span>
                        </span>
                      </div>
                      <div className="text-white">{booking.service.name}</div>
                      <div className="text-gray-400 text-sm">{booking.user.name} • {formatDate(new Date(booking.date))}, {booking.time}</div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-yellow-500 font-bold mr-4">
                        {formatCurrency(booking.totalPrice)}
                      </div>
                      <button
                        className="text-gray-400 hover:text-white"
                        onClick={() => navigate(`/admin/bookings/${booking.id}`)}
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Upcoming Bookings */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-sm">
          <div className="p-6 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-medium text-white">Предстоящие записи</h2>
            <button className="text-sm text-red-600 hover:text-red-500" onClick={() => navigate('/admin/bookings')}>
              Календарь
            </button>
          </div>
          
          <div className="divide-y divide-gray-700">
            {upcomingBookings.map(booking => {
              const statusInfo = getStatusInfo(booking.status);
              
              return (
                <div key={booking.id} className="p-4 hover:bg-gray-700 transition-colors duration-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center mb-1">
                        <span className="text-gray-400">{booking.id}</span>
                        <span className={`ml-2 flex items-center ${statusInfo.color}`}>
                          {statusInfo.icon}
                          <span className="ml-1 text-xs">{statusInfo.label}</span>
                        </span>
                      </div>
                      <div className="text-white">{booking.service.name}</div>
                      <div className="text-gray-400 text-sm">{booking.user.name} • {formatDate(new Date(booking.date))}, {booking.time}</div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-yellow-500 font-bold mr-4">
                        {formatCurrency(booking.totalPrice)}
                      </div>
                      <button
                        className="text-gray-400 hover:text-white"
                        onClick={() => navigate(`/admin/bookings/${booking.id}`)}
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;