import React from 'react';

const LoadingSpinner = ({ fullscreen = false }) => {
  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }
  
  return (
    <div className="flex justify-center items-center py-10">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-600"></div>
    </div>
  );
};

export default LoadingSpinner;