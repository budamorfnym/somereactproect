import { validateEmail, validatePhone, validatePassword, validateName } from './validators';

/**
 * Form validation utility for common forms
 */
export const formValidation = {
  /**
   * Validate login form
   * 
   * @param {Object} formData Form data
   * @returns {Object} Validation result with errors object and isValid flag
   */
  loginForm: (formData) => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'Email обязателен для заполнения';
    }
    
    if (!formData.password) {
      errors.password = 'Пароль обязателен для заполнения';
    }
    
    return {
      errors,
      isValid: Object.keys(errors).length === 0
    };
  },
  
  /**
   * Validate registration form
   * 
   * @param {Object} formData Form data
   * @returns {Object} Validation result with errors object and isValid flag
   */
  registerForm: (formData) => {
    const errors = {};
    
    // Validate name
    if (!formData.name || !formData.name.trim()) {
      errors.name = 'Имя обязательно для заполнения';
    } else if (!validateName(formData.name)) {
      errors.name = 'Имя должно содержать только буквы и пробелы';
    }
    
    // Validate email
    if (!formData.email || !formData.email.trim()) {
      errors.email = 'Email обязателен для заполнения';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Введите корректный email';
    }
    
    // Validate phone
    if (!formData.phone || !formData.phone.trim()) {
      errors.phone = 'Телефон обязателен для заполнения';
    } else if (!validatePhone(formData.phone)) {
      errors.phone = 'Введите корректный номер телефона';
    }
    
    // Validate password
    if (!formData.password) {
      errors.password = 'Пароль обязателен для заполнения';
    } else if (!validatePassword(formData.password)) {
      errors.password = 'Пароль должен содержать минимум 8 символов, включая цифру и букву';
    }
    
    // Validate password confirmation
    if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = 'Пароли не совпадают';
    }
    
    // Validate terms agreement
    if (!formData.agreeTerms) {
      errors.agreeTerms = 'Необходимо согласиться с условиями';
    }
    
    return {
      errors,
      isValid: Object.keys(errors).length === 0
    };
  },
  
  /**
   * Validate contact form
   * 
   * @param {Object} formData Form data
   * @returns {Object} Validation result with errors object and isValid flag
   */
  contactForm: (formData) => {
    const errors = {};
    
    if (!formData.name || !formData.name.trim()) {
      errors.name = 'Имя обязательно для заполнения';
    }
    
    if (!formData.email || !formData.email.trim()) {
      errors.email = 'Email обязателен для заполнения';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Введите корректный email';
    }
    
    if (!formData.message || !formData.message.trim()) {
      errors.message = 'Сообщение обязательно для заполнения';
    } else if (formData.message.length < 10) {
      errors.message = 'Сообщение должно содержать не менее 10 символов';
    }
    
    return {
      errors,
      isValid: Object.keys(errors).length === 0
    };
  },
  
  /**
   * Validate booking form
   * 
   * @param {Object} formData Form data
   * @returns {Object} Validation result with errors object and isValid flag
   */
  bookingForm: (formData) => {
    const errors = {};
    
    if (!formData.serviceId) {
      errors.serviceId = 'Выберите услугу';
    }
    
    if (!formData.date) {
      errors.date = 'Выберите дату';
    }
    
    if (!formData.time) {
      errors.time = 'Выберите время';
    }
    
    if (!formData.carId) {
      errors.carId = 'Выберите автомобиль';
    }
    
    if (formData.comment && formData.comment.length > 500) {
      errors.comment = 'Комментарий не должен превышать 500 символов';
    }
    
    return {
      errors,
      isValid: Object.keys(errors).length === 0
    };
  },
  
  /**
   * Validate car form
   * 
   * @param {Object} formData Form data
   * @returns {Object} Validation result with errors object and isValid flag
   */
  carForm: (formData) => {
    const errors = {};
    
    if (!formData.model || !formData.model.trim()) {
      errors.model = 'Модель автомобиля обязательна для заполнения';
    }
    
    if (!formData.plateNumber || !formData.plateNumber.trim()) {
      errors.plateNumber = 'Номер автомобиля обязателен для заполнения';
    }
    
    if (formData.year) {
      const currentYear = new Date().getFullYear();
      const year = parseInt(formData.year, 10);
      
      if (isNaN(year) || year < 1900 || year > currentYear + 1) {
        errors.year = 'Введите корректный год выпуска';
      }
    }
    
    return {
      errors,
      isValid: Object.keys(errors).length === 0
    };
  },
  
  /**
   * Generic validation function
   * 
   * @param {Object} formData Form data
   * @param {Object} rules Validation rules object
   * @returns {Object} Validation result with errors object and isValid flag
   */
  validateByRules: (formData, rules) => {
    const errors = {};
    
    Object.entries(rules).forEach(([field, validations]) => {
      const value = formData[field];
      
      // Required validation
      if (validations.required && (!value || (typeof value === 'string' && !value.trim()))) {
        errors[field] = validations.required === true 
          ? 'Это поле обязательно для заполнения' 
          : validations.required;
        return;
      }
      
      // Only proceed with other validations if the field has a value
      if (value) {
        // Min length validation
        if (validations.minLength && value.length < validations.minLength) {
          errors[field] = `Минимальная длина: ${validations.minLength} символов`;
          return;
        }
        
        // Max length validation
        if (validations.maxLength && value.length > validations.maxLength) {
          errors[field] = `Максимальная длина: ${validations.maxLength} символов`;
          return;
        }
        
        // Pattern validation
        if (validations.pattern && !new RegExp(validations.pattern).test(value)) {
          errors[field] = validations.patternMessage || 'Введите корректное значение';
          return;
        }
        
        // Custom validation
        if (validations.validate && typeof validations.validate === 'function') {
          const result = validations.validate(value, formData);
          if (typeof result === 'string') {
            errors[field] = result;
            return;
          }
        }
      }
    });
    
    return {
      errors,
      isValid: Object.keys(errors).length === 0
    };
  }
};