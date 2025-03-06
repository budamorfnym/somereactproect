import React from 'react';
import { useNavigate } from 'react-router-dom';

const ServiceCategories = ({ categories, setActiveServiceCategory }) => {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-6">
        Наши услуги
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
        {categories
          .filter((cat) => cat.id !== "all")
          .map((category) => (
            <div
              key={category.id}
              className="bg-gray-800 border border-gray-700 rounded-lg p-4 md:p-6 flex flex-col items-center cursor-pointer hover:border-red-600 transition"
              onClick={() => {
                setActiveServiceCategory(category.id);
                navigate('/services');
              }}
            >
              <span className="text-2xl md:text-3xl mb-2 md:mb-3">
                {category.icon}
              </span>
              <h3 className="text-sm md:text-lg font-medium text-white text-center">
                {category.name}
              </h3>
            </div>
          ))}
      </div>
    </div>
  );
};