import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useServices } from '../../hooks/useServices';

const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const inputRef = useRef(null);
  const searchContainerRef = useRef(null);
  
  const { services } = useServices();
  const navigate = useNavigate();
  
  // Focus input when search is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  
  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Perform search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    
    // Search in services
    const serviceResults = services
      .filter(service => 
        service.name.toLowerCase().includes(term) || 
        service.description.toLowerCase().includes(term)
      )
      .slice(0, 3)
      .map(service => ({
        id: `service-${service.id}`,
        title: service.name,
        type: 'service',
        url: `/services?search=${encodeURIComponent(searchTerm)}`,
        image: service.imageUrl
      }));
    
    // Add pages (these would be from a real search API in a production app)
    const pageResults = [
      { id: 'page-1', title: 'Контакты', type: 'page', url: '/contact' },
      { id: 'page-2', title: 'О компании', type: 'page', url: '/about' },
      { id: 'page-3', title: 'Галерея работ', type: 'page', url: '/gallery' }
    ].filter(page => page.title.toLowerCase().includes(term)).slice(0, 2);
    
    setSearchResults([...serviceResults, ...pageResults]);
  }, [searchTerm, services]);
  
  // Handle search submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchTerm)}`);
      setIsOpen(false);
      setSearchTerm('');
    }
  };
  
  // Handle result click
  const handleResultClick = (result) => {
    navigate(result.url);
    setIsOpen(false);
    setSearchTerm('');
  };
  
  // Toggle search popup
  const toggleSearch = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm('');
      setSearchResults([]);
    }
  };
  
  return (
    <div className="relative" ref={searchContainerRef}>
      {/* Search button */}
      <button
        onClick={toggleSearch}
        className="text-gray-400 hover:text-white p-2 rounded-full transition-colors duration-200"
        aria-label="Search"
      >
        <Search size={20} />
      </button>
      
      {/* Search overlay */}
      {isOpen && (
        <div className="fixed inset-0 md:relative md:inset-auto z-50">
          {/* Dark overlay on mobile */}
          <div className="fixed inset-0 bg-black bg-opacity-70 md:hidden" onClick={() => setIsOpen(false)}></div>
          
          {/* Search modal */}
          <div className="fixed top-0 left-0 right-0 md:absolute md:top-full md:right-0 mt-2 bg-gray-800 rounded-lg shadow-xl p-4 md:w-96 border border-gray-700 z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-medium">Поиск</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Найти услуги, информацию..."
                  className="w-full px-4 py-2 bg-gray-900 text-white border border-gray-700 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <Search size={18} />
                </button>
              </div>
            </form>
            
            {/* Search results */}
            {searchResults.length > 0 && (
              <div className="mt-4 space-y-2 max-h-80 overflow-y-auto">
                {searchResults.map(result => (
                  <div
                    key={result.id}
                    className="flex items-center p-2 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                    onClick={() => handleResultClick(result)}
                  >
                    {result.image ? (
                      <div className="w-10 h-10 bg-gray-700 rounded-md mr-3 overflow-hidden">
                        <img src={result.image} alt={result.title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-gray-700 rounded-md mr-3 flex items-center justify-center">
                        <span className="text-gray-400">
                          {result.type === 'service' ? '🔧' : '📄'}
                        </span>
                      </div>
                    )}
                    <div>
                      <div className="text-white">{result.title}</div>
                      <div className="text-xs text-gray-400">
                        {result.type === 'service' ? 'Услуга' : 'Страница'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Quick links */}
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="text-sm text-gray-400 mb-2">Быстрые ссылки</div>
              <div className="flex flex-wrap gap-2">
                <button
                  className="px-3 py-1 bg-gray-700 text-white text-sm rounded-full hover:bg-gray-600"
                  onClick={() => navigate('/services')}
                >
                  Все услуги
                </button>
                <button
                  className="px-3 py-1 bg-gray-700 text-white text-sm rounded-full hover:bg-gray-600"
                  onClick={() => navigate('/contact')}
                >
                  Контакты
                </button>
                <button
                  className="px-3 py-1 bg-gray-700 text-white text-sm rounded-full hover:bg-gray-600"
                  onClick={() => navigate('/gallery')}
                >
                  Галерея
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;