import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * BeforeAfterSlider component for comparing before/after images
 * 
 * @param {Object} props Component props
 * @param {string} props.beforeImage URL of the "before" image
 * @param {string} props.afterImage URL of the "after" image
 * @param {string} props.beforeAlt Alt text for "before" image
 * @param {string} props.afterAlt Alt text for "after" image
 * @param {number} props.initialPosition Initial slider position (0-100)
 * @param {string} props.className Additional CSS classes for the container
 */
const BeforeAfterSlider = ({ 
  beforeImage, 
  afterImage, 
  beforeAlt = "Before", 
  afterAlt = "After",
  initialPosition = 50,
  className = ""
}) => {
  const [sliderPosition, setSliderPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [imageError, setImageError] = useState({ before: false, after: false });
  
  const containerRef = useRef(null);

  // Event handler for starting drag operation
  const handleDragStart = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  // Event handler for ending drag operation
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Event handler for mouse movement during drag
  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const mouseX = e.clientX - containerRect.left;
    
    updateSliderPosition(mouseX, containerWidth);
  }, [isDragging]);

  // Event handler for touch movement
  const handleTouchMove = useCallback((e) => {
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const touch = e.touches[0];
    const touchX = touch.clientX - containerRect.left;
    
    updateSliderPosition(touchX, containerWidth);
  }, []);

  // Helper function to update slider position with bounds checking
  const updateSliderPosition = (positionX, containerWidth) => {
    let newPosition = (positionX / containerWidth) * 100;
    
    // Enforce boundaries (0-100%)
    newPosition = Math.max(0, Math.min(100, newPosition));
    
    setSliderPosition(newPosition);
  };

  // Set up event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('mouseleave', handleDragEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleDragEnd);
        document.removeEventListener('mouseleave', handleDragEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleDragEnd]);

  // Handle image loading errors
  const handleImageError = (image) => {
    setImageError(prev => ({ ...prev, [image]: true }));
  };

  // Determine content to display based on image loading status
  const renderContent = () => {
    // If both images fail to load, show error message
    if (imageError.before && imageError.after) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <p className="text-gray-400">Не удалось загрузить изображения</p>
        </div>
      );
    }

    return (
      <>
        {/* Before image (full-size background) */}
        <div className="absolute inset-0">
          <img
            src={beforeImage}
            alt={beforeAlt}
            className="w-full h-full object-cover"
            onError={() => handleImageError('before')}
          />
        </div>
        
        {/* After image (cropped based on slider position) */}
        <div 
          className="absolute inset-0 overflow-hidden" 
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={afterImage}
            alt={afterAlt}
            className="absolute top-0 left-0 w-full h-full object-cover"
            style={{ 
              width: `${100 / (sliderPosition / 100)}%`,
              minWidth: '100%'
            }}
            onError={() => handleImageError('after')}
          />
        </div>
        
        {/* Vertical slider line */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-red-600 cursor-col-resize z-10"
          style={{ left: `${sliderPosition}%` }}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        >
          {/* Slider handle (circle) */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
            <div className="flex space-x-0.5">
              <div className="w-0.5 h-4 bg-white"></div>
              <div className="w-0.5 h-4 bg-white"></div>
            </div>
          </div>
        </div>
        
        {/* Labels */}
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
          До
        </div>
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
          После
        </div>
      </>
    );
  };

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden rounded-lg cursor-col-resize h-80 ${className}`}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      {renderContent()}
    </div>
  );
};

BeforeAfterSlider.propTypes = {
  beforeImage: PropTypes.string.isRequired,
  afterImage: PropTypes.string.isRequired,
  beforeAlt: PropTypes.string,
  afterAlt: PropTypes.string,
  initialPosition: PropTypes.number,
  className: PropTypes.string
};

export default React.memo(BeforeAfterSlider);