// src/components/admin/booking/BookingTable.jsx
import React from 'react';
import { formatDate, formatTime } from '../../../utils/formatters';
import { Eye } from 'lucide-react';

const BookingTable = ({ bookings, getStatusInfo, onViewBooking }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-300">
        <thead className="bg-gray-700 text-white text-xs uppercase">
          <tr>
            <th className="px-6 py-3">Клиент</th>
            <th className="px-6 py-3">Услуга</th>
            <th className="px-6 py-3">Автомобиль</th>
            <th className="px-6 py-3">Дата и время</th>
            <th className="px-6 py-3">Сумма</th>
            <th className="px-6 py-3">Статус</th>
            <th className="px-6 py-3 text-right">Действия</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => {
            const statusInfo = getStatusInfo(booking.status);
            
            return (
              <tr key={booking.id} className="border-b border-gray-700 hover:bg-gray-700">
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{booking.user?.name || 'Н/Д'}</div>
                  <div className="text-gray-400 text-xs">{booking.user?.phone || 'Н/Д'}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{booking.service?.name || 'Н/Д'}</div>
                  <div className="text-gray-400 text-xs">
                    {booking.options?.length > 0 ? `+ ${booking.options.length} опций` : 'Без опций'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{booking.carModel || 'Н/Д'}</div>
                  <div className="text-gray-400 text-xs">{booking.carNumber || 'Н/Д'}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-white">
                    {booking.date ? formatDate(new Date(booking.date)) : 'Н/Д'}
                  </div>
                  <div className="text-gray-400 text-xs">{formatTime(booking.time) || 'Н/Д'}</div>
                </td>
                <td className="px-6 py-4 font-medium text-yellow-500">
                  {booking.totalPrice ? `${booking.totalPrice.toLocaleString()} ₽` : 'Н/Д'}
                </td>
                <td className="px-6 py-4">
                  <span className={`flex items-center ${statusInfo.color}`}>
                    {statusInfo.icon}
                    <span className="ml-1">{statusInfo.label}</span>
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    className="text-red-600 hover:text-red-500 transition-colors duration-200"
                    onClick={() => onViewBooking(booking.id)}
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;