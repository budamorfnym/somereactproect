import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServices } from '../hooks/useServices';
import { useCompany } from '../hooks/useCompany';
import HeroSection from '../components/client/home/HeroSection';
import ServiceCategories from '../components/client/home/ServiceCategories';
import QueuePreview from '../components/client/home/QueuePreview';
import LoyaltyBanner from '../components/client/home/LoyaltyBanner';
import TestimonialSection from '../components/client/home/TestimonialSection';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getQueueStatus, getCompanyReviews } from '../services/companyService';

const HomePage = () => {
  const navigate = useNavigate();
  const { categories, setCategory } = useServices();
  const { companyInfo, loading: companyLoading } = useCompany();
  
  const [queueData, setQueueData] = useState({ currentWashing: [], waiting: [] });
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load queue status and reviews
  useEffect(() => {
    const loadPageData = async () => {
      try {
        setLoading(true);
        
        // Load queue data and reviews in parallel
        const [queueData, reviewsData] = await Promise.all([
          getQueueStatus(),
          getCompanyReviews()
        ]);
        
        setQueueData(queueData);
        setReviews(reviewsData);
      } catch (err) {
        console.error('Error loading home page data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadPageData();
  }, []);

  // Handle category selection
  const handleSelectCategory = (categoryId) => {
    setCategory(categoryId);
    navigate('/services');
  };

  // Handle tab change
  const handleTabChange = (tabName) => {
    navigate(`/${tabName}`);
  };

  if (loading || companyLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-12 py-8">
      {/* Hero section */}
      <HeroSection />

      {/* Service categories */}
      <ServiceCategories 
        categories={categories} 
        setActiveServiceCategory={handleSelectCategory} 
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

export default HomePage;