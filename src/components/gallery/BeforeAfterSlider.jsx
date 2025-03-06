import React, { useState, useRef, useEffect } from 'react';

const BeforeAfterSlider = ({ beforeImage, afterImage, beforeAlt, afterAlt }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const mouseX = e.clientX - containerRect.left;
    
    // Расчет позиции слайдера в процентах
    let newPosition = (mouseX / containerWidth) * 100;
    
    // Ограничение значения в пределах от 0 до 100
    newPosition = Math.max(0, Math.min(100, newPosition));
    
    setSliderPosition(newPosition);
  };

  const handleTouchMove = (e) => {
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const touch = e.touches[0];
    const touchX = touch.clientX - containerRect.left;
    
    // Расчет позиции слайдера в процентах
    let newPosition = (touchX / containerWidth) * 100;
    
    // Ограничение значения в пределах от 0 до 100
    newPosition = Math.max(0, Math.min(100, newPosition));
    
    setSliderPosition(newPosition);
  };

  // Добавление глобальных обработчиков событий
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div 
      ref={containerRef}
      className="relative overflow-hidden rounded-lg cursor-col-resize h-80"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Before image (полный размер) */}
      <div className="absolute inset-0">
        <img
          src={beforeImage}
          alt={beforeAlt || "Before"}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* After image (обрезается в зависимости от положения слайдера) */}
      <div 
        className="absolute inset-0 overflow-hidden" 
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={afterImage}
          alt={afterAlt || "After"}
          className="absolute top-0 left-0 w-full h-full object-cover"
          style={{ 
            width: `${100 / (sliderPosition / 100)}%`,
            minWidth: '100%'
          }}
        />
      </div>
      
      {/* Ползунок */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-red-600 cursor-col-resize z-10"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
          <div className="flex space-x-0.5">
            <div className="w-0.5 h-4 bg-white"></div>
            <div className="w-0.5 h-4 bg-white"></div>
          </div>
        </div>
      </div>
      
      {/* Подписи */}
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
        До
      </div>
      <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
        После
      </div>
    </div>
  );
};

export default BeforeAfterSlider;