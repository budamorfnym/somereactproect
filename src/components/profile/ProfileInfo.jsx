import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { Mail, Phone, Edit } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const ProfileInfo = ({ user }) => {
  const { updateProfile } = useAuth();
  const { success, error } = useNotification();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email) {
      error('Пожалуйста, заполните обязательные поля');
      return;
    }
    
    try {
      setLoading(true);
      await updateProfile(formData);
      success('Профиль успешно обновлен');
      setIsEditing(false);
    } catch (err) {
      error('Не удалось обновить профиль');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    });
    setIsEditing(false);
  };
  
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
      <div className="p-6 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Личная информация</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-red-600 hover:text-red-500 flex items-center"
            >
              <Edit size={16} className="mr-1" /> Редактировать
            </button>
          )}
        </div>
      </div>
      
      <div className="p-6">
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Имя <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Телефон <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors duration-200"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? <LoadingSpinner /> : 'Сохранить'}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-xl font-bold text-white mr-4">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div className="text-xl font-medium text-white">{user?.name}</div>
                <div className="text-sm text-gray-400">
                  Клиент с {new Date(user?.createdAt || Date.now()).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long' })}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Электронная почта</div>
                  <div className="flex items-center text-white">
                    <Mail size={16} className="text-gray-400 mr-2" />
                    {user?.email}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-400 mb-1">Телефон</div>
                  <div className="flex items-center text-white">
                    <Phone size={16} className="text-gray-400 mr-2" />
                    {user?.phone || 'Не указан'}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Количество записей</div>
                  <div className="text-white">{user?.bookingsCount || 0}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-400 mb-1">Бонусные баллы</div>
                  <div className="text-yellow-500 font-medium">{user?.loyaltyPoints || 0} баллов</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-400 mb-1">Статус лояльности</div>
                  <div className="text-white">{user?.loyaltyStatus || 'Новичок'}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileInfo;