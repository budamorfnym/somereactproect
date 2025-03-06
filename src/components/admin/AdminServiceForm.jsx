import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { useNotification } from '../../hooks/useNotification';
import LoadingSpinner from '../common/LoadingSpinner';

const AdminServiceForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: '',
    imageUrl: '',
    active: true
  });
  
  const [options, setOptions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  
  const { api } = useAppContext();
  const { success, error } = useNotification();
  const navigate = useNavigate();
  
  // Загрузка данных услуги и опций при редактировании
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Загрузка категорий
        const categoriesResponse = await api.get('/categories');
        setCategories(categoriesResponse.data.filter(cat => cat.id !== 'all'));
        
        // Если режим редактирования, загружаем данные услуги
        if (isEditMode) {
          const [serviceResponse, optionsResponse] = await Promise.all([
            api.get(`/services/${id}`),
            api.get(`/service-options/${id}`)
          ]);
          
          setFormData({
            name: serviceResponse.data.name || '',
            description: serviceResponse.data.description || '',
            price: serviceResponse.data.price || '',
            duration: serviceResponse.data.duration || '',
            category: serviceResponse.data.category || '',
            imageUrl: serviceResponse.data.imageUrl || '',
            active: serviceResponse.data.active !== undefined ? serviceResponse.data.active : true
          });
          
          setOptions(optionsResponse.data || []);
        }
      } catch (err) {
        error('Ошибка загрузки данных');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [api, id, isEditMode, error]);
  
  // Обработчик изменения полей формы
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Обработчик изменения опций
  const handleOptionChange = (index, field, value) => {
    const updatedOptions = [...options];
    updatedOptions[index][field] = value;
    setOptions(updatedOptions);
  };
  
  // Добавление новой опции
  const handleAddOption = () => {
    setOptions([
      ...options,
      {
        name: '',
        description: '',
        price: '',
        duration: '',
        active: true
      }
    ]);
  };
  
  // Удаление опции
  const handleRemoveOption = (index) => {
    const updatedOptions = [...options];
    updatedOptions.splice(index, 1);
    setOptions(updatedOptions);
  };
  
  // Сохранение услуги
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Валидация
    if (!formData.name || !formData.price || !formData.duration || !formData.category) {
      error('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Преобразование значений
      const serviceData = {
        ...formData,
        price: Number(formData.price),
        duration: Number(formData.duration)
      };
      
      // Создание или обновление услуги
      let serviceResponse;
      if (isEditMode) {
        serviceResponse = await api.put(`/admin/services/${id}`, serviceData);
      } else {
        serviceResponse = await api.post('/admin/services', serviceData);
      }
      
      // Сохранение опций услуги
      if (serviceResponse.data) {
        const serviceId = serviceResponse.data.id || id;
        
        // TODO: Реализовать сохранение опций
        // Это может потребовать отдельного API для массового обновления опций
        
        success(isEditMode ? 'Услуга успешно обновлена' : 'Услуга успешно создана');
        navigate('/admin/services');
      }
    } catch (err) {
      error(isEditMode ? 'Ошибка при обновлении услуги' : 'Ошибка при создании услуги');
      console.error('Error saving service:', err);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            className="mr-4 text-gray-400 hover:text-white transition-colors duration-200"
            onClick={() => navigate('/admin/services')}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-white">
            {isEditMode ? 'Редактирование услуги' : 'Создание новой услуги'}
          </h1>
        </div>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded flex items-center hover:bg-red-700 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <LoadingSpinner />
          ) : (
            <>
              <Save size={20} className="mr-2" /> Сохранить
            </>
          )}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Основная информация */}
        <div className="md:col-span-2">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-medium text-white mb-4">Основная информация</h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Название услуги <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white"
                  placeholder="Например: Комплексная мойка"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Описание <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white"
                  placeholder="Подробное описание услуги..."
                  required
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Цена (₽) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white"
                    placeholder="Например: 1500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Длительность (мин.) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white"
                    placeholder="Например: 60"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Категория <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white"
                    required
                  >
                    <option value="" disabled>Выберите категорию</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    URL изображения
                  </label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white"
                    placeholder="Например: https://example.com/image.jpg"
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="active"
                  id="active"
                  checked={formData.active}
                  onChange={handleChange}
                  className="w-4 h-4 bg-gray-700 border-gray-600 rounded focus:ring-red-600"
                />
                <label htmlFor="active" className="ml-2 text-sm font-medium text-gray-300">
                  Активная (доступна для бронирования)
                </label>
              </div>
            </form>
          </div>
          
          {/* Опции услуги */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-white">Опции услуги</h2>
              <button
                className="text-red-600 hover:text-red-500 flex items-center text-sm"
                onClick={handleAddOption}
              >
                <Plus size={16} className="mr-1" /> Добавить опцию
              </button>
            </div>
            
            {options.length > 0 ? (
              <div className="space-y-4">
                {options.map((option, index) => (
                  <div key={index} className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between mb-3">
                      <h3 className="text-white font-medium">Опция #{index + 1}</h3>
                      <button
                        className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                        onClick={() => handleRemoveOption(index)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Название <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={option.name}
                          onChange={(e) => handleOptionChange(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white"
                          placeholder="Например: Чернение резины"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Описание
                        </label>
                        <input
                          type="text"
                          value={option.description || ''}
                          onChange={(e) => handleOptionChange(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white"
                          placeholder="Краткое описание опции"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Цена (₽) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={option.price}
                          onChange={(e) => handleOptionChange(index, 'price', e.target.value)}
                          min="0"
                          step="1"
                          className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white"
                          placeholder="Например: 300"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Длительность (мин.) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={option.duration}
                          onChange={(e) => handleOptionChange(index, 'duration', e.target.value)}
                          min="0"
                          step="1"
                          className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white"
                          placeholder="Например: 15"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center">
                      <input
                        type="checkbox"
                        id={`option-active-${index}`}
                        checked={option.active !== undefined ? option.active : true}
                        onChange={(e) => handleOptionChange(index, 'active', e.target.checked)}
                        className="w-4 h-4 bg-gray-700 border-gray-600 rounded focus:ring-red-600"
                      />
                      <label htmlFor={`option-active-${index}`} className="ml-2 text-sm font-medium text-gray-300">
                        Активная (доступна для выбора)
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-900 border border-gray-700 rounded-lg">
                <p className="text-gray-400 mb-3">У этой услуги пока нет дополнительных опций</p>
                <button
                  className="text-red-600 hover:text-red-500 flex items-center mx-auto"
                  onClick={handleAddOption}
                >
                  <Plus size={16} className="mr-1" /> Добавить опцию
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Справка и предпросмотр */}
        <div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 sticky top-24">
            <h2 className="text-lg font-medium text-white mb-4">Информация</h2>
            
            <div className="text-gray-300 space-y-4 text-sm">
              <p>
                <span className="font-medium text-white">Категория услуги</span> определяет, 
                в каком разделе каталога она будет отображаться.
              </p>
              
              <p>
                <span className="font-medium text-white">Опции</span> - это дополнительные услуги, 
                которые клиент может выбрать при бронировании основной услуги. 
                Например, для мойки это может быть "Чернение резины" или "Полировка фар".
              </p>
              
              <p>
                <span className="font-medium text-white">URL изображения</span> - ссылка на изображение, 
                которое будет отображаться в карточке услуги. Рекомендуемый размер: 800x600 пикселей.
              </p>
              
              <p>
                Поля, отмеченные <span className="text-red-500">*</span>, обязательны для заполнения.
              </p>
            </div>
            
            {/* Предпросмотр карточки услуги */}
            {formData.name && (
              <div className="mt-6">
                <h3 className="text-white font-medium mb-2">Предпросмотр</h3>
                <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
                  {formData.imageUrl && (
                    <div className="h-48 bg-gray-700">
                      <img
                        src={formData.imageUrl}
                        alt={formData.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                        }}
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className="text-lg font-semibold text-white mb-2">{formData.name}</h4>
                    <p className="text-gray-400 mb-4 text-sm line-clamp-2">{formData.description}</p>
                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <span>{formData.duration ? `${formData.duration} мин.` : 'Длительность не указана'}</span>
                      <span className="text-yellow-500 font-bold">
                        {formData.price ? `${Number(formData.price).toLocaleString()} ₽` : 'Цена не указана'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminServiceForm;