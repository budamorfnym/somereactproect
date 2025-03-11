import React from 'react';
import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ServiceCard = ({ service, onBookNow }) => {
  const { isAuthenticated } = useAuth();
  
  // Get category icon
  const getCategoryIcon = (categoryId) => {
    const icons = {
      'wash': '🚿',
      'cleaning': '🧪',
      'polish': '✨',
      'coating': '🛡️',
      'pdr': '🔨',
      'wrap': '📜',
      'default': '🔧'
    };
    
    return icons[categoryId] || icons.default;
  };
  
  // Get category name
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
    <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-red-600 transition-colors duration-200 flex flex-col h-full">
      {/* Use aspect ratio for consistent cards */}
      <div className="relative pt-[56.25%] bg-gray-700">
        {service.imageUrl ? (
          <img 
            src={service.imageUrl} 
            alt={service.name} 
            className="absolute top-0 left-0 w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/400x225?text=A1+Detailing"; 
            }}
          />
        ) : (
          <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full text-gray-500">
            <span className="text-4xl">{getCategoryIcon(service.category)}</span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
          {getCategoryName(service.category)}
        </div>
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">{service.name}</h3>
        <p className="text-gray-400 mb-4 text-sm flex-grow line-clamp-3">{service.description}</p>
        
        <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
          <span className="flex items-center">
            <Clock size={14} className="mr-1" /> {service.duration} мин.
          </span>
          <span className="text-yellow-500 font-bold">
            {service.price.toLocaleString()} сом
          </span>
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
            state={{ from: `/services?service=${service.id}` }}
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