import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import LoadingSpinner from '../common/LoadingSpinner';
import { validatePassword } from '../../utils/validators';

const ResetPasswordForm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { token } = useParams();
  const { resetPassword } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!password || !confirmPassword) {
      error('Пожалуйста, заполните все поля');
      return;
    }
    
    if (password !== confirmPassword) {
      error('Пароли не совпадают');
      return;
    }
    
    if (!validatePassword(password)) {
      error('Пароль должен содержать минимум 8 символов, включая цифру и букву');
      return;
    }
    
    try {
      setLoading(true);
      await resetPassword({ token, password });
      success('Пароль успешно изменен');
      navigate('/login');
    } catch (err) {
      error(err.response?.data?.message || 'Ошибка при сбросе пароля');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-6">Создание нового пароля</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Новый пароль
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white"
            required
          />
          <p className="text-xs text-gray-400 mt-1">
            Минимум 8 символов, включая цифру и букву
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Подтверждение пароля
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
          disabled={loading}
        >
          {loading ? <LoadingSpinner /> : 'Сохранить новый пароль'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400">
          <Link
            to="/login"
            className="text-red-600 hover:text-red-500"
          >
            Вернуться на страницу входа
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordForm;