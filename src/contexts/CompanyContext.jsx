import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCompanyInfo } from '../services/companyService';

// Create context
export const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
  const [companyInfo, setCompanyInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load company information on mount
  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        setLoading(true);
        const info = await getCompanyInfo();
        setCompanyInfo(info);
        setError(null);
      } catch (err) {
        console.error('Error fetching company info:', err);
        setError('Failed to load company information');
        
        // Set fallback default values
        setCompanyInfo({
          name: 'A1Detailing',
          address: 'ул. Байтик Баатыра, 98 / ул. Максима Горького, 27/1, Бишкек',
          phone: '+996 550 000 000',
          email: 'info@a1detailing.kg',
          workHours: 'Пн-Сб: 9:00 - 19:00, Вс: 10:00 - 17:00',
          coordinates: {
            lat: 42.8746,
            lng: 74.5698,
          },
          socialMedia: {
            instagram: 'https://instagram.com/a1detailing',
            facebook: 'https://facebook.com/a1detailing',
            whatsapp: 'https://wa.me/996550000000'
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyInfo();
  }, []);

  // Manually refresh company info
  const refreshCompanyInfo = async () => {
    try {
      setLoading(true);
      const info = await getCompanyInfo();
      setCompanyInfo(info);
      setError(null);
      return true;
    } catch (err) {
      console.error('Error refreshing company info:', err);
      setError('Failed to refresh company information');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Value to be provided to consumers
  const value = {
    companyInfo,
    loading,
    error,
    refreshCompanyInfo
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
};

// Custom hook for using the company context
export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};

export default CompanyProvider;