import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart2, Calendar, Users, Package, CreditCard, TrendingUp, 
  Clock, CheckCircle, XCircle, Eye, AlertTriangle, ChevronRight,
  ArrowUpRight, ArrowDownRight, Activity, Percent, DollarSign
} from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import { userService } from '../../services/userService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import LoadingSpinner from '../common/LoadingSpinner';
import StatCard from '../common/StatCard';
import { LineChart, BarChart } from '../charts';

const AdminDashboard = () => {
  // State
  const [period, setPeriod] = useState('week');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [bookingCountData, setBookingCountData] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [topServices, setTopServices] = useState([]);
  const [userStats, setUserStats] = useState(null);
  
  const navigate = useNavigate();
  
  // Load dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Load dashboard data
        const [
          dashboardResult,
          recentBookingsResult,
          upcomingBookingsResult,
          topServicesResult,
          userStatsResult
        ] = await Promise.all([
          bookingService.getBookingDashboard(period),
          bookingService.getAllBookings({ limit: 5, sort: '-createdAt' }),
          bookingService.getAllBookings({ status: 'confirmed,pending', 
                                         limit: 5, 
                                         sort: 'date,time' }),
          bookingService.getTopServices(period),
          userService.getUserStats()
        ]);
        
        setDashboardData(dashboardResult);
        setRecentBookings(recentBookingsResult.data);
        setUpcomingBookings(upcomingBookingsResult.data);
        setTopServices(topServicesResult);
        setUserStats(userStatsResult);
        
        // Prepare chart data
        if (dashboardResult.revenueByDay) {
          const revenueChartData = Object.entries(dashboardResult.revenueByDay).map(([date, value]) => ({
            date,
            revenue: value
          }));
          setRevenueData(revenueChartData);
        }
        
        if (dashboardResult.bookingsByDay) {
          const bookingChartData = Object.entries(dashboardResult.bookingsByDay).map(([date, value]) => ({
            date,
            bookings: value
          }));
          setBookingCountData(bookingChartData);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [period]);
  
  // Status info for styling
  const getStatusInfo = (status) => {
    const statusMap = {
      'pending': { 
        label: 'Ожидает', 
        color: 'text-yellow-500', 
        icon: <Clock size={16} />,
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800'
      },
      'confirmed': { 
        label: 'Подтверждена', 
        color: 'text-green-500', 
        icon: <CheckCircle size={16} />,
        bgColor: 'bg-green-100',
        textColor: 'text-green-800'
      },
      'in-progress': { 
        label: 'В процессе', 
        color: 'text-blue-500', 
        icon: <Clock size={16} />,
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800'
      },
      'completed': { 
        label: 'Завершена', 
        color: 'text-green-500', 
        icon: <CheckCircle size={16} />,
        bgColor: 'bg-green-100',
        textColor: 'text-green-800'
      },
      'cancelled': { 
        label: 'Отменена', 
        color: 'text-red-500', 
        icon: <XCircle size={16} />,
        bgColor: 'bg-red-100',
        textColor: 'text-red-800'
      }
    };
    
    return statusMap[status] || { 
      label: 'Неизвестно', 
      color: 'text-gray-400', 
      icon: <AlertTriangle size={16} />,
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800'
    };
  };
  
  // Stats cards data
  const statsCards = useMemo(() => {
    if (!dashboardData) return [];
    
    return [
      {
        title: 'Записи сегодня',
        value: dashboardData.todayBookings || 0,
        icon: <Calendar size={24} className="text-red-600" />,
        change: dashboardData.todayBookingsChange,
        changeLabel: 'с прошлого дня',
        bg: 'bg-red-600',
        onClick: () => navigate('/admin/bookings?date=today')
      },
      {
        title: 'Ожидают подтверждения',
        value: dashboardData.pendingBookings || 0,
        icon: <Clock size={24} className="text-yellow-600" />,
        change: dashboardData.pendingBookingsChange,
        changeLabel: 'с прошлой недели',
        bg: 'bg-yellow-600',
        onClick: () => navigate('/admin/bookings?status=pending')
      },
      {
        title: 'Новых клиентов',
        value: userStats?.newUsers || 0,
        icon: <Users size={24} className="text-green-600" />,
        change: userStats?.newUsersChange,
        changeLabel: 'с прошлого месяца',
        bg: 'bg-green-600',
        onClick: () => navigate('/admin/users?filter=new')
      },
      {
        title: 'Выручка за период',
        value: formatCurrency(dashboardData.totalRevenue || 0, '₽'),
        icon: <CreditCard size={24} className="text-blue-600" />,
        change: dashboardData.revenueChange,
        changeLabel: 'по сравнению с пред. периодом',
        bg: 'bg-blue-600',
        onClick: () => navigate('/admin/reports')
      }
    ];
  }, [dashboardData, userStats, navigate]);
  
  // Secondary stats cards data
  const secondaryStats = useMemo(() => {
    if (!dashboardData) return [];
    
    return [
      {
        title: 'Средний чек',
        value: formatCurrency(dashboardData.averageOrderValue || 0, '₽'),
        icon: <DollarSign size={20} className="text-white" />,
        change: dashboardData.averageOrderValueChange,
        bg: 'bg-violet-600'
      },
      {
        title: 'Конверсия записей',
        value: `${dashboardData.conversionRate || 0}%`,
        icon: <Percent size={20} className="text-white" />,
        change: dashboardData.conversionRateChange,
        bg: 'bg-pink-600'
      },
      {
        title: 'Коэффициент отмены',
        value: `${dashboardData.cancellationRate || 0}%`,
        icon: <Activity size={20} className="text-white" />,
        change: -dashboardData.cancellationRateChange,
        invertChange: true,
        bg: 'bg-orange-600'
      }
    ];
  }, [dashboardData]);
  
  // Period selector options
  const periodOptions = [
    { value: 'week', label: 'Неделя' },
    { value: 'month', label: 'Месяц' },
    { value: 'quarter', label: 'Квартал' },
    { value: 'year', label: 'Год' }
  ];
  
  // Loading state
  if (loading && !dashboardData) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <LoadingSpinner />
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-white mb-3 md:mb-0">Панель управления</h1>
        
        <div className="bg-gray-700 rounded-lg overflow-hidden flex text-sm">
          {periodOptions.map(option => (
            <button
              key={option.value}
              className={`px-4 py-2 ${
                period === option.value 
                  ? 'bg-red-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-600'
              }`}
              onClick={() => setPeriod(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Main stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statsCards.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            changeLabel={stat.changeLabel}
            bgColor={stat.bg}
            onClick={stat.onClick}
          />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue chart */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 lg:col-span-2 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-white">Динамика выручки</h2>
            <div className="text-sm text-gray-400">
              {dashboardData && dashboardData.periodLabel}
            </div>
          </div>
          
          <div className="h-64">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <LoadingSpinner />
              </div>
            ) : revenueData.length > 0 ? (
              <LineChart 
                data={revenueData} 
                xKey="date" 
                yKeys={["revenue"]} 
                colors={["#e62d2d"]}
                labels={["Выручка"]}
                formatY={(value) => `${value.toLocaleString()} ₽`}
              />
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-400">Нет данных для отображения</p>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            {secondaryStats.map((stat, index) => (
              <div key={index} className="bg-gray-900 p-3 rounded-lg">
                <div className="text-gray-400 text-sm">{stat.title}</div>
                <div className="text-white font-bold">{stat.value}</div>
                <div className={`text-xs flex items-center ${
                  stat.change > 0 
                    ? 'text-green-500' 
                    : stat.change < 0 
                      ? 'text-red-500' 
                      : 'text-gray-400'
                }`}>
                  {stat.change > 0 ? (
                    <>
                      <ArrowUpRight size={12} className="mr-1" /> 
                      +{stat.invertChange ? -stat.change : stat.change}%
                    </>
                  ) : stat.change < 0 ? (
                    <>
                      <ArrowDownRight size={12} className="mr-1" /> 
                      {stat.invertChange ? -stat.change : stat.change}%
                    </>
                  ) : (
                    '0%'
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Top services */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-white">Популярные услуги</h2>
            <button 
              className="text-sm text-red-600 hover:text-red-500" 
              onClick={() => navigate('/admin/services')}
            >
              Все услуги
            </button>
          </div>
          
          {loading ? (
            <LoadingSpinner />
          ) : topServices.length > 0 ? (
            <div className="space-y-4">
              {topServices.map((service, index) => (
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
                    <div className="text-gray-400 text-sm flex justify-between">
                      <span>{service.count} записей</span>
                      <span className="text-yellow-500">{formatCurrency(service.revenue, '₽')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>Нет данных о популярных услугах</p>
            </div>
          )}
          
          {topServices.length > 0 && (
            <div className="h-48 mt-6">
              <BarChart 
                data={topServices.slice(0, 5)} 
                xKey="name" 
                yKeys={["count"]} 
                colors={["#e62d2d"]}
                layout="vertical"
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent bookings */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-sm">
          <div className="p-6 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-medium text-white">Недавние записи</h2>
            <button 
              className="text-sm text-red-600 hover:text-red-500"
              onClick={() => navigate('/admin/bookings')}
            >
              Все записи
            </button>
          </div>
          
          {loading ? (
            <div className="p-6">
              <LoadingSpinner />
            </div>
          ) : recentBookings.length > 0 ? (
            <div className="divide-y divide-gray-700">
              {recentBookings.map(booking => {
                const statusInfo = getStatusInfo(booking.status);
                
                return (
                  <div key={booking.id} className="p-4 hover:bg-gray-700 transition-colors duration-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center mb-1">
                          <span className="text-gray-400">{booking.id}</span>
                          <span className={`ml-2 ${statusInfo.bgColor} ${statusInfo.textColor} px-2 py-0.5 rounded-full text-xs font-medium flex items-center`}>
                            {statusInfo.icon}
                            <span className="ml-1">{statusInfo.label}</span>
                          </span>
                        </div>
                        <div className="text-white">{booking.service?.name}</div>
                        <div className="text-gray-400 text-sm">{booking.user?.name} • {formatDate(new Date(booking.date))}, {booking.time}</div>
                      </div>
                      <div className="flex items-center">
                        <div className="text-yellow-500 font-bold mr-4">
                          {formatCurrency(booking.totalPrice, '₽')}
                        </div>
                        <button
                          className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-600"
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
          ) : (
            <div className="p-6 text-center text-gray-400">
              <p>Нет недавних записей</p>
            </div>
          )}
        </div>
        
        {/* Upcoming bookings */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-sm">
          <div className="p-6 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-medium text-white">Предстоящие записи</h2>
            <button 
              className="text-sm text-red-600 hover:text-red-500"
              onClick={() => navigate('/admin/bookings?status=confirmed,pending')}
            >
              Календарь
            </button>
          </div>
          
          {loading ? (
            <div className="p-6">
              <LoadingSpinner />
            </div>
          ) : upcomingBookings.length > 0 ? (
            <div className="divide-y divide-gray-700">
              {upcomingBookings.map(booking => {
                const statusInfo = getStatusInfo(booking.status);
                
                return (
                  <div key={booking.id} className="p-4 hover:bg-gray-700 transition-colors duration-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center mb-1">
                          <span className="text-gray-400">{booking.id}</span>
                          <span className={`ml-2 ${statusInfo.bgColor} ${statusInfo.textColor} px-2 py-0.5 rounded-full text-xs font-medium flex items-center`}>
                            {statusInfo.icon}
                            <span className="ml-1">{statusInfo.label}</span>
                          </span>
                        </div>
                        <div className="text-white">{booking.service?.name}</div>
                        <div className="text-gray-400 text-sm">{booking.user?.name} • {formatDate(new Date(booking.date))}, {booking.time}</div>
                      </div>
                      <div className="flex items-center">
                        <div className="text-yellow-500 font-bold mr-4">
                          {formatCurrency(booking.totalPrice, '₽')}
                        </div>
                        <button
                          className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-600"
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
          ) : (
            <div className="p-6 text-center text-gray-400">
              <p>Нет предстоящих записей</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;