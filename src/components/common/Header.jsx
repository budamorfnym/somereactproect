import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Award, Bell, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';

const Header = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { success } = useNotification();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    success('Вы успешно вышли из системы');
    navigate('/');
  };

  return (
    <header className="bg-black shadow-lg sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-red-600 flex items-center">
            A1<span className="text-yellow-500">Detailing</span>
          </Link>

          {/* Десктопная навигация */}
          <nav className="hidden md:flex space-x-1">
            <Link
              to="/"
              className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-gray-300 hover:bg-gray-800"
            >
              Главная
            </Link>
            <Link
              to="/services"
              className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-gray-300 hover:bg-gray-800"
            >
              Услуги
            </Link>
            <Link
              to="/cars"
              className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-gray-300 hover:bg-gray-800"
            >
              Мои авто
            </Link>
            <Link
              to="/loyalty"
              className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-gray-300 hover:bg-gray-800"
            >
              Лояльность
            </Link>
            <Link
              to="/contact"
              className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-gray-300 hover:bg-gray-800"
            >
              Контакты
            </Link>
          </nav>

          {/* Профиль и уведомления */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <button className="text-white p-1.5 rounded-full hover:bg-gray-800">
                  <Bell size={20} />
                </button>
                <div className="relative group">
                  <div className="bg-gray-800 p-2 rounded-full cursor-pointer">
                    <User size={20} />
                  </div>
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 hidden group-hover:block">
                    <div className="px-4 py-2 text-sm text-gray-300">
                      {currentUser?.name}
                    </div>
                    <div className="px-4 py-2 text-sm text-yellow-500 flex items-center">
                      <Award size={14} className="mr-2" /> {currentUser?.loyaltyPoints} баллов
                    </div>
                    <div className="border-t border-gray-700"></div>
                    <Link
                      to="/profile"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    >
                      Профиль
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                      onClick={handleLogout}
                    >
                      <div className="flex items-center">
                        <LogOut size={14} className="mr-2" /> Выйти
                      </div>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-red-600 px-4 py-2 rounded-md text-sm font-medium text-white hover:bg-red-700 transition-colors duration-200"
              >
                Войти
              </Link>
            )}
          </div>

          {/* Мобильное меню */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Мобильная навигация */}
        {showMobileMenu && (
          <div className="md:hidden mt-3 pb-3 space-y-1 border-t border-gray-800 pt-3">
            <Link
              to="/"
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800"
              onClick={() => setShowMobileMenu(false)}
            >
              Главная
            </Link>
            <Link
              to="/services"
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800"
              onClick={() => setShowMobileMenu(false)}
            >
              Услуги
            </Link>
            <Link
              to="/cars"
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800"
              onClick={() => setShowMobileMenu(false)}
            >
              Мои авто
            </Link>
            <Link
              to="/loyalty"
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800"
              onClick={() => setShowMobileMenu(false)}
            >
              Лояльность
            </Link>
            <Link
              to="/contact"
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800"
              onClick={() => setShowMobileMenu(false)}
            >
              Контакты
            </Link>

            {/* Мобильный профиль */}
            {isAuthenticated ? (
              <div className="pt-2 border-t border-gray-700 mt-2">
                <div className="px-3 py-2 text-gray-300">
                  <div className="font-medium">{currentUser?.name}</div>
                  <div className="text-sm text-yellow-500 flex items-center">
                    <Award size={14} className="mr-2" /> {currentUser?.loyaltyPoints} баллов
                  </div>
                </div>
                <Link
                  to="/profile"
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Профиль
                </Link>
                <button
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800"
                  onClick={() => {
                    handleLogout();
                    setShowMobileMenu(false);
                  }}
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
                onClick={() => setShowMobileMenu(false)}
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