// src/pages/GallaryPage.jsx
import React, { useState, useEffect } from 'react';
import BeforeAfterSlider from '../components/gallery/BeforeAfterSlider';
import LoadingSpinner from '../components/common/LoadingSpinner';

const GalleryPage = () => {
  const [loading, setLoading] = useState(true);
  const [galleryItems, setGalleryItems] = useState([]);
  
  useEffect(() => {
    // Имитация загрузки данных из API
    const loadGalleryData = async () => {
      setLoading(true);
      try {
        // В реальном приложении здесь был бы API-запрос
        // Временно используем моковые данные
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setGalleryItems([
          {
            id: 1,
            title: 'Полировка кузова',
            description: 'Полное восстановление внешнего вида автомобиля',
            beforeImage: 'https://via.placeholder.com/800x600?text=До+полировки',
            afterImage: 'https://via.placeholder.com/800x600?text=После+полировки',
            category: 'polish'
          },
          {
            id: 2,
            title: 'Химчистка салона',
            description: 'Глубокая чистка интерьера автомобиля',
            beforeImage: 'https://via.placeholder.com/800x600?text=До+химчистки',
            afterImage: 'https://via.placeholder.com/800x600?text=После+химчистки',
            category: 'cleaning'
          },
          {
            id: 3,
            title: 'Керамическое покрытие',
            description: 'Защита кузова от внешних воздействий',
            beforeImage: 'https://via.placeholder.com/800x600?text=До+покрытия',
            afterImage: 'https://via.placeholder.com/800x600?text=После+покрытия',
            category: 'coating'
          }
        ]);
      } catch (error) {
        console.error('Ошибка загрузки галереи:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadGalleryData();
  }, []);
  
  if (loading) {
    return <LoadingSpinner />;
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