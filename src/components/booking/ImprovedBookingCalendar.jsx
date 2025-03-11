import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, Sun, Sunset, Moon } from 'lucide-react';
import { useTimeSlots } from '../../hooks/useTimeSlots';
import { formatDate } from '../../utils/formatters';
import LoadingSpinner from '../common/LoadingSpinner';

const ImprovedBookingCalendar = ({ 
  onSelectDate, 
  onSelectTime, 
  selectedDate, 
  selectedTime,
  serviceId,
  duration 
}) => {
  const { 
    availableSlots, 
    loading, 
    getAvailableSlots,
    groupTimeSlots
  } = useTimeSlots();
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [groupedSlots, setGroupedSlots] = useState({});
  
  // Generate calendar days for the current month
  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    // Get the day of the week of the first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayWeekday = firstDayOfMonth.getDay();
    
    // Calculate days from previous month
    const daysFromPrevMonth = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1;
    
    const firstDateToShow = new Date(year, month, 1 - daysFromPrevMonth);
    
    // Generate 42 days (6 weeks)
    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(firstDateToShow);
      date.setDate(firstDateToShow.getDate() + i);
      
      // Check if date is in current month
      const isCurrentMonth = date.getMonth() === month;
      
      // Check if date is today
      const isToday = new Date().toDateString() === date.toDateString();
      
      // Check if date is in the past
      const isPast = date < new Date().setHours(0, 0, 0, 0);
      
      // Check if date is selected
      const dateString = date.toISOString().split('T')[0];
      const isSelected = selectedDate === dateString;
      
      days.push({
        date,
        isCurrentMonth,
        isToday,
        isPast,
        isSelected,
        dateString
      });
    }
    
    setCalendarDays(days);
  }, [currentMonth, selectedDate]);
  
  // Load available time slots when a date is selected
  useEffect(() => {
    if (selectedDate) {
      getAvailableSlots(selectedDate, serviceId, duration);
    }
  }, [selectedDate, serviceId, duration, getAvailableSlots]);
  
  // Group time slots when they change
  useEffect(() => {
    setGroupedSlots(groupTimeSlots(availableSlots));
  }, [availableSlots, groupTimeSlots]);
  
  // Go to previous month
  const handlePrevMonth = () => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(prevMonth.getMonth() - 1);
      return newMonth;
    });
  };
  
  // Go to next month
  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(prevMonth.getMonth() + 1);
      return newMonth;
    });
  };
  
  // Handle date selection
  const handleDateClick = (day) => {
    if (day.isPast || !day.isCurrentMonth) {
      return;
    }
    
    onSelectDate(day.dateString);
  };
  
  // Handle time selection
  const handleTimeClick = (time) => {
    onSelectTime(time);
  };
  
  // Get day names for the calendar header
  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  
  // Render time slots group
  const renderTimeSlotGroup = (title, slots, icon) => {
    if (!slots || slots.length === 0) return null;
    
    return (
      <div className="mb-4">
        <h4 className="flex items-center text-gray-400 mb-2 text-sm font-medium">
          {icon}
          <span className="ml-2">{title}</span>
        </h4>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {slots.map((time, index) => (
            <div
              key={index}
              className={`border rounded text-center p-2 cursor-pointer
                ${selectedTime === time ? 
                    'border-red-600 bg-red-600 bg-opacity-20 text-white' : 
                    'border-gray-700 text-gray-300 hover:bg-gray-700'
                  }`}
                onClick={() => handleTimeClick(time)}
              >
                <div className="flex items-center justify-center">
                  <Clock size={14} className="mr-1" />
                  <span>{time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    };
    
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <button
              className="text-gray-300 hover:text-white p-1"
              onClick={handlePrevMonth}
            >
              <ChevronLeft size={20} />
            </button>
            
            <h3 className="text-white font-medium">
              {currentMonth.toLocaleString('ru-RU', { month: 'long', year: 'numeric' })}
            </h3>
            
            <button
              className="text-gray-300 hover:text-white p-1"
              onClick={handleNextMonth}
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-1">
            {dayNames.map(day => (
              <div key={day} className="text-center text-gray-400 text-xs py-1">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`
                  relative text-center py-1 rounded-md ${!day.isPast && day.isCurrentMonth ? 'cursor-pointer' : 'cursor-default'}
                  ${day.isCurrentMonth ? day.isPast ? 'text-gray-600' : 'hover:bg-gray-700' : 'opacity-40 text-gray-600'}
                  ${day.isToday ? 'border border-gray-600' : ''}
                  ${day.isSelected ? 'bg-red-600 text-white' : 'text-gray-300'}
                `}
                onClick={() => handleDateClick(day)}
              >
                <span>
                  {day.date.getDate()}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {selectedDate && (
          <div>
            <h3 className="text-white font-medium mb-3">Доступное время на {formatDate(new Date(selectedDate))}</h3>
            
            {loading ? (
              <LoadingSpinner />
            ) : (
              Object.keys(groupedSlots).length > 0 ? (
                <div>
                  {renderTimeSlotGroup('Утро', groupedSlots.morning, <Sun size={16} className="text-yellow-500" />)}
                  {renderTimeSlotGroup('День', groupedSlots.afternoon, <Sun size={16} className="text-orange-400" />)}
                  {renderTimeSlotGroup('Вечер', groupedSlots.evening, <Sunset size={16} className="text-red-400" />)}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-400">
                  На выбранную дату нет свободных слотов
                </div>
              )
            )}
          </div>
        )}
      </div>
    );
  };
  
  export default ImprovedBookingCalendar;