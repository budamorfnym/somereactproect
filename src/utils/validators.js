export const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  
  // Валидация телефона
  export const validatePhone = (phone) => {
    // Поддерживаем форматы: +996700123456, 996700123456, 0700123456
    const re = /^(\+996|996|0)[0-9]{9}$/;
    return re.test(String(phone).replace(/\s/g, ''));
  };
  
  // Валидация пароля
  export const validatePassword = (password) => {
    // Минимум 8 символов, хотя бы одна буква и одна цифра
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return re.test(String(password));
  };
  
  // Валидация номера автомобиля КР
  export const validateCarPlateNumber = (plateNumber) => {
    // Поддерживаем форматы: B1234ABC, 01KG123ABC
    const re = /^([A-Z][0-9]{4}[A-Z]{3}|[0-9]{2}KG[0-9]{3}[A-Z]{3})$/;
    return re.test(String(plateNumber).toUpperCase());
  };
  
  // Валидация имени
  export const validateName = (name) => {
    // Имя должно содержать только буквы и пробелы, минимум 2 символа
    const re = /^[A-Za-zА-Яа-яЁёҮүӨөҢңҮүҖ\s]{2,}$/;
    return re.test(String(name));
  };
  
  // Валидация года автомобиля
  export const validateCarYear = (year) => {
    const currentYear = new Date().getFullYear();
    const yearNumber = parseInt(year, 10);
    return !isNaN(yearNumber) && yearNumber >= 1950 && yearNumber <= currentYear + 1;
  };
  
  // Валидация даты
  export const validateDate = (date) => {
    // Проверяем формат даты: YYYY-MM-DD
    const re = /^\d{4}-\d{2}-\d{2}$/;
    if (!re.test(date)) return false;
    
    // Проверяем корректность даты
    const d = new Date(date);
    if (isNaN(d.getTime())) return false;
    
    // Проверяем, что дата не в прошлом
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d >= today;
  };
  
  // Валидация времени
  export const validateTime = (time) => {
    // Проверяем формат времени: HH:MM
    const re = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return re.test(time);
  };
  
  // Валидация комментария
  export const validateComment = (comment, maxLength = 500) => {
    return comment.length <= maxLength;
  };