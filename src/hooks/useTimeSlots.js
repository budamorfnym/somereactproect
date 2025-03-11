import { useState, useCallback } from 'react';
import { timeSlotsService } from '../services/timeSlotsService';
import { useNotification } from './useNotification';

export const useTimeSlots = () => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const { error } = useNotification();

  // Get available time slots for a specific date
  const getAvailableSlots = useCallback(async (date, serviceId = null, duration = null) => {
    try {
      setLoading(true);
      // We can pass serviceId and duration to get more accurate slots based on service duration
      const slots = await timeSlotsService.getAvailableTimeSlots(date, serviceId, duration);
      setAvailableSlots(slots);
      return slots;
    } catch (err) {
      error('Не удалось загрузить доступные слоты времени');
      console.error('Error loading time slots:', err);
      setAvailableSlots([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [error]);

  // Check if a specific time slot is available
  const checkSlotAvailability = useCallback(async (date, time, serviceId = null, duration = null) => {
    try {
      setLoading(true);
      const isAvailable = await timeSlotsService.checkSlotAvailability(date, time, serviceId, duration);
      return isAvailable;
    } catch (err) {
      error('Не удалось проверить доступность времени');
      console.error('Error checking slot availability:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [error]);

  // Reserve a time slot temporarily during booking process
  const reserveSlot = useCallback(async (date, time, duration) => {
    try {
      setLoading(true);
      const result = await timeSlotsService.reserveTimeSlot(date, time, duration);
      return result;
    } catch (err) {
      error('Не удалось зарезервировать выбранное время');
      console.error('Error reserving time slot:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [error]);

  // Group time slots into morning, afternoon, evening
  const groupTimeSlots = useCallback((slots) => {
    if (!slots || !slots.length) return {};
    
    return slots.reduce((groups, slot) => {
      const hour = parseInt(slot.split(':')[0], 10);
      
      if (hour < 12) {
        groups.morning = [...(groups.morning || []), slot];
      } else if (hour < 17) {
        groups.afternoon = [...(groups.afternoon || []), slot];
      } else {
        groups.evening = [...(groups.evening || []), slot];
      }
      
      return groups;
    }, {});
  }, []);

  return {
    availableSlots,
    loading,
    getAvailableSlots,
    checkSlotAvailability,
    reserveSlot,
    groupTimeSlots
  };
};