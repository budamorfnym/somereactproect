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