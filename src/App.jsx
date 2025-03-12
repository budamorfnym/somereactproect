// src/App.jsx - оптимизированная версия
import React, { useEffect, useState, Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { DataProvider } from './contexts/DataContext'; // Новый объединенный контекст
import Notification from './components/common/Notification';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';
import api from './config/api';

function App() {
  const [companyInfo, setCompanyInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial company information
  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        setLoading(true);
        const response = await api.get('/company');
        setCompanyInfo(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching company information:', error);
        setError('Failed to load essential application data. Please try refreshing the page.');
        
        // Set minimal default data if API fails
        setCompanyInfo({
          name: 'A1Detailing',
          address: 'ул. Байтик Баатыра, 98, Бишкек',
          phone: '+996 550 000 000',
          email: 'info@a1detailing.kg'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyInfo();
  }, []);

  if (loading) {
    return <LoadingSpinner fullscreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md text-center">
          <h1 className="text-xl font-bold text-white mb-2">Ошибка загрузки</h1>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Обновить страницу
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <NotificationProvider>
            <DataProvider companyInfo={companyInfo}>
              {/* Notification component for displaying toast messages */}
              <Notification />
              
              {/* Main application routes */}
              <Suspense fallback={<LoadingSpinner fullscreen />}>
                <AppRoutes companyInfo={companyInfo} />
              </Suspense>
            </DataProvider>
          </NotificationProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;