import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
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
  const location = useLocation();

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
        password: formData.password,
        remember: formData.remember
      });
      
      success('Вы успешно вошли в систему');
      
      // Redirect user to the page they were trying to access or home
      const from = location?.state?.from || '/';
      navigate(from, { replace: true });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Ошибка при входе в систему';
      error(errorMessage);
      
      // If the error is related to inactive account, show appropriate message
      if (err.response?.data?.code === 'INACTIVE_ACCOUNT') {
        error('Ваш аккаунт не активирован. Пожалуйста, проверьте почту для активации.');
      }
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