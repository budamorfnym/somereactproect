/**
 * Validate email format
 * @param {string} email Email to validate
 * @returns {boolean} Whether the email is valid
 */
export const validateEmail = (email) => {
  if (!email) return false;
  
  // RFC 5322 compliant email regex
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Validate phone number format (Kyrgyzstan)
 * @param {string} phone Phone number to validate
 * @returns {boolean} Whether the phone is valid
 */
export const validatePhone = (phone) => {
  if (!phone) return false;
  
  // Clean input of non-digit characters
  const cleanedPhone = String(phone).replace(/\s/g, '');
  
  // Support formats: +996700123456, 996700123456, 0700123456
  const re = /^(\+996|996|0)[0-9]{9}$/;
  return re.test(cleanedPhone);
};

/**
 * Validate password strength
 * @param {string} password Password to validate
 * @returns {boolean} Whether the password meets requirements
 */
export const validatePassword = (password) => {
  if (!password) return false;
  
  // Require at least 8 characters with at least one letter and one number
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return re.test(String(password));
};

/**
 * Validate Kyrgyzstan car plate number
 * @param {string} plateNumber Car plate number to validate
 * @returns {boolean} Whether the plate number is valid
 */
export const validateCarPlateNumber = (plateNumber) => {
  if (!plateNumber) return false;
  
  // Format to uppercase and remove spaces
  const cleanedPlate = String(plateNumber).toUpperCase().replace(/\s/g, '');
  
  // Support formats: B1234ABC, 01KG123ABC
  const re = /^([A-Z][0-9]{4}[A-Z]{3}|[0-9]{2}KG[0-9]{3}[A-Z]{3})$/;
  return re.test(cleanedPlate);
};

/**
 * Validate person name
 * @param {string} name Name to validate
 * @returns {boolean} Whether the name is valid
 */
export const validateName = (name) => {
  if (!name) return false;
  
  // Name should contain only letters and spaces, minimum 2 characters
  // Includes Kyrgyz characters
  const re = /^[A-Za-zА-Яа-яЁёҮүӨөҢңҮүҖ\s]{2,}$/;
  return re.test(String(name));
};

/**
 * Validate car year
 * @param {number|string} year Year to validate
 * @returns {boolean} Whether the year is valid
 */
export const validateCarYear = (year) => {
  if (!year) return false;
  
  const currentYear = new Date().getFullYear();
  const yearNumber = parseInt(year, 10);
  
  // Valid years are between 1950 and next year (for new models)
  return !isNaN(yearNumber) && yearNumber >= 1950 && yearNumber <= currentYear + 1;
};

/**
 * Validate date in YYYY-MM-DD format and check if it's not in the past
 * @param {string} date Date to validate
 * @returns {boolean} Whether the date is valid
 */
export const validateDate = (date) => {
  if (!date) return false;
  
  // Check format: YYYY-MM-DD
  const re = /^\d{4}-\d{2}-\d{2}$/;
  if (!re.test(date)) return false;
  
  // Check if it's a valid date
  const d = new Date(date);
  if (isNaN(d.getTime())) return false;
  
  // Check if date is not in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return d >= today;
};

/**
 * Validate time in HH:MM format
 * @param {string} time Time to validate
 * @returns {boolean} Whether the time is valid
 */
export const validateTime = (time) => {
  if (!time) return false;
  
  // Check format: HH:MM (24-hour)
  const re = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return re.test(time);
};

/**
 * Validate text length
 * @param {string} text Text to validate
 * @param {number} maxLength Maximum allowed length
 * @returns {boolean} Whether the text length is valid
 */
export const validateTextLength = (text, maxLength = 500) => {
  if (text === undefined || text === null) return true;
  return String(text).length <= maxLength;
};

/**
 * Validate form data against a set of rules
 * @param {Object} formData Form data to validate
 * @param {Object} validationRules Validation rules
 * @returns {Object} Validation results with errors and isValid flag
 */
export const validateForm = (formData, validationRules) => {
  const errors = {};
  
  Object.entries(validationRules).forEach(([field, rules]) => {
    const value = formData[field];
    
    // Required rule
    if (rules.required && (!value && value !== 0)) {
      errors[field] = rules.requiredMessage || 'Это поле обязательно для заполнения';
      return;
    }
    
    // Skip remaining validations if the field is empty and not required
    if (!value && value !== 0) return;
    
    // Min length rule
    if (rules.minLength && String(value).length < rules.minLength) {
      errors[field] = rules.minLengthMessage || `Минимальная длина: ${rules.minLength} символов`;
      return;
    }
    
    // Max length rule
    if (rules.maxLength && String(value).length > rules.maxLength) {
      errors[field] = rules.maxLengthMessage || `Максимальная длина: ${rules.maxLength} символов`;
      return;
    }
    
    // Pattern rule
    if (rules.pattern && !new RegExp(rules.pattern).test(value)) {
      errors[field] = rules.patternMessage || 'Некорректное значение';
      return;
    }
    
    // Custom validation function
    if (rules.validator && typeof rules.validator === 'function') {
      const validationResult = rules.validator(value, formData);
      if (validationResult !== true) {
        errors[field] = validationResult || 'Некорректное значение';
      }
    }
  });
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};