import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter, ChevronRight } from 'lucide-react';

const Footer = ({ companyInfo }) => {
  const year = new Date().getFullYear();
  
  // Default company info if none is provided
  const {
    name = 'A1Detailing',
    address = 'ул. Байтик Баатыра, 98 / ул. Максима Горького, 27/1, Бишкек',
    phone = '+996 550 000 000',
    email = 'info@a1detailing.kg',
    workHours = 'Пн-Сб: 9:00 - 19:00, Вс: 10:00 - 17:00',
    socialMedia = {
      instagram: 'https://instagram.com/a1detailing',
      facebook: 'https://facebook.com/a1detailing',
      whatsapp: 'https://wa.me/996550000000'
    }
  } = companyInfo || {};
  
  return (
    <footer className="bg-black pt-12 pb-6 md:pb-8 mt-12">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-red-600">
              A1<span className="text-yellow-500">Detailing</span>
            </h3>
            <p className="text-gray-400 mb-4">
              Профессиональный уход за вашим автомобилем
            </p>
            <div className="space-y-2">
              <div className="flex items-start">
                <MapPin size={18} className="text-gray-500 mr-2 mt-1 flex-shrink-0" />
                <p className="text-gray-400 text-sm">{address}</p>
              </div>
              <div className="flex items-center">
                <Phone size={18} className="text-gray-500 mr-2 flex-shrink-0" />
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-gray-400 text-sm hover:text-white transition-colors">
                  {phone}
                </a>
              </div>
              <div className="flex items-center">
                <Mail size={18} className="text-gray-500 mr-2 flex-shrink-0" />
                <a href={`mailto:${email}`} className="text-gray-400 text-sm hover:text-white transition-colors">
                  {email}
                </a>
              </div>
              <div className="flex items-start">
                <Clock size={18} className="text-gray-500 mr-2 mt-1 flex-shrink-0" />
                <p className="text-gray-400 text-sm">{workHours}</p>
              </div>
            </div>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="text-md font-semibold uppercase tracking-wider mb-4 text-gray-300">
              Услуги
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services?category=wash" className="text-gray-400 text-sm hover:text-white transition-colors flex items-center">
                  <ChevronRight size={14} className="mr-1" />
                  Автомойка
                </Link>
              </li>
              <li>
                <Link to="/services?category=cleaning" className="text-gray-400 text-sm hover:text-white transition-colors flex items-center">
                  <ChevronRight size={14} className="mr-1" />
                  Химчистка
                </Link>
              </li>
              <li>
                <Link to="/services?category=polish" className="text-gray-400 text-sm hover:text-white transition-colors flex items-center">
                  <ChevronRight size={14} className="mr-1" />
                  Полировка
                </Link>
              </li>
              <li>
                <Link to="/services?category=coating" className="text-gray-400 text-sm hover:text-white transition-colors flex items-center">
                  <ChevronRight size={14} className="mr-1" />
                  Керамика
                </Link>
              </li>
              <li>
                <Link to="/services?category=pdr" className="text-gray-400 text-sm hover:text-white transition-colors flex items-center">
                  <ChevronRight size={14} className="mr-1" />
                  Удаление вмятин
                </Link>
              </li>
              <li>
                <Link to="/services?category=wrap" className="text-gray-400 text-sm hover:text-white transition-colors flex items-center">
                  <ChevronRight size={14} className="mr-1" />
                  Оклейка
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Information */}
          <div>
            <h3 className="text-md font-semibold uppercase tracking-wider mb-4 text-gray-300">
              Информация
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="text-gray-400 text-sm hover:text-white transition-colors flex items-center">
                  <ChevronRight size={14} className="mr-1" />
                  Услуги и цены
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-400 text-sm hover:text-white transition-colors flex items-center">
                  <ChevronRight size={14} className="mr-1" />
                  Фотогалерея
                </Link>
              </li>
              <li>
                <Link to="/loyalty" className="text-gray-400 text-sm hover:text-white transition-colors flex items-center">
                  <ChevronRight size={14} className="mr-1" />
                  Программа лояльности
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 text-sm hover:text-white transition-colors flex items-center">
                  <ChevronRight size={14} className="mr-1" />
                  Контакты
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 text-sm hover:text-white transition-colors flex items-center">
                  <ChevronRight size={14} className="mr-1" />
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 text-sm hover:text-white transition-colors flex items-center">
                  <ChevronRight size={14} className="mr-1" />
                  Условия использования
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-md font-semibold uppercase tracking-wider mb-4 text-gray-300">
              Будьте в курсе
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Подпишитесь на нашу рассылку, чтобы получать новости и специальные предложения
            </p>
            <form className="mb-4">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Ваш email"
                  className="bg-gray-800 border border-gray-700 px-3 py-2 rounded-l-md text-white focus:outline-none focus:ring-1 focus:ring-red-600 w-full"
                />
                <button
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded-r-md hover:bg-red-700 transition-colors"
                >
                  OK
                </button>
              </div>
            </form>
            
            {/* Social media */}
            <div className="flex space-x-3">
              {socialMedia.instagram && (
                <a
                  href={socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 p-2 rounded-full text-gray-400 hover:text-white hover:bg-red-600 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                </a>
              )}
              {socialMedia.facebook && (
                <a
                  href={socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 p-2 rounded-full text-gray-400 hover:text-white hover:bg-blue-600 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={18} />
                </a>
              )}
              {socialMedia.twitter && (
                <a
                  href={socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 p-2 rounded-full text-gray-400 hover:text-white hover:bg-blue-400 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter size={18} />
                </a>
              )}
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {year} {name}. Все права защищены.
          </p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            <Link to="/privacy" className="text-gray-500 text-sm hover:text-white transition-colors">
              Политика конфиденциальности
            </Link>
            <Link to="/terms" className="text-gray-500 text-sm hover:text-white transition-colors">
              Пользовательское соглашение
            </Link>
            <Link to="/sitemap" className="text-gray-500 text-sm hover:text-white transition-colors">
              Карта сайта
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;