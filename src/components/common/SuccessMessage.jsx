import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';
import { motion } from 'framer-motion';

const SuccessMessage = ({ message, onClose, duration = 5000 }) => {
  // Auto-close after duration
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed top-4 right-4 left-4 md:left-auto md:max-w-md z-50">
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-green-600 text-white px-4 py-3 rounded-md shadow-lg flex items-center justify-between border-l-4 border-green-500"
      >
        <div className="flex items-center">
          <CheckCircle className="text-white" size={20} />
          <span className="ml-2">{message}</span>
        </div>
        <button 
          onClick={onClose} 
          className="text-white ml-4 p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          aria-label="Close message"
        >
          <X size={16} />
        </button>
      </motion.div>
    </div>
  );
};

export default SuccessMessage;