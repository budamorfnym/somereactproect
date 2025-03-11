import React, { createContext, useState, useCallback, useMemo } from 'react';

export const NotificationContext = createContext();

/**
 * Maximum number of notifications to show at once
 */
const MAX_NOTIFICATIONS = 5;

/**
 * Default notification duration in milliseconds
 */
const DEFAULT_DURATION = 5000;

/**
 * Provider component for notifications system
 */
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  /**
   * Add a new notification
   * 
   * @param {Object} notification Notification details
   * @param {string} notification.type Notification type ('success', 'error', 'info', 'warning')
   * @param {string} notification.message Notification message
   * @param {number} notification.duration Duration in ms (0 for no auto-dismiss)
   * @returns {string} Notification ID
   */
  const addNotification = useCallback((notification) => {
    // Generate unique ID
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    
    // Create notification object
    const newNotification = {
      id,
      type: notification.type || 'info',
      message: notification.message || '',
      duration: notification.duration !== undefined ? notification.duration : DEFAULT_DURATION,
      timestamp: new Date()
    };
    
    // Add to state, limiting maximum number
    setNotifications(current => {
      const updatedNotifications = [newNotification, ...current].slice(0, MAX_NOTIFICATIONS);
      return updatedNotifications;
    });
    
    // Set auto-dismiss timer if duration is not 0
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
    
    return id;
  }, []);

  /**
   * Remove a notification by ID
   * 
   * @param {string} id Notification ID to remove
   */
  const removeNotification = useCallback((id) => {
    setNotifications(current => current.filter(n => n.id !== id));
  }, []);

  /**
   * Clear all notifications
   */
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  /**
   * Create a success notification
   * 
   * @param {string} message Notification message
   * @param {number} duration Duration in ms
   * @returns {string} Notification ID
   */
  const success = useCallback((message, duration = DEFAULT_DURATION) => {
    return addNotification({
      type: 'success',
      message,
      duration
    });
  }, [addNotification]);

  /**
   * Create an error notification
   * 
   * @param {string} message Notification message
   * @param {number} duration Duration in ms
   * @returns {string} Notification ID
   */
  const error = useCallback((message, duration = DEFAULT_DURATION) => {
    return addNotification({
      type: 'error',
      message,
      duration
    });
  }, [addNotification]);

  /**
   * Create an info notification
   * 
   * @param {string} message Notification message
   * @param {number} duration Duration in ms
   * @returns {string} Notification ID
   */
  const info = useCallback((message, duration = DEFAULT_DURATION) => {
    return addNotification({
      type: 'info',
      message,
      duration
    });
  }, [addNotification]);

  /**
   * Create a warning notification
   * 
   * @param {string} message Notification message
   * @param {number} duration Duration in ms
   * @returns {string} Notification ID
   */
  const warning = useCallback((message, duration = DEFAULT_DURATION) => {
    return addNotification({
      type: 'warning',
      message,
      duration
    });
  }, [addNotification]);

  /**
   * Context value - memoized to prevent unnecessary re-renders
   */
  const contextValue = useMemo(() => ({
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    success,
    error,
    info,
    warning
  }), [
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    success,
    error,
    info,
    warning
  ]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};