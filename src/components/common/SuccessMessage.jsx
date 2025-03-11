import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

const SuccessMessage = ({ message, onClose, duration = 3000 }) => {
  useEffect(() => {
    // Automatically close after specified duration
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed top-4 right-4 left-4 md:left-auto z-50">
      <div className="bg-green-600 text-white px-6 py-3 rounded-md shadow-lg flex items-center justify-between">
        <div className="flex items-center">
          <CheckCircle className="text-white" size={20} />
          <span className="ml-2">{message}</span>
        </div>
        <button onClick={onClose} className="text-white ml-4">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default SuccessMessage;