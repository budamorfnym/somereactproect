import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Tool, Car, Award, Phone } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const MobileNavigation = ({ activeTab }) => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-30">
      <div className="grid grid-cols-5 py-2">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center px-2 ${
            activeTab === 'home' ? 'text-red-600' : 'text-gray-400'
          }`}
        >
          <Home size={24} />
          <span className="text-xs mt-1">Главная</span>
        </Link>
        
        <Link
          to="/services"
          className={`flex flex-col items-center justify-center px-2 ${
            activeTab === 'services' ? 'text-red-600' : 'text-gray-400'
          }`}
        >
          <Tool size={24} />
          <span className="text-xs mt-1">Услуги</span>
        </Link>
        
        <Link
          to={isAuthenticated ? "/cars" : "/login"}
          className={`flex flex-col items-center justify-center px-2 ${
            activeTab === 'cars' ? 'text-red-600' : 'text-gray-400'
          }`}
        >
          <Car size={24} />
          <span className="text-xs mt-1">Авто</span>
        </Link>
        
        <Link
          to={isAuthenticated ? "/loyalty" : "/login"}
          className={`flex flex-col items-center justify-center px-2 ${
            activeTab === 'loyalty' ? 'text-red-600' : 'text-gray-400'
          }`}
        >
          <Award size={24} />
          <span className="text-xs mt-1">Баллы</span>
        </Link>
        
        <Link
          to="/contact"
          className={`flex flex-col items-center justify-center px-2 ${
            activeTab === 'contact' ? 'text-red-600' : 'text-gray-400'
          }`}
        >
          <Phone size={24} />
          <span className="text-xs mt-1">Контакты</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileNavigation;