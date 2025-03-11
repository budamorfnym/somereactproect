import { useContext } from 'react';
import { CompanyContext } from '../contexts/CompanyContext';

export const useCompany = () => {
  return useContext(CompanyContext);
};