import { useState, useCallback, useEffect, useRef } from 'react';
import { useNotification } from './useNotification';

/**
 * Хук для работы с API-запросами с поддержкой кэширования, отмены, повторов и других оптимизаций
 * @param {Function} apiFunction API-функция, которая возвращает Promise
 * @param {any[]} deps Зависимости для useCallback
 * @param {Object} options Опции запроса
 * @returns {Object} Состояние и методы для работы с API
 */
const useApi = (apiFunction, deps = [], options = {}) => {
  const {
    initialData = null,
    loadOnMount = false,
    cacheKey = null,
    cacheTTL = 5 * 60 * 1000, // 5 минут
    retryCount = 0,
    retryDelay = 1000,
    showErrors = true,
    errorMessage = 'Произошла ошибка при выполнении запроса'
  } = options;
  
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError