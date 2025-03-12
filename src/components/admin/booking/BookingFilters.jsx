// src/components/admin/booking/BookingFilters.jsx
import React from 'react';
import { Search, Filter, Calendar } from 'lucide-react';

const BookingFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter,
  dateFilter,
  setDateFilter,
  onApplyFilters,
  onResetFilters
}) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg block w-full pl-10 p-2.5"
            placeholder="Поиск по имени, телефону..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Filter size={16} className="text-gray-400" />
            </div>
            <select
              className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg block w-full pl-10 p-2.5"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Все статусы</option>
              <option value="pending">Ожидают</option>
              <option value="confirmed">Подтверждены</option>
              <option value="in-progress">В процессе</option>
              <option value="completed">Завершены</option>
              <option value="cancelled">Отменены</option>
            </select>
          </div>
          
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Calendar size={16} className="text-gray-400" />
            </div>
            <input
              type="date"
              className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg block w-full pl-10 p-2.5"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-200 flex-grow"
            onClick={onApplyFilters}
          >
            Применить фильтры
          </button>
          
          <button
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors duration-200"
            onClick={onResetFilters}
          >
            Сбросить
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingFilters;