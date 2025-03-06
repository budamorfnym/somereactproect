import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import LoadingSpinner from '../common/LoadingSpinner';
import { validateEmail, validatePhone, validatePassword } from '../../utils/validators';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Сбрасываем ошибку для измененного поля
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Валидация имени
    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно для заполнения';
    }
    
    // Валидация email
    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен для заполнения';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Пожалуйста, введите корректный email';
    }
    
    // Валидация телефона
    if (!formData.phone.trim()) {
      newErrors.phone = 'Телефон обязателен для заполнения';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Пожалуйста, введите корректный номер телефона';
    }
    
    // Валидация пароля
    if (!formData.password) {
      newErrors.password = 'Пароль обязателен для заполнения';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Пароль должен содержать минимум 8 символов, включая цифру и букву';
    }
    
    // Подтверждение пароля
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }
    
    // Согласие с условиями
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Вы должны согласиться с условиями';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      
      success('Регистрация успешна! Добро пожаловать!');
      navigate('/');
    } catch (err) {
      if (err.response?.data?.message) {
        // Показываем ошибку с сервера
        error(err.response.data.message);
        
        // Если ошибка связана с определенным полем, устанавливаем её
        if (err.response.data.field) {
          setErrors({
            ...errors,
            [err.response.data.field]: err.response.data.message
          });
        }
      } else {
        error('Ошибка при регистрации. Пожалуйста, попробуйте позже.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-6">Регистрация</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Имя <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${
              errors.name ? 'border-red-500' : 'border-gray-700'
            } rounded-md bg-gray-900 text-white`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
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
            className={`w-full px-3 py-2 border ${
              errors.email ? 'border-red-500' : 'border-gray-700'
            } rounded-md bg-gray-900 text-white`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
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
            placeholder="+996XXXXXXXXX"
            className={`w-full px-3 py-2 border ${
              errors.phone ? 'border-red-500' : 'border-gray-700'
            } rounded-md bg-gray-900 text-white`}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Пароль <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${
              errors.password ? 'border-red-500' : 'border-gray-700'
            } rounded-md bg-gray-900 text-white`}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Подтверждение пароля <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-700'
            } rounded-md bg-gray-900 text-white`}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
          )}
        </div>
        
        <div>
          <div className="flex items-start">
            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className={`h-4 w-4 mt-1 ${
                errors.agreeTerms ? 'border-red-500' : 'border-gray-700'
              } rounded bg-gray-900`}
            />
            <label htmlFor="agreeTerms" className="ml-2 text-sm text-gray-300">
              Я согласен с{' '}
              <a href="/terms" className="text-red-600 hover:text-red-500">
                условиями использования
              </a>{' '}
              и{' '}
              <a href="/privacy" className="text-red-600 hover:text-red-500">
                политикой конфиденциальности
              </a>
            </label>
          </div>
          {errors.agreeTerms && (
            <p className="text-red-500 text-xs mt-1">{errors.agreeTerms}</p>
          )}
        </div>
        
        <button
          type="submit"
          className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
          disabled={loading}
        >
          {loading ? <LoadingSpinner /> : 'Зарегистрироваться'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400">
          Уже есть аккаунт?{' '}
          <Link
            to="/login"
            className="text-red-600 hover:text-red-500"
          >
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;