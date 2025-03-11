import api from '../config/api';

/**
 * Get company information
 * @returns {Promise<Object>} Company information
 */
export const getCompanyInfo = async () => {
  const response = await api.get('/company');
  return response.data;
};

/**
 * Get current queue status
 * @returns {Promise<Object>} Current queue data
 */
export const getQueueStatus = async () => {
  const response = await api.get('/queue');
  return response.data;
};

/**
 * Get company reviews
 * @returns {Promise<Array>} List of company reviews
 */
export const getCompanyReviews = async () => {
  const response = await api.get('/reviews');
  return response.data;
};

/**
 * Submit contact form
 * @param {Object} formData Form data
 * @returns {Promise<Object>} Submission result
 */
export const submitContactForm = async (formData) => {
  const response = await api.post('/contact', formData);
  return response.data;
};