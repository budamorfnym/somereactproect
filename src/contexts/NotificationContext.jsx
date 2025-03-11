import React, { createContext, useState, useCallback } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Add notification
  const addNotification = useCallback((notification) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = {
      id,
      ...notification,
      time: new Date()
    };
    
    setNotifications(current => [newNotification, ...current]);
    
    // Auto-remove notification if duration is set
    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 5000);
    }
    
    return id;
  }, []);

  // Remove notification
  const removeNotification = useCallback((id) => {
    setNotifications(current => current.filter(n => n.id !== id));
  }, []);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Success notification
  const success = useCallback((message, duration = 5000) => {
    return addNotification({
      type: 'success',
      message,
      duration
    });
  }, [addNotification]);

  // Error notification
  const error = useCallback((message, duration = 5000) => {
    return addNotification({
      type: 'error',
      message,
      duration
    });
  }, [addNotification]);

  // Info notification
  const info = useCallback((message, duration = 5000) => {
    return addNotification({
      type: 'info',
      message,
      duration
    });
  }, [addNotification]);

  // Warning notification
  const warning = useCallback((message, duration = 5000) => {
    return addNotification({
      type: 'warning',
      message,
      duration
    });
  }, [addNotification]);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    success,
    error,
    info,
    warning
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};