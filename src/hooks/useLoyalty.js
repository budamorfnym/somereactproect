import { useState, useEffect } from 'react';
import { loyaltyService } from '../services/loyaltyService';
import { useNotification } from './useNotification';

export const useLoyalty = () => {
  const [points, setPoints] = useState(0);
  const [status, setStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const [privileges, setPrivileges] = useState([]);
  const [loading, setLoading] = useState(false);
  const { error: showError } = useNotification();

  // Загрузка данных о лояльности
  const loadLoyaltyData = async () => {
    try {
      setLoading(true);
      const [pointsData, statusData, historyData, privilegesData] = await Promise.all([
        loyaltyService.getLoyaltyPoints(),
        loyaltyService.getLoyaltyStatus(),
        loyaltyService.getPointsHistory(),
        loyaltyService.getLoyaltyPrivileges()
      ]);
      
      setPoints(pointsData.points);
      setStatus(statusData);
      setHistory(historyData);
      setPrivileges(privilegesData);
    } catch (err) {
      showError('Не удалось загрузить данные программы лояльности');
    } finally {
      setLoading(false);
    }
  };

  // Загрузка данных при первом рендере
  useEffect(() => {
    loadLoyaltyData();
  }, []);

  // Использование баллов лояльности
  const usePoints = async (bookingId, pointsAmount) => {
    try {
      setLoading(true);
      const result = await loyaltyService.usePoints(bookingId, pointsAmount);
      setPoints(result.remainingPoints);
      return result;
    } catch (err) {
      showError('Не удалось использовать баллы лояльности');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    points,
    status,
    history,
    privileges,
    loading,
    loadLoyaltyData,
    usePoints
  };
};