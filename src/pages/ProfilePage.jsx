// src/pages/ProfilePage.jsx - разделение на компоненты
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useBooking } from '../hooks/useData'; // Обновленный импорт
import { useCars } from '../hooks/useData'; // Обновленный импорт
import ProfileInfo from '../components/profile/ProfileInfo';
import ProfileBookings from '../components/profile/ProfileBookings';
import ProfileLoyalty from '../components/profile/ProfileLoyalty';
import ProfileSettings from '../components/profile/ProfileSettings';
import ProfileSidebar from '../components/profile/ProfileSidebar'; // Новый компонент
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProfilePage = () => {
  const { currentUser, loading: authLoading } = useAuth();
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
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Боковая панель */}
        <ProfileSidebar 
          currentUser={currentUser} 
          activeTab={activeTab} 
        />
        
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