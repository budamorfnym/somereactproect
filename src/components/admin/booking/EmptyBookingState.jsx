// src/components/admin/booking/EmptyBookingState.jsx
import React from 'react';

const EmptyBookingState = ({ hasFilters }) => {
  return (
    <div className="p-6 text-center text-gray-400">
      <p className="mb-2">Записи не найдены</p>
      <p className="text-sm">
        {hasFilters ? (
          'Попробуйте изменить параметры поиска или фильтрации'
        ) : (
          'Пока нет записей на услуги'
        )}
      </p>
    </div>
  );
};

export default EmptyBookingState;