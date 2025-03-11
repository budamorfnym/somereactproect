import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../common/Header';
import MobileNavigation from '../common/MobileNavigation';
import Footer from '../common/Footer';
import SuccessMessage from '../common/SuccessMessage';
import Notification from '../common/Notification';

const Layout = ({ 
  children, 
  activeTab, 
  user, 
  companyInfo, 
  successMessage, 
  showSuccessMessage, 
  setShowSuccessMessage 
}) => {
  const location = useLocation();
  
  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Success Message Notification */}
      {showSuccessMessage && (
        <SuccessMessage 
          message={successMessage} 
          onClose={() => setShowSuccessMessage(false)} 
        />
      )}

      {/* Header */}
      <Header 
        activeTab={activeTab} 
        user={user} 
        companyInfo={companyInfo} 
      />

      {/* Main content */}
      <main className="flex-grow pb-20 md:pb-0">
        {children}
      </main>

      {/* Footer */}
      <Footer companyInfo={companyInfo} />

      {/* Mobile Navigation */}
      <MobileNavigation activeTab={activeTab} />
    </div>
  );
};

export default Layout;