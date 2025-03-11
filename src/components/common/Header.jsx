import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Award, Bell, User, LogOut, Menu, X, Search } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import SearchBar from './SearchBar';

const Header = ({ activeTab, companyInfo }) => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { success } = useNotification();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll position to add shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close menu when route changes
  useEffect(() => {
    setShowMobileMenu(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    success('Вы успешно вышли из системы');
    navigate('/');
  };

  return (
    <header className={`bg-black sticky top-0 z-30 transition-shadow duration-300 ${isScrolled ? 'shadow-lg' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              className="md:hidden text-gray-300 hover:text-white p-2 -ml-2 mr-1"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            {/* Logo */}
            <Link to="/" className="text-xl font-bold text-red-600 flex items-center">
              A1<span className="text-yellow-500">Detailing</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'home' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              Главная
            </Link>
            <Link
              to="/services"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'services' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              Услуги
            </Link>
            <Link
              to="/cars"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'cars' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              Мои авто
            </Link>
            <Link
              to="/loyalty"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'loyalty' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              Лояльность
            </Link>
            <Link
              to="/gallery"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'gallery' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              Галерея
            </Link>
            <Link
              to="/contact"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'contact' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              Контакты
            </Link>
          </nav>

          {/* Right section: Profile, etc */}
          <div className="flex items-center space-x-2">
            {/* Search */}
            <SearchBar />
            
            {/* Profile dropdown */}
            {isAuthenticated ? (
              <div className="relative group">
                <div className="bg-gray-800 p-2 rounded-full cursor-pointer">
                  <User size={20} className="text-white" />
                </div>
                
                <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-md shadow-lg py-1 hidden group-hover:block z-50">
                  <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
                    <div>{currentUser?.name}</div>
                    <div className="text-xs text-gray-400">{currentUser?.email}</div>
                  </div>
                  
                  {currentUser?.loyaltyPoints > 0 && (
                    <div className="px-4 py-2 text-sm text-yellow-500 flex items-center border-b border-gray-700">
                      <Award size={14} className="mr-2" /> {currentUser.loyaltyPoints} баллов
                    </div>
                  )}
                  
                  <Link
                    to="/profile"
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  >
                    Мой профиль
                  </Link>
                  
                  <Link
                    to="/profile/bookings"
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  >
                    Мои записи
                  </Link>
                  
                  <Link
                    to="/cars"
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  >
                    Мои автомобили
                  </Link>
                  
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 border-t border-gray-700"
                    onClick={handleLogout}
                  >
                    <div className="flex items-center">
                      <LogOut size={14} className="mr-2" /> Выйти
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-red-600 px-4 py-2 rounded-md text-sm font-medium text-white hover:bg-red-700 transition-colors duration-200"
              >
                Войти
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        {showMobileMenu && (
          <div className="md:hidden mt-3 pb-3 space-y-1 border-t border-gray-800 pt-3">
            <Link
              to="/"
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                activeTab === 'home' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              Главная
            </Link>
            <Link
              to="/services"
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                activeTab === 'services' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              Услуги
            </Link>
            <Link
              to="/cars"
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                activeTab === 'cars' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              Мои авто
            </Link>
            <Link
              to="/loyalty"
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                activeTab === 'loyalty' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              Лояльность
            </Link>
            <Link
              to="/gallery"
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                activeTab === 'gallery' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              Галерея
            </Link>
            <Link
              to="/contact"
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                activeTab === 'contact' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              Контакты
            </Link>

            {/* Mobile profile section */}
            {isAuthenticated ? (
              <div className="pt-2 border-t border-gray-700 mt-2">
                <div className="px-3 py-2 text-gray-300">
                  <div className="font-medium">{currentUser?.name}</div>
                  <div className="text-sm text-yellow-500 flex items-center">
                    <Award size={14} className="mr-2" /> {currentUser?.loyaltyPoints || 0} баллов
                  </div>
                </div>
                <Link
                  to="/profile"
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    activeTab === 'profile' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  Профиль
                </Link>
                <button
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800"
                  onClick={handleLogout}
                >
                  <div className="flex items-center">
                    <LogOut size={14} className="mr-2" /> Выйти
                  </div>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="mt-2 w-full block bg-red-600 px-3 py-2 rounded-md text-base font-medium text-white hover:bg-red-700 text-center"
              >
                Войти
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;