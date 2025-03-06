import { useContext, useState, useCallback } from 'react';
import { BookingContext } from '../contexts/BookingContext';

export const useBooking = () => {
  return useContext(BookingContext);
};