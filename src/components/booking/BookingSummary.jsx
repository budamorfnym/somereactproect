import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { Clock, CalendarDays, Car, CreditCard, Award } from 'lucide-react';

const BookingSummary = ({ 
  selectedService,
  selectedOptions,
  selectedDate,
  selectedTime,
  selectedCar,
  totalPrice,
  totalDuration,
  pointsToUse = 0,
  loyaltyPoints = 0,
  onUsePoints,
  loading
}) => {
  // Calculate final price after applying loyalty points
  const finalPrice = totalPrice - pointsToUse;
  
  // Max points that can be used (50% of total price or available points, whichever is lower)
  const maxPointsToUse = Math.min(Math.floor(totalPrice * 0.5), loyaltyPoints);
  
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <h2 className="text-xl font-medium text-white mb-4">Детали заказа</h2>
      
      {/* Service details */}
      {selectedService && (
        <div className="mb-4 pb-4 border-b border-gray-700">
          <h3 className="font-medium text-white mb-2">{selectedService.name}</h3>
          <p className="text-gray-400 text-sm mb-2">{selectedService.description}</p>
          
          <div className="flex items-center text-gray-400 text-sm mb-1">
            <Clock size={14} className="mr-2" />
            <span>Длительность: {selectedService.duration} мин.</span>
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-400">Стоимость услуги:</span>
            <span className="text-white">{formatCurrency(selectedService.price)}</span>
          </div>
        </div>
      )}
      
      {/* Selected options */}
      {selectedOptions && selectedOptions.length > 0 && (
        <div className="mb-4 pb-4 border-b border-gray-700">
          <h3 className="font-medium text-white mb-2">Дополнительные опции</h3>
          
          {selectedOptions.map(option => (
            <div key={option.id} className="flex justify-between mb-1">
              <span className="text-gray-400">{option.name}</span>
              <span className="text-white">{formatCurrency(option.price)}</span>
            </div>
          ))}
        </div>
      )}
      
      {/* Date and time */}
      {selectedDate && selectedTime && (
        <div className="mb-4 pb-4 border-b border-gray-700">
          <h3 className="font-medium text-white mb-2">Дата и время</h3>
          
          <div className="flex items-center text-gray-400 mb-1">
            <CalendarDays size={16} className="mr-2" />
            <span>
              {new Date(selectedDate).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>
          
          <div className="flex items-center text-gray-400">
            <Clock size={16} className="mr-2" />
            <span>{selectedTime}</span>
          </div>
          
          {totalDuration > 0 && (
            <div className="mt-2 text-gray-400 text-sm">
              Общая продолжительность: {totalDuration} мин.
            </div>
          )}
        </div>
      )}
      
      {/* Car information */}
      {selectedCar && (
        <div className="mb-4 pb-4 border-b border-gray-700">
          <h3 className="font-medium text-white mb-2">Автомобиль</h3>
          
          <div className="flex items-center text-gray-400">
            <Car size={16} className="mr-2" />
            <div>
              <div>{selectedCar.model}</div>
              <div className="text-sm">#{selectedCar.plateNumber}</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Loyalty points */}
      {loyaltyPoints > 0 && totalPrice > 0 && (
        <div className="mb-4 pb-4 border-b border-gray-700">
          <h3 className="font-medium text-white mb-2">Бонусные баллы</h3>
          
          <div className="flex items-center text-yellow-500 mb-2">
            <Award size={16} className="mr-2" />
            <span>Доступно: {loyaltyPoints} баллов</span>
          </div>
          
          {maxPointsToUse > 0 && (
            <div>
              <div className="flex items-center justify-between">
                <label className="text-gray-400">Использовать баллы:</label>
                <input
                  type="number"
                  value={pointsToUse}
                  onChange={(e) => onUsePoints(Math.min(maxPointsToUse, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="ml-2 w-24 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-white text-right"
                  max={maxPointsToUse}
                  min={0}
                />
              </div>
              
              <div className="text-xs text-gray-400 mt-1 text-right">
                Максимум: {maxPointsToUse} баллов (50% от стоимости)
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Total */}
      <div className="space-y-2">
        <div className="flex justify-between text-gray-400">
          <span>Стоимость услуги:</span>
          <span>{selectedService ? formatCurrency(selectedService.price) : formatCurrency(0)}</span>
        </div>
        
        <div className="flex justify-between text-gray-400">
          <span>Дополнительные опции:</span>
          <span>{formatCurrency(totalPrice - (selectedService?.price || 0))}</span>
        </div>
        
        {pointsToUse > 0 && (
          <div className="flex justify-between text-yellow-500">
            <span>Оплата баллами:</span>
            <span>-{formatCurrency(pointsToUse)}</span>
          </div>
        )}
        
        <div className="border-t border-gray-700 pt-2 mt-2">
          <div className="flex justify-between items-center">
            <span className="font-medium text-white">Итого к оплате:</span>
            <span className="text-yellow-500 text-lg font-bold">{formatCurrency(finalPrice)}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-400 mt-1">
          <span>Способ оплаты:</span>
          <span className="flex items-center">
            <CreditCard size={14} className="mr-1" /> При оказании услуги
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;