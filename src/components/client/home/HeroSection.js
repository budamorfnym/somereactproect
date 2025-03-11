import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

const HeroSection = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative">
      {/* Background Image */}
      <div className="absolute inset-0 bg-gray-900 opacity-90">
        <img
          src="/images/hero-background.jpg"
          alt="Car detailing"
          className="w-full h-full object-cover mix-blend-overlay"
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = 'none';
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32 flex flex-col items-center text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6">
          Профессиональный уход за вашим автомобилем
        </h1>
        
        <p className="text-xl text-gray-300 mb-8 max-w-3xl">
          Мы предлагаем полный комплекс услуг по детейлингу и уходу за автомобилем.
          Доверьте нам свой автомобиль и вы будете приятно удивлены результатом!
        </p>
        
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            to="/services"
            className="px-8 py-4 bg-red-600 text-white text-lg font-medium rounded-md hover:bg-red-700 transition-colors duration-200"
          >
            Наши услуги
          </Link>
          
          <Link
            to={isAuthenticated ? "/booking" : "/login"}
            className="px-8 py-4 bg-gray-800 text-white text-lg font-medium rounded-md hover:bg-gray-700 transition-colors duration-200"
          >
            {isAuthenticated ? "Записаться онлайн" : "Войти для записи"}
          </Link>
        </div>
      </div>
      
      {/* Features */}
      <div className="relative max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="text-4xl mb-4">🛠️</div>
            <h3 className="text-xl font-bold text-white mb-2">Профессиональное оборудование</h3>
            <p className="text-gray-400">Мы используем только профессиональное оборудование и материалы</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="text-4xl mb-4">👨‍🔧</div>
            <h3 className="text-xl font-bold text-white mb-2">Опытные специалисты</h3>
            <p className="text-gray-400">Наши мастера имеют многолетний опыт работы с автомобилями всех марок</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="text-4xl mb-4">⏱️</div>
            <h3 className="text-xl font-bold text-white mb-2">Точно в срок</h3>
            <p className="text-gray-400">Все работы выполняются качественно и точно в обещанный срок</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;