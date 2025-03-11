// src/hooks/useBooking.js
import { useContext } from 'react';
import { BookingContext } from '../contexts/BookingContext';

export const useBooking = () => {
  return useContext(BookingContext);
};