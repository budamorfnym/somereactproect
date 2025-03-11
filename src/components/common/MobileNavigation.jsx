import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Tool, Car, Award, Phone, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const MobileNavigation = ({ activeTab }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Define navigation items
  const navItems = [
    { id: 'home', icon: <Home size={20} />, label: 'Главная', path: '/' },
    { id: 'services', icon: <Tool size={20} />, label: 'Услуги', path: '/services' },
    { id: 'cars', icon: <Car size={20} />, label: 'Авто', path: isAuthenticated ? '/cars' : '/login', auth: true },
    { id: 'loyalty', icon: <Award size={20} />, label: 'Баллы', path: isAuthenticated ? '/loyalty' : '/login', auth: true },
    { id: 'contact', icon: <Phone size={20} />, label: 'Контакты', path: '/contact' },
    { id: 'profile', icon: <User size={20} />, label: 'Профиль', path: isAuthenticated ? '/profile' : '/login', auth: true }
  ];
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-30">
      <div className="grid grid-cols-5 py-2">
        {navItems
          .filter((item, index) => index < 5) // Show only first 5 items in the bottom bar
          .map(item => (
            <Link
              key={item.id}
              to={item.path}
              className={`flex flex-col items-center justify-center px-2 ${
                activeTab === item.id ? 'text-red-600' : 'text-gray-400'
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default MobileNavigation;