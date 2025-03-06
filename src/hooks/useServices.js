import { useContext } from 'react';
import { ServicesContext } from '../contexts/ServicesContext';

export const useServices = () => {
  return useContext(ServicesContext);
};