import React, { useState, useEffect } from 'react';
import BeforeAfterSlider from '../components/gallery/BeforeAfterSlider';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useNotification } from '../hooks/useNotification';
import api from '../config/api';

const GalleryPage = () => {
  const [loading, setLoading] = useState(true);
  const [galleryItems, setGalleryItems] = useState([]);
  const { error } = useNotification();
  
  useEffect(() => {
    const loadGalleryData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/gallery');
        setGalleryItems(response.data);
      } catch (err) {
        console.error('Error loading gallery:', err);
        error('Не удалось загрузить галерею');
        setGalleryItems([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadGalleryData();
  }, [error]);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (galleryItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
          Галерея наших работ
        </h1>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center">
          <p className="text-gray-400">В галерее пока нет работ</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
        Галерея наших работ
      </h1>
      
      <div className="space-y-12">
        {galleryItems.map(item => (
          <div key={item.id} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-2">{item.title}</h2>
              <p className="text-gray-400 mb-4">{item.description}</p>
              
              <BeforeAfterSlider
                beforeImage={item.beforeImage}
                afterImage={item.afterImage}
                beforeAlt="До"
                afterAlt="После"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryPage;