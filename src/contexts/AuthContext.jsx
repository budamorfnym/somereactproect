// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { setToken, getToken, setUser, getUser, clearAuth } from '../utils/tokenStorage';
import { useNotification } from '../hooks/useNotification';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(getUser());
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());
  const [loading, setLoading] = useState(true);
  const { error } = useNotification();

  // Проверка токена при загрузке
  useEffect(() => {
    const validateAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          const response = await authService.validateToken();
          if (!response.valid) {
            clearAuth();
            setIsAuthenticated(false);
            setCurrentUser(null);
          }
        } catch (err) {
          clearAuth();
          setIsAuthenticated(false);
          setCurrentUser(null);
        }
      }
      setLoading(false);
    };

    validateAuth();
  }, []);

  // Функция логина
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      setToken(response.token);
      setUser(response.user);
      setCurrentUser(response.user);
      setIsAuthenticated(true);
      return response.user;
    } catch (err) {
      throw err;
    }
  };

  // Функция регистрации
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      setToken(response.token);
      setUser(response.user);
      setCurrentUser(response.user);
      setIsAuthenticated(true);
      return response.user;
    } catch (err) {
      throw err;
    }
  };

  // Функция выхода
  const logout = () => {
    clearAuth();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Обновление профиля пользователя
  const updateProfile = async (userData) => {
    try {
      const updatedUser = await authService.updateProfile(userData);
      setUser(updatedUser);
      setCurrentUser(updatedUser);
      return updatedUser;
    } catch (err) {
      error('Не удалось обновить профиль');
      throw err;
    }
  };

  // Смена пароля
  const changePassword = async (passwordData) => {
    try {
      return await authService.changePassword(passwordData);
    } catch (err) {
      error('Не удалось изменить пароль');
      throw err;
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};