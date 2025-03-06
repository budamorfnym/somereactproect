import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useBooking } from '../hooks/useBooking';
import { useCars } from '../hooks/useCars';
import { Award, User, Car, Calendar, History, LogOut } from 'lucide-react';
import ProfileInfo from '../components/profile/ProfileInfo';
import ProfileBookings from '../components/profile/ProfileBookings';
import ProfileLoyalty from '../components/profile/ProfileLoyalty';
import ProfileSettings from '../components/profile/ProfileSettings';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProfilePage = () => {
  const { currentUser, logout, loading: authLoading } = useAuth();
  const { getUserBookings } = useBooking();
  const { loadUserCars } = useCars();
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  
  // Определение активной вкладки на основе URL
  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (path && ['profile', 'bookings', 'cars', 'loyalty', 'settings'].includes(path)) {
      setActiveTab(path);
    } else if (location.pathname === '/profile') {
      setActiveTab('profile');
    }
  }, [location.pathname]);
  
  // Загрузка данных профиля
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        // Параллельно загружаем необходимые данные
        await Promise.all([
          getUserBookings(),
          loadUserCars()
        ]);
      } catch (err) {
        console.error('Error loading profile data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser) {
      loadProfileData();
    }
  }, [currentUser, getUserBookings, loadUserCars]);
  
  if (authLoading) {
    return <LoadingSpinner fullscreen />;
  }
  
  // Если пользователь не аутентифицирован, перенаправляем на страницу входа
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  const tabs = [
    { id: 'profile', label: 'Профиль', icon: <User size={20} />, path: '/profile' },
    { id: 'bookings', label: 'Мои записи', icon: <Calendar size={20} />, path: '/profile/bookings' },
    { id: 'cars', label: 'Мои автомобили', icon: <Car size={20} />, path: '/profile/cars' },
    { id: 'loyalty', label: 'Лояльность', icon: <Award size={20} />, path: '/profile/loyalty' },
    { id: 'settings', label: 'Настройки', icon: <User size={20} />, path: '/profile/settings' }
  ];
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Боковая панель */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-4">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-xl font-bold text-white mr-3">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <div className="font-medium text-white">{currentUser.name}</div>
                <div className="text-sm text-gray-400">{currentUser.email}</div>
              </div>
            </div>
            
            <div className="flex items-center text-yellow-500 mb-4">
              <Award size={16} className="mr-2" />
              <span className="font-medium">{currentUser.loyaltyPoints || 0} баллов</span>
            </div>
            
            <button
              onClick={logout}
              className="w-full flex items-center justify-center bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-200"
            >
              <LogOut size={16} className="mr-2" /> Выйти
            </button>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <nav>
              {tabs.map(tab => (
                <Link
                  key={tab.id}
                  to={tab.path}
                  className={`flex items-center px-4 py-3 hover:bg-gray-700 transition-colors duration-200 ${
                    activeTab === tab.id ? 'bg-gray-700 border-l-4 border-red-600' : 'border-l-4 border-transparent'
                  }`}
                >
                  <span className={`mr-3 ${activeTab === tab.id ? 'text-red-600' : 'text-gray-400'}`}>
                    {tab.icon}
                  </span>
                  <span className={activeTab === tab.id ? 'text-white font-medium' : 'text-gray-400'}>
                    {tab.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Основное содержимое */}
        <div className="flex-grow">
          {loading ? (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <LoadingSpinner />
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<ProfileInfo user={currentUser} />} />
              <Route path="/bookings" element={<ProfileBookings />} />
              <Route path="/cars" element={<Navigate to="/cars" replace />} />
              <Route path="/loyalty" element={<ProfileLoyalty />} />
              <Route path="/settings" element={<ProfileSettings />} />
            </Routes>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;