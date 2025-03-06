import React from 'react';
import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ServiceCard = ({ service, onBookNow }) => {
  const { isAuthenticated } = useAuth();
  
  const getCategoryName = (categoryId) => {
    const categories = {
      'wash': 'Мойка',
      'cleaning': 'Химчистка',
      'polish': 'Полировка',
      'coating': 'Керамика',
      'pdr': 'ПДР',
      'wrap': 'Оклейка'
    };
    
    return categories[categoryId] || categoryId;
  };

  const handleBookClick = (e) => {
    e.preventDefault();
    onBookNow(service);
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-red-600 transition-colors duration-200 flex flex-col">
      <div className="relative h-48 bg-gray-700">
        {service.imageUrl ? (
          <img 
            src={service.imageUrl} 
            alt={service.name} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <span className="text-4xl">{service.category === 'wash' ? '🚿' : 
                                       service.category === 'cleaning' ? '🧪' : 
                                       service.category === 'polish' ? '✨' : 
                                       service.category === 'coating' ? '🛡️' : 
                                       service.category === 'pdr' ? '🔨' : '📜'}</span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
          {getCategoryName(service.category)}
        </div>
      </div>
      <div className="p-4 flex-grow">
        <h3 className="text-lg font-semibold text-white mb-2">{service.name}</h3>
        <p className="text-gray-400 mb-4 text-sm">{service.description}</p>
        <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
          <span className="flex items-center"><Clock size={14} className="mr-1" /> {service.duration} мин.</span>
          <span className="text-yellow-500 font-bold">{service.price.toLocaleString()} сом</span>
        </div>
        {isAuthenticated ? (
          <button
            className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-200"
            onClick={handleBookClick}
          >
            Записаться
          </button>
        ) : (
          <Link 
            to="/login" 
            className="w-full block text-center bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-200"
          >
            Войти для записи
          </Link>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;