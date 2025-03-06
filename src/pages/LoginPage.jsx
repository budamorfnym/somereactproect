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