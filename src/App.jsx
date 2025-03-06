import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ServicesProvider } from './contexts/ServicesContext';
import { BookingProvider } from './contexts/BookingContext';
import Notification from './components/common/Notification';
import LoadingSpinner from './components/common/LoadingSpinner';
import { getCompanyInfo } from './services/companyService';

function App() {
  const [loading, setLoading] = useState(true);
  const [companyInfo, setCompanyInfo] = useState(null);

  // Load company info on app initialization
  useEffect(() => {
    const initialize = async () => {
      try {
        // Load company info
        const info = await getCompanyInfo();
        setCompanyInfo(info);
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  if (loading) {
    return <LoadingSpinner fullscreen />;
  }

  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <ServicesProvider>
            <BookingProvider>
              <Notification />
              <AppRoutes companyInfo={companyInfo} />
            </BookingProvider>
          </ServicesProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;