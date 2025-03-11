import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { KeyRound, Bell, Shield, LogOut } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const ProfileSettings = () => {
  const { currentUser, changePassword, logout } = useAuth();
  const { success, error } = useNotification();
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    bookingReminders: true,
    specialOffers: true,
    loyaltyUpdates: true
  });
  
  const [loading, setLoading] = useState(false);
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      error('Пожалуйста, заполните все поля');
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      error('Новые пароли не совпадают');
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      error('Новый пароль должен содержать не менее 8 символов');
      return;
    }
    
    try {
      setLoading(true);
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      success('Пароль успешно изменен');
      
      // Reset form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
    } catch (err) {
      error('Не удалось изменить пароль. Проверьте правильность текущего пароля.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // In a real application, you would save these settings to the server
      // For now, we'll just simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      success('Настройки уведомлений сохранены');
    } catch (err) {
      error('Не удалось сохранить настройки уведомлений');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    logout();
    // Redirect is handled by AuthContext
  };
  
  return (
    <div className="space-y-6">
      {/* Password Change Section */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <KeyRound size={24} className="text-yellow-500 mr-3" />
          <h2 className="text-xl font-medium text-white">Изменить пароль</h2>
        </div>
        
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Текущий пароль
            </label>
            <input
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Новый пароль
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Подтверждение нового пароля
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white"
              required
            />
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={loading}
            >
              {loading ? <LoadingSpinner /> : 'Сохранить новый пароль'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Notification Settings */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Bell size={24} className="text-blue-500 mr-3" />
          <h2 className="text-xl font-medium text-white">Настройки уведомлений</h2>
        </div>
        
        <form onSubmit={handleNotificationSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Email уведомления</div>
              <div className="text-sm text-gray-400">Получать уведомления на email</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="emailNotifications"
                checked={notificationSettings.emailNotifications}
                onChange={handleNotificationChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">SMS уведомления</div>
              <div className="text-sm text-gray-400">Получать уведомления по SMS</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="smsNotifications"
                checked={notificationSettings.smsNotifications}
                onChange={handleNotificationChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Напоминания о записях</div>
              <div className="text-sm text-gray-400">Получать напоминания о предстоящих записях</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="bookingReminders"
                checked={notificationSettings.bookingReminders}
                onChange={handleNotificationChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Специальные предложения</div>
              <div className="text-sm text-gray-400">Получать уведомления о специальных предложениях и акциях</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="specialOffers"
                checked={notificationSettings.specialOffers}
                onChange={handleNotificationChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Обновления программы лояльности</div>
              <div className="text-sm text-gray-400">Получать уведомления об изменениях в программе лояльности</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="loyaltyUpdates"
                checked={notificationSettings.loyaltyUpdates}
                onChange={handleNotificationChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={loading}
            >
              {loading ? <LoadingSpinner /> : 'Сохранить настройки'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Privacy Section */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Shield size={24} className="text-green-500 mr-3" />
          <h2 className="text-xl font-medium text-white">Конфиденциальность и безопасность</h2>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-900 p-4 rounded">
            <div className="text-white font-medium mb-2">Политика конфиденциальности</div>
            <p className="text-gray-400 text-sm mb-2">
              Ознакомьтесь с нашей политикой по обработке персональных данных и защите конфиденциальности.
            </p>
            <a href="/privacy" className="text-red-600 hover:text-red-500 text-sm">
              Прочитать политику конфиденциальности
            </a>
          </div>
          
          <div className="bg-gray-900 p-4 rounded">
            <div className="text-white font-medium mb-2">Пользовательское соглашение</div>
            <p className="text-gray-400 text-sm mb-2">
              Ознакомьтесь с условиями использования нашего сервиса.
            </p>
            <a href="/terms" className="text-red-600 hover:text-red-500 text-sm">
              Прочитать пользовательское соглашение
            </a>
          </div>
          
          <div className="bg-gray-900 p-4 rounded">
            <div className="text-white font-medium mb-2">Удаление аккаунта</div>
            <p className="text-gray-400 text-sm mb-2">
              Если вы хотите удалить свой аккаунт, отправьте запрос в службу поддержки.
            </p>
            <a href="/contact" className="text-red-600 hover:text-red-500 text-sm">
              Связаться с поддержкой
            </a>
          </div>
        </div>
      </div>
      
      {/* Logout Button */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-medium text-white">Выйти из аккаунта</h2>
            <p className="text-gray-400 text-sm mt-1">
              Вы будете перенаправлены на страницу входа
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors duration-200 flex items-center"
          >
            <LogOut size={18} className="mr-2" /> Выйти
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;