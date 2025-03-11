import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authService } from '../services/authService';
import { setToken, getToken, setUser, getUser, clearAuth } from '../utils/tokenStorage';
import { useNotification } from '../hooks/useNotification';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(getUser());
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());
  const [loading, setLoading] = useState(true);
  const { error: showError } = useNotification();

  // Listen for unauthorized events to handle token invalidation
  useEffect(() => {
    const handleUnauthorized = () => {
      setIsAuthenticated(false);
      setCurrentUser(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  // Validate token on initial load
  useEffect(() => {
    const validateAuth = async () => {
      try {
        setLoading(true);
        const token = getToken();
        
        if (!token) {
          setIsAuthenticated(false);
          setCurrentUser(null);
          return;
        }
        
        const response = await authService.validateToken();
        
        if (!response.valid) {
          clearAuth();
          setIsAuthenticated(false);
          setCurrentUser(null);
        }
      } catch (err) {
        // Error validating token, clear auth state
        console.error('Token validation error:', err);
        clearAuth();
        setIsAuthenticated(false);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    validateAuth();
  }, []);

  // Login handler
  const login = useCallback(async (credentials) => {
    try {
      const response = await authService.login(credentials);
      
      // Save authentication data
      setToken(response.token);
      setUser(response.user);
      
      // Update state
      setCurrentUser(response.user);
      setIsAuthenticated(true);
      
      return response.user;
    } catch (err) {
      throw err;
    }
  }, []);

  // Registration handler
  const register = useCallback(async (userData) => {
    try {
      const response = await authService.register(userData);
      
      // Save authentication data
      setToken(response.token);
      setUser(response.user);
      
      // Update state
      setCurrentUser(response.user);
      setIsAuthenticated(true);
      
      return response.user;
    } catch (err) {
      throw err;
    }
  }, []);

  // Logout handler
  const logout = useCallback(() => {
    // Clear auth data from storage
    clearAuth();
    
    // Update state
    setCurrentUser(null);
    setIsAuthenticated(false);
  }, []);

  // Profile update handler
  const updateProfile = useCallback(async (userData) => {
    try {
      const updatedUser = await authService.updateProfile(userData);
      
      // Update stored user data
      setUser(updatedUser);
      setCurrentUser(updatedUser);
      
      return updatedUser;
    } catch (err) {
      showError('Не удалось обновить профиль');
      throw err;
    }
  }, [showError]);

  // Password reset request handler
  const forgotPassword = useCallback(async (data) => {
    try {
      return await authService.forgotPassword(data);
    } catch (err) {
      showError('Не удалось отправить запрос на сброс пароля');
      throw err;
    }
  }, [showError]);

  // Password reset handler
  const resetPassword = useCallback(async (data) => {
    try {
      return await authService.resetPassword(data);
    } catch (err) {
      showError('Не удалось сбросить пароль');
      throw err;
    }
  }, [showError]);

  // Password change handler
  const changePassword = useCallback(async (passwordData) => {
    try {
      return await authService.changePassword(passwordData);
    } catch (err) {
      showError('Не удалось изменить пароль');
      throw err;
    }
  }, [showError]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
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
  }), [
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
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};