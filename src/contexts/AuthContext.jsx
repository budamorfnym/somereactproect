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
      const refreshTokenValue = localStorage.getItem('refresh_token');
      
      if (token) {
        try {
          const response = await authService.validateToken();
          
          if (!response.valid) {
            // Token is invalid, try to refresh
            if (refreshTokenValue) {
              try {
                const refreshResponse = await authService.refreshToken();
                setToken(refreshResponse.token);
                if (refreshResponse.refreshToken) {
                  localStorage.setItem('refresh_token', refreshResponse.refreshToken);
                }
                // Token refreshed successfully
                return;
              } catch (refreshErr) {
                // If refresh fails, clean up and logout
                clearAuth();
                setIsAuthenticated(false);
                setCurrentUser(null);
              }
            } else {
              // No refresh token, clean up
              clearAuth();
              setIsAuthenticated(false);
              setCurrentUser(null);
            }
          }
        } catch (err) {
          // Error validating token, clean up
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
      
      // Store refresh token if available
      if (response.refreshToken) {
        localStorage.setItem('refresh_token', response.refreshToken);
      }
      
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
      
      // Store refresh token if available
      if (response.refreshToken) {
        localStorage.setItem('refresh_token', response.refreshToken);
      }
      
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
    localStorage.removeItem('refresh_token');
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

  // Запрос на сброс пароля
  const forgotPassword = async (data) => {
    try {
      return await authService.forgotPassword(data);
    } catch (err) {
      error('Не удалось отправить запрос на сброс пароля');
      throw err;
    }
  };

  // Сброс пароля
  const resetPassword = async (data) => {
    try {
      return await authService.resetPassword(data);
    } catch (err) {
      error('Не удалось сбросить пароль');
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
    changePassword,
    forgotPassword,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};