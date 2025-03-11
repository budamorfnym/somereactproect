import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useNotification } from '../../hooks/useNotification';
import { motion, AnimatePresence } from 'framer-motion';

const notificationVariants = {
  initial: { opacity: 0, y: -50, scale: 0.8 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
};

const NotificationItem = ({ notification, onClose }) => {
  const { id, type, message, duration = 5000 } = notification;
  
  // Auto-close notification after duration
  useEffect(() => {
    if (duration !== 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);
  
  // Get icon and colors based on notification type
  const getNotificationStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle className="text-white" size={20} />,
          background: 'bg-green-600',
          borderColor: 'border-green-500'
        };
        case 'error':
          return {
            icon: <AlertCircle className="text-white" size={20} />,
            background: 'bg-red-600',
            borderColor: 'border-red-500'
          };
        case 'warning':
          return {
            icon: <AlertTriangle className="text-white" size={20} />,
            background: 'bg-yellow-600',
            borderColor: 'border-yellow-500'
          };
        case 'info':
        default:
          return {
            icon: <Info className="text-white" size={20} />,
            background: 'bg-blue-600',
            borderColor: 'border-blue-500'
          };
      }
    };
    
    const { icon, background, borderColor } = getNotificationStyles();
    
    return (
      <motion.div
        variants={notificationVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        layout
        className={`${background} text-white px-4 py-3 rounded-md shadow-lg flex items-center justify-between mb-2 border-l-4 ${borderColor}`}
      >
        <div className="flex items-center">
          {icon}
          <span className="ml-2">{message}</span>
        </div>
        <button 
          onClick={() => onClose(id)} 
          className="text-white ml-4 p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      </motion.div>
    );
  };
  
  const Notification = () => {
    const { notifications, removeNotification } = useNotification();
    
    return (
      <div className="fixed top-4 right-4 left-4 md:left-auto md:max-w-md z-50 flex flex-col pointer-events-none">
        <AnimatePresence>
          {notifications.map(notification => (
            <div key={notification.id} className="pointer-events-auto">
              <NotificationItem 
                notification={notification} 
                onClose={removeNotification} 
              />
            </div>
          ))}
        </AnimatePresence>
      </div>
    );
  };
  
  export default Notification;