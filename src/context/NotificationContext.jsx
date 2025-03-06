import React, { createContext, useState } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Добавление уведомления
  const addNotification = (notification) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = {
      id,
      ...notification,
      time: new Date()
    };
    
    setNotifications(current => [newNotification, ...current]);
    
    // Автоматическое удаление уведомления через timeout
    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 3000);
    }
    
    return id;
  };

  // Удаление уведомления
  const removeNotification = (id) => {
    setNotifications(current => current.filter(n => n.id !== id));
  };

  // Очистка всех уведомлений
  const clearNotifications = () => {
    setNotifications([]);
  };

  // Добавление успешного уведомления
  const success = (message, duration = 3000) => {
    return addNotification({
      type: 'success',
      message,
      duration
    });
  };

  // Добавление уведомления об ошибке
  const error = (message, duration = 5000) => {
    return addNotification({
      type: 'error',
      message,
      duration
    });
  };

  // Добавление информационного уведомления
  const info = (message, duration = 3000) => {
    return addNotification({
      type: 'info',
      message,
      duration
    });
  };

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    success,
    error,
    info
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};