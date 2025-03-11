// src/utils/formatters.js

/**
 * Форматирование даты в локализованную строку
 * 
 * @param {Date} date Объект даты
 * @param {Object} options Опции форматирования
 * @returns {string} Отформатированная дата
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  
  const defaultOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options
  };
  
  return new Date(date).toLocaleDateString('ru-RU', defaultOptions);
};

/**
 * Форматирование времени
 * 
 * @param {string} time Строка времени в формате HH:MM
 * @returns {string} Отформатированное время
 */
export const formatTime = (time) => {
  if (!time) return '';
  
  // Если время уже в нужном формате, возвращаем его
  if (typeof time === 'string' && /^\d{1,2}:\d{2}$/.test(time)) {
    return time;
  }
  
  // Если это объект Date, извлекаем время
  if (time instanceof Date) {
    return time.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  }
  
  // Если это строка с датой и временем, преобразуем в объект Date
  try {
    const date = new Date(time);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return time;
  }
};

/**
 * Форматирование денежной суммы
 * 
 * @param {number} amount Сумма
 * @param {string} currency Валюта (по умолчанию "сом")
 * @returns {string} Отформатированная сумма с символом валюты
 */
export const formatCurrency = (amount, currency = 'сом') => {
  if (amount === undefined || amount === null) return '';
  
  return `${Number(amount).toLocaleString('ru-RU')} ${currency}`;
};

/**
 * Форматирование номера телефона
 * 
 * @param {string} phone Номер телефона
 * @returns {string} Отформатированный номер телефона
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  // Удаляем все нецифровые символы
  const cleaned = ('' + phone).replace(/\D/g, '');
  
  // Форматируем номер телефона для Кыргызстана
  if (cleaned.length === 9 && cleaned.startsWith('0')) {
    // Если номер начинается с 0 и имеет 9 цифр (например, 0550123456)
    return `+996 ${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6, 9)}`;
  } else if (cleaned.length === 9) {
    // Если номер имеет 9 цифр без кода страны (например, 550123456)
    return `+996 ${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6, 9)}`;
  } else if (cleaned.length === 12 && cleaned.startsWith('996')) {
    // Если номер начинается с 996 и имеет 12 цифр (например, 996550123456)
    return `+${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6, 9)} ${cleaned.substring(9, 12)}`;
  }
  
  // Если формат не распознан, возвращаем исходный номер
  return phone;
};