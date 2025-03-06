// src/App.jsx (обновленный вариант с CarsProvider)
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ServicesProvider } from './contexts/ServicesContext';
import { BookingProvider } from './contexts/BookingContext';
import { CarsProvider } from './contexts/CarsContext';  // Добавлен импорт
import Notification from './components/common/Notification';
import LoadingSpinner from './components/common/LoadingSpinner';
import { getCompanyInfo } from './services/companyService';
import ErrorBoundary from './components/common/ErrorBoundary';

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
    <ErrorBoundary>
        <Router>
            <AuthProvider>
                <NotificationProvider>
                <ServicesProvider>
                    <CarsProvider>  {/* Добавлен CarsProvider */}
                    <BookingProvider>
                        <Notification />
                        <AppRoutes companyInfo={companyInfo} />
                    </BookingProvider>
                    </CarsProvider>
                </ServicesProvider>
                </NotificationProvider>
            </AuthProvider>
        </Router>
    </ErrorBoundary>        
  );
}

export default App;