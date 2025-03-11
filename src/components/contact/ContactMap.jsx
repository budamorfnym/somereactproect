import React from 'react';

const ContactMap = ({ coordinates }) => {
  const lat = coordinates?.lat || '42.8746';
  const lng = coordinates?.lng || '74.5698';
  const zoom = 14;
  
  // Create an embedded map URL
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${lat},${lng}&zoom=${zoom}`;
  
  return (
    <div className="rounded-lg overflow-hidden shadow-lg">
      <div className="w-full h-96 relative">
        {/* Fallback display in case iframe doesn't load or API key isn't set */}
        <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
          <div className="text-center p-4">
            <p className="text-white font-medium mb-1">
              A1Detailing
            </p>
            <p className="text-gray-300 mb-2">
              Ул. Байтик Баатыра, 98 / ул. Максима Горького, 27/1, Бишкек
            </p>
            <p className="text-gray-400 text-sm">
              Координаты: {lat}, {lng}
            </p>
          </div>
        </div>
        
        {/* Google Maps iframe - will overlay the fallback if it loads successfully */}
        <iframe
          title="A1Detailing на карте"
          width="100%"
          height="100%"
          style={{ border: 0, position: 'relative', zIndex: 1 }}
          loading="lazy"
          allowFullScreen
          src={mapUrl}
        ></iframe>
      </div>
      
      <div className="p-4 bg-gray-800">
        <h3 className="font-medium text-white mb-2">A1Detailing</h3>
        <p className="text-gray-300 mb-1">Ул. Байтик Баатыра, 98 / ул. Максима Горького, 27/1, Бишкек</p>
        <p className="text-gray-400 mb-3 text-sm">График работы: Пн-Сб: 9:00 - 19:00, Вс: 10:00 - 17:00</p>
        
        <div className="flex space-x-2">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700 transition-colors duration-200"
          >
            Построить маршрут
          </a>
          <a
            href={`tel:+996550000000`}
            className="bg-gray-700 text-white px-3 py-1.5 rounded text-sm hover:bg-gray-600 transition-colors duration-200"
          >
            Позвонить
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactMap;