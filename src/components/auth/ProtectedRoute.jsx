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