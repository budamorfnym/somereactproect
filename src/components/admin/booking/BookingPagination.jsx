// src/components/admin/booking/BookingPagination.jsx
import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const BookingPagination = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  perPage, 
  onPageChange 
}) => {
  if (totalPages <= 1) return null;
  
  return (
    <div className="flex justify-between items-center p-4 border-t border-gray-700">
      <div className="text-sm text-gray-400">
        Показано {(currentPage - 1) * perPage + 1} - {Math.min(currentPage * perPage, totalItems)} из {totalItems}
      </div>
      
      <div className="flex space-x-2">
        <button
          className="flex items-center px-3 py-1 border border-gray-700 rounded-md text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={16} />
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`px-3 py-1 rounded-md ${
              page === currentPage
                ? 'bg-red-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
        
        <button
          className="flex items-center px-3 py-1 border border-gray-700 rounded-md text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default BookingPagination;