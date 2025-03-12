// src/components/common/LoadingSpinner.jsx - оптимизированная версия
import React from 'react';

const LoadingSpinner = ({ fullscreen = false, size = 'md' }) => {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16'
  };
  
  const spinnerSize = sizes[size] || sizes.md;
  
  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
        <div className={`animate-spin rounded-full ${spinnerSize} border-t-2 border-b-2 border-red-600`}></div>
      </div>
    );
  }
  
  return (
    <div className="flex justify-center items-center py-10">
      <div className={`animate-spin rounded-full ${spinnerSize} border-t-2 border-b-2 border-red-600`}></div>
    </div>
  );
};

export default LoadingSpinner;