import api from '../config/api';

export const getCompanyInfo = async () => {
  try {
    const response = await api.get('/company');
    return response.data;
  } catch (error) {
    console.error('Error fetching company info:', error);
    // Return default company info in case the API fails
    return {
      name: 'A1Detailing',
      address: 'ул. Байтик Баатыра, 98 / ул. Максима Горького, 27/1, Бишкек',
      phone: '+996 550 000 000',
      email: 'info@a1detailing.kg',
      workHours: 'Пн-Сб: 9:00 - 19:00, Вс: 10:00 - 17:00',
      coordinates: {
        lat: 42.8746,
        lng: 74.5698,
      },
      socialMedia: {
        instagram: 'https://instagram.com/a1detailing',
        facebook: 'https://facebook.com/a1detailing',
        whatsapp: 'https://wa.me/996550000000'
      }
    };
  }
};

export const getQueueStatus = async () => {
  try {
    const response = await api.get('/queue');
    return response.data;
  } catch (error) {
    console.error('Error fetching queue status:', error);
    return {
      currentWashing: [],
      waiting: []
    };
  }
};

export const getCompanyReviews = async () => {
  try {
    const response = await api.get('/reviews');
    return response.data;
  } catch (error) {
    console.error('Error fetching company reviews:', error);
    return [];
  }
};

export const submitContactForm = async (formData) => {
  const response = await api.post('/contact', formData);
  return response.data;
};