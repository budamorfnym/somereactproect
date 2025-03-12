import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authService } from '../services/authService';
import { setToken, getToken, setUser, getUser, clearAuth } from '../utils/tokenStorage';
import { useNotification } from '../hooks/useNotification';

// Create context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // State
  const [currentUser, setCurrentUser] = useState(getUser());
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);
  const [lastAuthCheck, setLastAuthCheck] = useState(Date.now());
  
  // Hooks
  const { error: showError } = useNotification();
  
  // Function to handle authentication errors
  const handleAuthError = useCallback((error) => {
    const errorMessage = error.response?.data?.message || error.message || 'Ошибка аутентификации';
    showError(errorMessage);
    return Promise.reject(error);
  }, [showError]);

  // Handle unauthorized event (token invalidation)
  useEffect(() => {
    const handleUnauthorized = () => {
      // Clear authentication state
      setIsAuthenticated(false);
      setCurrentUser(null);
      
      // Clear tokens
      clearAuth();
    };

    // Listen for custom unauthorized event
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  // Validate token on initial load and periodically
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
        
        const { valid, user } = await authService.validateToken();
        
        if (!valid) {
          clearAuth();
          setIsAuthenticated(false);
          setCurrentUser(null);
        } else if (user) {
          // Update user data if returned
          setUser(user);
          setCurrentUser(user);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Token validation error:', err);
        clearAuth();
        setIsAuthenticated(false);
        setCurrentUser(null);
      } finally {
        setLoading(false);
        setInitializing(false);
      }
    };

    // Run initial validation
    validateAuth();
    
    // Set up periodic validation (every 15 minutes)
    const intervalId = setInterval(() => {
      setLastAuthCheck(Date.now());
    }, 15 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Re-validate when lastAuthCheck changes
  useEffect(() => {
    // Skip initial validation
    if (initializing) return;
    
    const revalidateAuth = async () => {
      // Only validate if user is already authenticated
      if (isAuthenticated && getToken()) {
        try {
          const { valid, user } = await authService.validateToken();
          
          if (!valid) {
            clearAuth();
            setIsAuthenticated(false);
            setCurrentUser(null);
          } else if (user) {
            // Update user data if different
            if (JSON.stringify(currentUser) !== JSON.stringify(user)) {
              setUser(user);
              setCurrentUser(user);
            }
          }
        } catch (err) {
          console.warn('Periodic token validation failed:', err);
        }
      }
    };
    
    revalidateAuth();
  }, [lastAuthCheck, currentUser, isAuthenticated, initializing]);

  // Login handler
  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      const result = await authService.login(credentials);
      
      // Save authentication data
      setToken(result.token);
      setUser(result.user);
      
      // Update local state
      setCurrentUser(result.user);
      setIsAuthenticated(true);
      
      // Store refresh token if provided
      if (result.refreshToken) {
        localStorage.setItem('refresh_token', result.refreshToken);
      }
      
      return result.user;
    } catch (error) {
      return handleAuthError(error);
    } finally {
      setLoading(false);
    }
  }, [handleAuthError]);

  // Register handler
  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      const result = await authService.register(userData);
      
      // Save authentication data
      setToken(result.token);
      setUser(result.user);
      
      // Update local state
      setCurrentUser(result.user);
      setIsAuthenticated(true);
      
      // Store refresh token if provided
      if (result.refreshToken) {
        localStorage.setItem('refresh_token', result.refreshToken);
      }
      
      return result.user;
    } catch (error) {
      return handleAuthError(error);
    } finally {
      setLoading(false);
    }
  }, [handleAuthError]);

  // Logout handler
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      
      // Notify server about logout
      if (isAuthenticated) {
        await authService.logout();
      }
      
      // Clear local auth data
      clearAuth();
      localStorage.removeItem('refresh_token');
      
      // Update state
      setCurrentUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.warn('Logout error:', error);
      
      // Still clear local auth even if server logout fails
      clearAuth();
      localStorage.removeItem('refresh_token');
      setCurrentUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Update profile handler
  const updateProfile = useCallback(async (userData) => {
    try {
      setLoading(true);
      const updatedUser = await authService.updateProfile(userData);
      
      // Update stored user data
      setUser(updatedUser);
      setCurrentUser(updatedUser);
      
      return updatedUser;
    } catch (error) {
      return handleAuthError(error);
    } finally {
      setLoading(false);
    }
  }, [handleAuthError]);

  // Password change handler
  const changePassword = useCallback(async (passwordData) => {
    try {
      setLoading(true);
      return await authService.changePassword(passwordData);
    } catch (error) {
      return handleAuthError(error);
    } finally {
      setLoading(false);
    }
  }, [handleAuthError]);

  // Password reset request handler
  const forgotPassword = useCallback(async (data) => {
    try {
      setLoading(true);
      return await authService.forgotPassword(data);
    } catch (error) {
      return handleAuthError(error);
    } finally {
      setLoading(false);
    }
  }, [handleAuthError]);

  // Password reset handler
  const resetPassword = useCallback(async (data) => {
    try {
      setLoading(true);
      return await authService.resetPassword(data);
    } catch (error) {
      return handleAuthError(error);
    } finally {
      setLoading(false);
    }
  }, [handleAuthError]);
  
  // Upload profile image handler
  const uploadProfileImage = useCallback(async (formData, onProgress) => {
    try {
      setLoading(true);
      const result = await authService.uploadProfileImage(formData, onProgress);
      
      // Update user with new image URL
      if (result.imageUrl) {
        const updatedUser = { ...currentUser, profileImage: result.imageUrl };
        setUser(updatedUser);
        setCurrentUser(updatedUser);
      }
      
      return result;
    } catch (error) {
      return handleAuthError(error);
    } finally {
      setLoading(false);
    }
  }, [currentUser, handleAuthError]);
  
  // Email verification handler
  const verifyEmail = useCallback(async (token) => {
    try {
      setLoading(true);
      const result = await authService.verifyEmail(token);
      
      // Update user if provided in result
      if (result.user) {
        setUser(result.user);
        setCurrentUser(result.user);
        setIsAuthenticated(true);
      }
      
      return result;
    } catch (error) {
      return handleAuthError(error);
    } finally {
      setLoading(false);
    }
  }, [handleAuthError]);
  
  // Resend verification email handler
  const resendVerificationEmail = useCallback(async (data) => {
    try {
      setLoading(true);
      return await authService.resendVerificationEmail(data);
    } catch (error) {
      return handleAuthError(error);
    } finally {
      setLoading(false);
    }
  }, [handleAuthError]);

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
    resetPassword,
    uploadProfileImage,
    verifyEmail,
    resendVerificationEmail,
    isAdmin: currentUser?.role === 'admin',
    isStaff: currentUser?.role === 'staff' || currentUser?.role === 'admin'
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
    resetPassword,
    uploadProfileImage,
    verifyEmail,
    resendVerificationEmail
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};