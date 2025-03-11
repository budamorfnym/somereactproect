import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const TestimonialSection = ({ reviews = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // If there are no reviews, don't render the section
  if (!reviews || reviews.length === 0) {
    return null;
  }
  
  // Function to handle navigation
  const goToNext = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const goToPrev = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };
  
  // Display up to 3 reviews at a time on larger screens, 1 on mobile
  const getVisibleReviews = () => {
    // This is a simple solution; in a real-world scenario, 
    // you might want to use a more sophisticated approach based on window size
    const itemsToShow = 3;
    
    const visibleReviews = [];
    for (let i = 0; i < itemsToShow; i++) {
      const index = (currentIndex + i) % reviews.length;
      visibleReviews.push(reviews[index]);
    }
    
    return visibleReviews;
  };
  
  // Render stars based on rating
  const renderRating = (rating) => {
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<Star key={i} size={18} className="text-yellow-500 fill-current" />);
      } else {
        stars.push(<Star key={i} size={18} className="text-gray-600" />);
      }
    }
    
    return <div className="flex space-x-1">{stars}</div>;
  };
  
  const visibleReviews = getVisibleReviews();
  
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Отзывы наших клиентов</h2>
          
          <div className="flex space-x-2">
            <button
              className="p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors duration-200"
              onClick={goToPrev}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors duration-200"
              onClick={goToNext}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleReviews.map((review, index) => (
            <div 
              key={`${review.id}-${index}`} 
              className="bg-gray-900 rounded-lg p-4 border border-gray-700"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-medium text-white">{review.author}</div>
                  <div className="text-gray-400 text-sm">{review.date}</div>
                </div>
                {renderRating(review.rating)}
              </div>
              
              <p className="text-gray-300">{review.text}</p>
              
              {review.service && (
                <div className="mt-3 text-sm text-gray-400">
                  Услуга: {review.service}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <button
            className="inline-flex items-center px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors duration-200"
            onClick={() => window.open('https://g.page/a1detailing/review', '_blank')}
          >
            Оставить отзыв
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;