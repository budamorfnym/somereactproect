import { useState, useEffect, useRef } from 'react';

/**
 * A hook that uses the Intersection Observer API to detect when an element enters the viewport
 * 
 * @param {Object} options Intersection Observer options
 * @param {boolean} triggerOnce Whether to trigger the intersection observer only once
 * @returns {Array} An array containing the ref and isIntersecting flag
 */
const useIntersectionObserver = (options = {}, triggerOnce = false) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef(null);
  const observer = useRef(null);
  
  // Default options for Intersection Observer
  const defaultOptions = {
    root: null, // viewport
    rootMargin: '0px',
    threshold: 0.1, // 10% of the element is visible
    ...options
  };
  
  useEffect(() => {
    // Skip if we've already triggered once and triggerOnce is true
    if (triggerOnce && hasTriggered) {
      return;
    }
    
    // Clean up any existing observer
    if (observer.current) {
      observer.current.disconnect();
    }
    
    // Create a new observer
    observer.current = new IntersectionObserver(([entry]) => {
      // Update state based on whether element is in view
      setIsIntersecting(entry.isIntersecting);
      
      // If the element is intersecting and we are only triggering once, 
      // set has triggered to true
      if (entry.isIntersecting && triggerOnce) {
        setHasTriggered(true);
        
        // Disconnect the observer since we don't need it anymore
        observer.current.disconnect();
      }
    }, defaultOptions);
    
    // Get the current element
    const currentElement = elementRef.current;
    
    // Start observing the element
    if (currentElement) {
      observer.current.observe(currentElement);
    }
    
    // Clean up observer on unmount
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [defaultOptions, triggerOnce, hasTriggered]);
  
  return [elementRef, isIntersecting, hasTriggered];
};

export default useIntersectionObserver;