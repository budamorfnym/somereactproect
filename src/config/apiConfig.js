// src/config/apiConfig.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.a1detailing.kg/api/v1';
const API_TIMEOUT = 15000; // 15 секунд

export default {
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};