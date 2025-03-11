import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ServicesProvider } from './contexts/ServicesContext';
import { BookingProvider } from './contexts/BookingContext';
import { CarsProvider } from './contexts/CarsContext';
import { CompanyProvider } from './contexts/CompanyContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Notification from './components/common/Notification';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  const [loading, setLoading] = useState(true);

  // Initialize app
  useEffect(() => {
    // Simulate initialization delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingSpinner fullscreen />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <ThemeProvider>
          <CompanyProvider>
            <AuthProvider>
              <NotificationProvider>
                <ServicesProvider>
                  <CarsProvider>
                    <BookingProvider>
                      <Notification />
                      <AppRoutes />
                    </BookingProvider>
                  </CarsProvider>
                </ServicesProvider>
              </NotificationProvider>
            </AuthProvider>
          </CompanyProvider>
        </ThemeProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;