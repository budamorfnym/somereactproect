import React from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useNotification } from '../hooks/useNotification';

const NotificationItem = ({ notification, onClose }) => {
  const { id, type, message } = notification;
  
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'error':
        return <AlertCircle className="text-red-500" size={20} />;
      case 'info':
      default:
        return <Info className="text-blue-500" size={20} />;
    }
  };
  
  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600';
      case 'error':
        return 'bg-red-600';
      case 'info':
      default:
        return 'bg-blue-600';
    }
  };
  
  return (
    <div className={`${getBackgroundColor()} text-white px-6 py-3 rounded-md shadow-lg flex items-center justify-between mb-2`}>
      <div className="flex items-center">
        {getIcon()}
        <span className="ml-2">{message}</span>
      </div>
      <button onClick={() => onClose(id)} className="text-white ml-4">
        <X size={16} />
      </button>
    </div>
  );
};

const Notification = () => {
  const { notifications, removeNotification } = useNotification();
  
  if (notifications.length === 0) {
    return null;
  }
  
  return (
    <div className="fixed top-4 right-4 left-4 md:left-auto z-50 flex flex-col">
      {notifications.map(notification => (
        <NotificationItem 
          key={notification.id} 
          notification={notification} 
          onClose={removeNotification} 
        />
      ))}
    </div>
  );
};

export default Notification;