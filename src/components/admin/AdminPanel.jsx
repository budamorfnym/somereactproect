import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import { 
  Home, Users, Settings, Calendar, Package, 
  BarChart2, Tag, LogOut, Menu, X, Database
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import AdminDashboard from './AdminDashboard';
import AdminServices from './AdminServices';
import AdminServiceForm from './AdminServiceForm';
import AdminBookings from './AdminBookings';
import AdminBookingDetails from './AdminBookingDetails';
import AdminUsers from './AdminUsers';
import AdminUserDetails from './AdminUserDetails';
import AdminCategories from './AdminCategories';
import AdminSettings from './AdminSettings';

const AdminPanel = () => {
  const { currentUser, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  // Проверяем роль пользователя
  if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'staff')) {
    return <Navigate to="/" replace />;
  }
  
  // Навигационные элементы
  const navItems = [
    { path: '/admin', label: 'Панель управления', icon: <Home size={20} /> },
    { path: '/admin/bookings', label: 'Записи', icon: <Calendar size={20} /> },
    { path: '/admin/services', label: 'Услуги', icon: <Package size={20} /> },
    { path: '/admin/categories', label: 'Категории', icon: <Tag size={20} /> },
    { path: '/admin/users', label: 'Клиенты', icon: <Users size={20} /> },
    { path: '/admin/reports', label: 'Отчеты', icon: <BarChart2 size={20} /> },
    { path: '/admin/settings', label: 'Настройки', icon: <Settings size={20} /> },
  ];
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Мобильная шапка */}
      <div className="md:hidden bg-black px-4 py-3 flex items-center justify-between fixed top-0 w-full z-50">
        <div className="flex items-center">
          <button
            className="text-gray-300 hover:text-white mr-3"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <span className="text-xl font-bold text-red-600">
            A1<span className="text-yellow-500">Detailing</span> <span className="text-white">Admin</span>
          </span>
        </div>
        
        <div className="flex items-center">
          <div className="bg-gray-800 p-2 rounded-full">
            <span className="text-white">{currentUser?.name?.charAt(0)}</span>
          </div>
        </div>
      </div>
      
      {/* Боковая панель (для десктопа всегда видима, для мобильного - по клику) */}
      <aside 
        className={`fixed md:static inset-0 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-200 ease-in-out md:relative z-30 md:z-0 bg-gray-800 md:min-h-screen w-64 md:w-64 md:flex-shrink-0 md:border-r md:border-gray-700 pt-16 md:pt-0`}
      >
        {/* Заголовок */}
        <div className="hidden md:flex items-center justify-between p-4 border-b border-gray-700">
          <span className="text-xl font-bold text-red-600">
            A1<span className="text-yellow-500">Detailing</span>
          </span>
          <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">Admin</span>
        </div>
        
        {/* Меню */}
        <nav className="p-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors duration-200"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        
        {/* Информация о пользователе */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-gray-900 p-2 rounded-full mr-3">
                <span className="text-white">{currentUser?.name?.charAt(0)}</span>
              </div>
              <div>
                <div className="text-white font-medium">{currentUser?.name}</div>
                <div className="text-gray-400 text-sm">{currentUser?.role === 'admin' ? 'Администратор' : 'Сотрудник'}</div>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="text-gray-400 hover:text-white"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
        
        {/* Затемнение фона при открытии мобильного меню */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-20"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
      </aside>
      
      {/* Основное содержимое */}
      <div className="flex-1 md:ml-0 mt-16 md:mt-0 overflow-x-hidden">
        <div className="p-4 md:p-6">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/bookings" element={<AdminBookings />} />
            <Route path="/bookings/:id" element={<AdminBookingDetails />} />
            <Route path="/services" element={<AdminServices />} />
            <Route path="/services/new" element={<AdminServiceForm />} />
            <Route path="/services/:id/edit" element={<AdminServiceForm />} />
            <Route path="/categories" element={<AdminCategories />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/users/:id" element={<AdminUserDetails />} />
            <Route path="/reports" element={<AdminReports />} />
            <Route path="/settings" element={<AdminSettings />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

// Плейсхолдер для пока не реализованной страницы отчетов
const AdminReports = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Отчеты</h1>
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-start">
          <Database size={24} className="text-gray-400 mr-2" />
          <div>
            <h2 className="text-lg font-medium text-white mb-2">Страница в разработке</h2>
            <p className="text-gray-400">
              Раздел отчетов находится в разработке и будет доступен в ближайшее время.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;