import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCompanyInfo, getQueueStatus, getCompanyReviews } from '../services/companyService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [companyInfo, setCompanyInfo] = useState(null);
  const [queueData, setQueueData] = useState({ currentWashing: [], waiting: [] });
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Загрузка данных о компании при инициализации
  useEffect(() => {
    const loadAppData = async () => {
      try {
        setLoading(true);
        // Загрузка данных о компании
        const info = await getCompanyInfo();
        setCompanyInfo(info);
        
        // Загрузка данных об очереди
        const queue = await getQueueStatus();
        setQueueData(queue);
        
        // Загрузка отзывов
        const reviewsData = await getCompanyReviews();
        setReviews(reviewsData);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAppData();
  }, []);

  // Функция смены активной вкладки
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const value = {
    activeTab,
    setActiveTab,
    companyInfo,
    queueData,
    reviews,
    loading,
    handleTabChange
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};