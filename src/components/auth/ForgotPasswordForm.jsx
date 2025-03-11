import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import LoadingSpinner from '../common/LoadingSpinner';
import { validateEmail } from '../../utils/validators';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const { forgotPassword } = useAuth();
  const { success, error } = useNotification();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!email) {
      error('Пожалуйста, введите email');
      return;
    }
    
    if (!validateEmail(email)) {
      error('Пожалуйста, введите корректный email');
      return;
    }
    
    try {
      setLoading(true);
      await forgotPassword({ email });
      setSubmitted(true);
      success('Инструкции по сбросу пароля отправлены на ваш email');
    } catch (err) {
      error(err.response?.data?.message || 'Ошибка при отправке запроса');
    } finally {
      setLoading(false);
    }
  };
  
  if (submitted) {
    return (
      <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4">Проверьте вашу почту</h2>
        <p className="text-gray-300 mb-6">
          Мы отправили инструкции по сбросу пароля на адрес {email}. 
          Пожалуйста, проверьте вашу почту и следуйте инструкциям.
        </p>
        <p className="text-gray-400 text-sm">
          Не получили письмо? Проверьте папку "Спам" или{' '}
          <button 
            className="text-red-600 hover:text-red-500"
            onClick={(e) => { 
              e.preventDefault();
              setSubmitted(false);
            }}
          >
            попробуйте снова
          </button>
        </p>
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-6">Восстановление пароля</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white"
            placeholder="Введите ваш email"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
          disabled={loading}
        >
          {loading ? <LoadingSpinner /> : 'Отправить инструкции'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400">
          Вспомнили пароль?{' '}
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

export default ForgotPasswordForm;