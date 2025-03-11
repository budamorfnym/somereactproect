/**
 * Format date to localized string
 * 
 * @param {Date|string} date Date object or ISO string
 * @param {Object} options Format options
 * @returns {string} Formatted date
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  
  try {
    // Ensure we have a Date object
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if valid date
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    
    const defaultOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      ...options
    };
    
    return dateObj.toLocaleDateString('ru-RU', defaultOptions);
  } catch (err) {
    console.error('Error formatting date:', err);
    return typeof date === 'string' ? date : '';
  }
};

/**
 * Format time string
 * 
 * @param {string} time Time string in HH:MM format
 * @returns {string} Formatted time
 */
export const formatTime = (time) => {
  if (!time) return '';
  
  // If time is already in HH:MM format, return it
  if (typeof time === 'string' && /^\d{1,2}:\d{2}$/.test(time)) {
    return time;
  }
  
  try {
    // If it's a Date object, extract the time
    if (time instanceof Date) {
      return time.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    }
    
    // If it's a string with date and time, convert to Date and extract time
    const date = new Date(time);
    if (!isNaN(date.getTime())) {
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    }
    
    return time;
  } catch (err) {
    console.error('Error formatting time:', err);
    return time;
  }
};

/**
 * Format currency amount
 * 
 * @param {number} amount Amount to format
 * @param {string} currency Currency code (default: 'сом')
 * @returns {string} Formatted currency amount
 */
export const formatCurrency = (amount, currency = 'сом') => {
  if (amount === undefined || amount === null) return '';
  
  try {
    // Ensure amount is a number
    const numAmount = Number(amount);
    
    if (isNaN(numAmount)) {
      return `0 ${currency}`;
    }
    
    // Format with thousands separator
    return `${numAmount.toLocaleString('ru-RU')} ${currency}`;
  } catch (err) {
    console.error('Error formatting currency:', err);
    return `${amount} ${currency}`;
  }
};

/**
 * Format phone number
 * 
 * @param {string} phone Phone number
 * @returns {string} Formatted phone number
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  try {
    // Remove all non-digit characters
    const cleaned = String(phone).replace(/\D/g, '');
    
    // Format phone number based on length and pattern
    if (cleaned.length === 9 && cleaned.startsWith('0')) {
      // Format: 0550123456 -> +996 550 123 456
      return `+996 ${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6, 9)}`;
    } else if (cleaned.length === 9) {
      // Format: 550123456 -> +996 550 123 456
      return `+996 ${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6, 9)}`;
    } else if (cleaned.length === 12 && cleaned.startsWith('996')) {
      // Format: 996550123456 -> +996 550 123 456
      return `+${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6, 9)} ${cleaned.substring(9, 12)}`;
    } else if (cleaned.length === 10 && cleaned.startsWith('0')) {
      // Format: 0550123456 -> +996 550 12 34 56
      return `+996 ${cleaned.substring(1, 4)} ${cleaned.substring(4, 6)} ${cleaned.substring(6, 8)} ${cleaned.substring(8, 10)}`;
    }
    
    // If no specific format matches, return the original
    return phone;
  } catch (err) {
    console.error('Error formatting phone number:', err);
    return phone;
  }
};

/**
 * Format file size
 * 
 * @param {number} bytes File size in bytes
 * @param {number} decimals Number of decimal places
 * @returns {string} Formatted file size (e.g. "1.5 MB")
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Format a duration in minutes to hours and minutes
 * 
 * @param {number} minutes Duration in minutes
 * @returns {string} Formatted duration (e.g. "1 ч 30 мин")
 */
export const formatDuration = (minutes) => {
  if (!minutes && minutes !== 0) return '';
  
  const mins = parseInt(minutes, 10);
  
  if (isNaN(mins)) return '';
  
  const hours = Math.floor(mins / 60);
  const remainingMinutes = mins % 60;
  
  if (hours === 0) {
    return `${remainingMinutes} мин`;
  } else if (remainingMinutes === 0) {
    return `${hours} ч`;
  } else {
    return `${hours} ч ${remainingMinutes} мин`;
  }
};