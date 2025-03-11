// src/hooks/useCars.js
import { useContext } from 'react';
import { CarsContext } from '../contexts/CarsContext';

export const useCars = () => {
  return useContext(CarsContext);
};