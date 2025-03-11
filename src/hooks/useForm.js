import { useState, useCallback } from 'react';
import { validateForm } from '../utils/validators';
import { useNotification } from './useNotification';

/**
 * Переиспользуемый хук для работы с формами
 * @param {Object} initialValues Начальные значения полей формы
 * @param {Object} validationRules Правила валидации полей
 * @param {Function} onSubmit Функция отправки формы
 * @param {Object} options Дополнительные опции
 * @returns {Object} Методы и состояние формы
 */
const useForm = (
  initialValues, 
  validationRules = {}, 
  onSubmit = () => {}, 
  options = {}
) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  
  const { error: showError } = useNotification();
  
  // Опции
  const { 
    validateOnChange = true, 
    validateOnBlur = true,
    validateOnSubmit = true,
    showErrorNotifications = true
  } = options;
  
  /**
   * Валидация всей формы или отдельного поля
   * @param {string} fieldName Имя поля (опционально для валидации всей формы)
   * @returns {boolean} Результат валидации
   */
  const validate = useCallback((fieldName = null) => {
    setIsValidating(true);
    
    try {
      // Валидация одного поля
      if (fieldName) {
        if (!validationRules[fieldName]) {
          return true;
        }
        
        const fieldValue = values[fieldName];
        const fieldRule = { [fieldName]: validationRules[fieldName] };
        const fieldData = { [fieldName]: fieldValue };
        
        const { errors: fieldErrors, isValid } = validateForm(fieldData, fieldRule);
        
        setErrors(prev => ({
          ...prev,
          [fieldName]: fieldErrors[fieldName] || null
        }));
        
        return isValid;
      }
      
      // Валидация всех полей
      const { errors: formErrors, isValid } = validateForm(values, validationRules);
      setErrors(formErrors);
      
      return isValid;
    } finally {
      setIsValidating(false);
    }
  }, [values, validationRules]);
  
  /**
   * Обработчик изменения значения поля
   * @param {Event} e Событие изменения
   */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setValues(prev => ({
      ...prev,
      [name]: fieldValue
    }));
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Валидация при изменении, если включена
    if (validateOnChange && touched[name]) {
      setTimeout(() => {
        validate(name);
      }, 0);
    }
  }, [touched, validate, validateOnChange]);
  
  /**
   * Обработчик потери фокуса полем
   * @param {Event} e Событие blur
   */
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Валидация при потере фокуса, если включена
    if (validateOnBlur) {
      validate(name);
    }
  }, [validate, validateOnBlur]);
  
  /**
   * Обработчик отправки формы
   * @param {Event} e Событие отправки формы
   */
  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    
    // Пометить все поля как затронутые
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    
    setTouched(allTouched);
    
    // Валидация перед отправкой, если включена
    let isValid = true;
    if (validateOnSubmit) {
      isValid = validate();
      
      if (!isValid && showErrorNotifications) {
        // Найти первую ошибку для отображения
        const firstError = Object.values(errors).find(error => !!error);
        if (firstError) {
          showError(firstError);
        }
        return;
      }
    }
    
    if (isValid) {
      setIsSubmitting(true);
      
      try {
        await onSubmit(values);
      } catch (error) {
        if (showErrorNotifications) {
          showError(error.message || 'Произошла ошибка при отправке формы');
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [errors, onSubmit, showError, showErrorNotifications, validate, validateOnSubmit, values]);
  
  /**
   * Обновить значения нескольких полей сразу
   * @param {Object} newValues Объект с новыми значениями полей
   */
  const setMultipleValues = useCallback((newValues) => {
    setValues(prev => ({
      ...prev,
      ...newValues
    }));
  }, []);
  
  /**
   * Установить значение одного поля
   * @param {string} name Имя поля
   * @param {any} value Новое значение
   */
  const setValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);
  
  /**
   * Сбросить форму к начальным значениям
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValidating,
    handleChange,
    handleBlur,
    handleSubmit,
    setMultipleValues,
    setValue,
    resetForm,
    validate
  };
};

export default useForm;