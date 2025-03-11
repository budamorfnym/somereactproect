import React from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import HeroSection from './HeroSection';
import ServiceCategories from './ServiceCategories';
import QueuePreview from './QueuePreview';
import LoyaltyBanner from './LoyaltyBanner';
import TestimonialSection from './TestimonialSection';

const HomePage = () => {
  const { 
    categories, 
    setActiveServiceCategory, 
    queueData, 
    handleTabChange,
    reviews 
  } = useAppContext();

  return (
    <div className="space-y-12 py-8">
      {/* Hero section */}
      <HeroSection />

      {/* Service categories */}
      <ServiceCategories 
        categories={categories} 
        setActiveServiceCategory={setActiveServiceCategory} 
      />

      {/* Queue status */}
      <QueuePreview 
        queueData={queueData} 
        handleTabChange={handleTabChange} 
      />

      {/* Loyalty banner */}
      <LoyaltyBanner handleTabChange={handleTabChange} />

      {/* Testimonials */}
      <TestimonialSection reviews={reviews} />
    </div>
  );
};