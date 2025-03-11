import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useServices } from '../hooks/useServices';
import { useAuth } from '../hooks/useAuth';
import ServiceCard from '../components/common/ServiceCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Filter, Search } from 'lucide-react';

const ServicesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { 
    services, 
    categories, 
    activeCategory, 
    setCategory,
    getServicesByCategory,
    loading 
  } = useServices();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredServices, setFilteredServices] = useState([]);
  
  // Extract search term from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    if (search) {
      setSearchTerm(search);
    }
    
    // Check if we have a category from state (clicked from homepage)
    if (location.state?.category) {
      setCategory(location.state.category);
    }
  }, [location.search, location.state, setCategory]);
  
  // Filter services by category and search term
  useEffect(() => {
    const categoryServices = getServicesByCategory(activeCategory);
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      setFilteredServices(
        categoryServices.filter(service => 
          service.name.toLowerCase().includes(term) || 
          service.description.toLowerCase().includes(term)
        )
      );
    } else {
      setFilteredServices(categoryServices);
    }
  }, [services, activeCategory, searchTerm, getServicesByCategory]);
  
  // Handle service booking
  const handleBookNow = (service) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }
    
    navigate('/booking', { state: { selectedService: service } });
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
        Услуги
      </h1>
      
      {/* Search and filter */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg block w-full pl-10 p-2.5"
              placeholder="Поиск услуг..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center">
            <Filter size={18} className="text-gray-400 mr-2" />
            <span className="text-gray-400 mr-2">Категория:</span>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`px-3 py-1 rounded-full text-sm ${
                    activeCategory === category.id
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  onClick={() => setCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Services grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              onBookNow={handleBookNow}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center">
          <p className="text-gray-400 mb-4">
            {searchTerm 
              ? `По запросу "${searchTerm}" ничего не найдено`
              : 'В данной категории пока нет услуг'}
          </p>
          {searchTerm && (
            <button
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-200"
              onClick={() => setSearchTerm('')}
            >
              Сбросить поиск
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ServicesPage;