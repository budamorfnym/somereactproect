// src/components/admin/AdminServices.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { useNotification } from '../../hooks/useNotification';
import LoadingSpinner from '../common/LoadingSpinner';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  
  const { api } = useAppContext();
  const { success, error } = useNotification();
  const navigate = useNavigate();
  
  // Загрузка услуг и категорий при монтировании
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Загрузка категорий и услуг параллельно
        const [categoriesRes, servicesRes] = await Promise.all([
          api.get('/categories'),
          api.get('/admin/services')
        ]);
        
        setCategories([{ id: 'all', name: 'Все категории' }, ...categoriesRes.data]);
        setServices(servicesRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        error('Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [api, error]);
  
  // Фильтрация услуг
  const filteredServices = services.filter(service => {
    // Фильтр по категории
    if (categoryFilter !== 'all' && service.category !== categoryFilter) {
      return false;
    }
    
    // Поиск по названию или описанию
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        service.name.toLowerCase().includes(term) ||
        service.description.toLowerCase().includes(term)
      );
    }
    
    return true;
  });
  
  // Обработчик удаления услуги
  const handleDeleteService = async () => {
    if (!serviceToDelete) return;
    
    try {
      setLoading(true);
      
      await api.delete(`/admin/services/${serviceToDelete.id}`);
      
      // Обновляем список услуг
      setServices(services.filter(s => s.id !== serviceToDelete.id));
      
      success('Услуга успешно удалена');
      setShowDeleteModal(false);
      setServiceToDelete(null);
    } catch (err) {
      console.error('Error deleting service:', err);
      error('Не удалось удалить услугу');
    } finally {
      setLoading(false);
    }
  };
  
  // Обработчик изменения статуса активности
  const handleToggleActive = async (service) => {
    try {
      setLoading(true);
      
      const updatedService = { ...service, active: !service.active };
      await api.put(`/admin/services/${service.id}`, updatedService);
      
      // Обновляем состояние
      setServices(services.map(s => 
        s.id === service.id ? { ...s, active: !s.active } : s
      ));
      
      success(`Услуга ${updatedService.active ? 'активирована' : 'деактивирована'}`);
    } catch (err) {
      console.error('Error updating service:', err);
      error('Не удалось обновить статус услуги');
    } finally {
      setLoading(false);
    }
  };
  
  // Отображение модального окна подтверждения удаления
  const confirmDelete = (service) => {
    setServiceToDelete(service);
    setShowDeleteModal(true);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Управление услугами</h1>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded flex items-center hover:bg-red-700 transition-colors duration-200"
          onClick={() => navigate('/admin/services/new')}
        >
          <Plus size={20} className="mr-2" /> Добавить услугу
        </button>
      </div>
      
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
              placeholder="Поиск услуг..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <select
              className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg block w-full p-2.5"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex space-x-2">
            <button
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors duration-200 flex-grow"
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
              }}
            >
              Сбросить фильтры
            </button>
          </div>
        </div>
      </div>
      
      {/* Таблица услуг */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-6">
            <LoadingSpinner />
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Название
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Категория
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Длительность
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Цена
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredServices.map(service => (
                  <tr key={service.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{service.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        {categories.find(c => c.id === service.category)?.name || service.category}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{service.duration} мин.</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-yellow-500">{service.price.toLocaleString()} ₽</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          service.active
                            ? 'bg-green-900 text-green-400'
                            : 'bg-red-900 text-red-400'
                        }`}
                      >
                        {service.active ? 'Активна' : 'Неактивна'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        className="text-gray-400 hover:text-white"
                        onClick={() => handleToggleActive(service)}
                      >
                        {service.active ? <XCircle size={18} /> : <CheckCircle size={18} />}
                      </button>
                      <button
                        className="text-gray-400 hover:text-blue-500"
                        onClick={() => navigate(`/admin/services/${service.id}/edit`)}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="text-gray-400 hover:text-red-500"
                        onClick={() => confirmDelete(service)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>Услуги не найдены</p>
          </div>
        )}
      </div>
      
      {/* Модальное окно подтверждения удаления */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-medium text-white mb-4">Подтверждение удаления</h3>
            <p className="text-gray-300 mb-6">
              Вы уверены, что хотите удалить услугу "{serviceToDelete?.name}"? Это действие нельзя будет отменить.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors duration-200"
                onClick={() => {
                  setShowDeleteModal(false);
                  setServiceToDelete(null);
                }}
              >
                Отмена
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
                onClick={handleDeleteService}
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;