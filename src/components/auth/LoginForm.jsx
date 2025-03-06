// components/auth/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import LoadingSpinner from '../common/LoadingSpinner';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      error('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    try {
      setLoading(true);
      await login({
        email: formData.email,
        password: formData.password
      });
      success('Вы успешно вошли в систему');
      navigate('/');
    } catch (err) {
      error(err.response?.data?.message || 'Ошибка при входе в систему');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-6">Вход в аккаунт</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Email или телефон
          </label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Пароль
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember-me"
              name="remember"
              checked={formData.remember}
              onChange={handleChange}
              className="h-4 w-4 text-red-600 border-gray-700 rounded bg-gray-900"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 text-sm text-gray-300"
            >
              Запомнить меня
            </label>
          </div>
          <Link to="/forgot-password" className="text-sm text-red-600 hover:text-red-500">
            Забыли пароль?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
          disabled={loading}
        >
          {loading ? <LoadingSpinner /> : 'Войти'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400">
          Нет аккаунта?{' '}
          <Link
            to="/register"
            className="text-red-600 hover:text-red-500"
          >
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;

// components/auth/RegisterForm.jsx
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

// components/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, currentUser, loading } = useAuth();
  const location = useLocation();
  
  // Показываем спиннер загрузки, пока проверяем аутентификацию
  if (loading) {
    return <LoadingSpinner fullscreen />;
  }
  
  // Если пользователь не аутентифицирован, перенаправляем на страницу входа
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Если требуется определенная роль и у пользователя её нет
  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  // Если пользователь аутентифицирован и имеет необходимую роль, показываем содержимое
  return children;
};

export default ProtectedRoute;

// pages/LoginPage.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Если пользователь уже аутентифицирован, перенаправляем на предыдущую страницу или домашнюю
  React.useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white">Вход в систему</h1>
        <p className="text-gray-400 mt-2">
          Войдите в свой аккаунт для доступа к личному кабинету и записи на услуги
        </p>
      </div>
      
      <LoginForm />
    </div>
  );
};

export default LoginPage;

// pages/RegisterPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../hooks/useAuth';

const RegisterPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Если пользователь уже аутентифицирован, перенаправляем на домашнюю страницу
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white">Регистрация</h1>
        <p className="text-gray-400 mt-2">
          Создайте аккаунт для доступа к полному функционалу сервиса
        </p>
      </div>
      
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;

// utils/validators.js
// Валидация email
export const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

// Валидация телефона
export const validatePhone = (phone) => {
  // Поддерживаем форматы: +996700123456, 996700123456, 0700123456
  const re = /^(\+996|996|0)[0-9]{9}$/;
  return re.test(String(phone).replace(/\s/g, ''));
};

// Валидация пароля
export const validatePassword = (password) => {
  // Минимум 8 символов, хотя бы одна буква и одна цифра
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return re.test(String(password));
};

// Валидация номера автомобиля КР
export const validateCarPlateNumber = (plateNumber) => {
  // Поддерживаем форматы: B1234ABC, 01KG123ABC
  const re = /^([A-Z][0-9]{4}[A-Z]{3}|[0-9]{2}KG[0-9]{3}[A-Z]{3})$/;
  return re.test(String(plateNumber).toUpperCase());
};

// Валидация имени
export const validateName = (name) => {
  // Имя должно содержать только буквы и пробелы, минимум 2 символа
  const re = /^[A-Za-zА-Яа-яЁёҮүӨөҢңҮүҖ\s]{2,}$/;
  return re.test(String(name));
};

// Валидация года автомобиля
export const validateCarYear = (year) => {
  const currentYear = new Date().getFullYear();
  const yearNumber = parseInt(year, 10);
  return !isNaN(yearNumber) && yearNumber >= 1950 && yearNumber <= currentYear + 1;
};

// Валидация даты
export const validateDate = (date) => {
  // Проверяем формат даты: YYYY-MM-DD
  const re = /^\d{4}-\d{2}-\d{2}$/;
  if (!re.test(date)) return false;
  
  // Проверяем корректность даты
  const d = new Date(date);
  if (isNaN(d.getTime())) return false;
  
  // Проверяем, что дата не в прошлом
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d >= today;
};

// Валидация времени
export const validateTime = (time) => {
  // Проверяем формат времени: HH:MM
  const re = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return re.test(time);
};

// Валидация комментария
export const validateComment = (comment, maxLength = 500) => {
  return comment.length <= maxLength;
};