// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ServicesProvider } from './contexts/ServicesContext';
import { BookingProvider } from './contexts/BookingContext';
import { CarsProvider } from './contexts/CarsContext';
import { LoyaltyProvider } from './contexts/LoyaltyContext';
import { CompanyProvider } from './contexts/CompanyContext';
import Notification from './components/common/Notification';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';
import { getCompanyInfo } from './services/companyService';

function App() {
  const [companyInfo, setCompanyInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const info = await getCompanyInfo();
        setCompanyInfo(info);
      } catch (error) {
        console.error('Error fetching company info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyInfo();
  }, []);

  if (loading) {
    return <LoadingSpinner fullscreen />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <CompanyProvider>
          <AuthProvider>
            <NotificationProvider>
              <ServicesProvider>
                <CarsProvider>
                  <BookingProvider>
                    <LoyaltyProvider>
                      <Notification />
                      <AppRoutes companyInfo={companyInfo} />
                    </LoyaltyProvider>
                  </BookingProvider>
                </CarsProvider>
              </ServicesProvider>
            </NotificationProvider>
          </AuthProvider>
        </CompanyProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;