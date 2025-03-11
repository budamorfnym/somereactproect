import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Layout
import Layout from '../components/layout/Layout';

// Public pages
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import ServicesPage from '../pages/ServicesPage';
import ContactPage from '../pages/ContactPage';
import GalleryPage from '../pages/GallaryPage';
import BookingPage from '../pages/BookingPage';
import BookingDetailsPage from '../pages/BookingDetailsPage';

// Protected pages
import ProfilePage from '../pages/ProfilePage';
import CarsPage from '../pages/CarsPage';
import CarFormPage from '../pages/CarFormPage';
import LoyaltyPage from '../pages/LoyaltyPage';

// Admin pages
import AdminPanel from '../components/admin/AdminPanel';

// Protected route component
import ProtectedRoute from '../components/auth/ProtectedRoute';

const AppRoutes = ({ companyInfo }) => {
    const { isAuthenticated, currentUser, loading } = useAuth();
    const [successMessage, setSuccessMessage] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
    // Функция для показа сообщения об успехе
    const showSuccess = (message) => {
      setSuccessMessage(message);
      setShowSuccessMessage(true);
      // Автоматически скрываем сообщение через 3 секунды
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    };
    
  if (loading) {
    return null;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={
        <Layout 
          companyInfo={companyInfo} 
          user={currentUser}
          successMessage={successMessage}
          showSuccessMessage={showSuccessMessage}
          setShowSuccessMessage={setShowSuccessMessage}
          activeTab="home"
        >
          <HomePage />
        </Layout>
      } />

      <Route path="/login" element={
        <Layout 
          companyInfo={companyInfo}
          activeTab="login"
        >
          <LoginPage />
        </Layout>
      } />

      <Route path="/register" element={
        <Layout 
          companyInfo={companyInfo}
          activeTab="register"
        >
          <RegisterPage />
        </Layout>
      } />

      <Route path="/forgot-password" element={
        <Layout 
          companyInfo={companyInfo}
          activeTab="login"
        >
          <ForgotPasswordPage />
        </Layout>
      } />

      <Route path="/reset-password/:token" element={
        <Layout 
          companyInfo={companyInfo}
          activeTab="login"
        >
          <ResetPasswordPage />
        </Layout>
      } />

      <Route path="/services" element={
        <Layout 
          companyInfo={companyInfo}
          activeTab="services"
        >
          <ServicesPage />
        </Layout>
      } />

      <Route path="/gallery" element={
        <Layout 
          companyInfo={companyInfo}
          activeTab="gallery"
        >
          <GalleryPage />
        </Layout>
      } />

      <Route path="/contact" element={
        <Layout 
          companyInfo={companyInfo}
          activeTab="contact"
        >
          <ContactPage />
        </Layout>
      } />
      
      {/* Protected routes for all authenticated users */}
      <Route path="/booking" element={
        <ProtectedRoute>
          <Layout 
            companyInfo={companyInfo}
            user={currentUser}
            activeTab="booking"
          >
            <BookingPage showSuccess={showSuccess} />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/booking/:id" element={
        <ProtectedRoute>
          <Layout 
            companyInfo={companyInfo}
            user={currentUser}
            activeTab="booking"
          >
            <BookingDetailsPage showSuccess={showSuccess} />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/profile/*" element={
        <ProtectedRoute>
          <Layout 
            companyInfo={companyInfo}
            user={currentUser}
            activeTab="profile"
          >
            <ProfilePage showSuccess={showSuccess} />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/cars" element={
        <ProtectedRoute>
          <Layout 
            companyInfo={companyInfo}
            user={currentUser}
            activeTab="cars"
          >
            <CarsPage showSuccess={showSuccess} />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/cars/add" element={
        <ProtectedRoute>
          <Layout 
            companyInfo={companyInfo}
            user={currentUser}
            activeTab="cars"
          >
            <CarFormPage showSuccess={showSuccess} />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/cars/:id/edit" element={
        <ProtectedRoute>
          <Layout 
            companyInfo={companyInfo}
            user={currentUser}
            activeTab="cars"
          >
            <CarFormPage showSuccess={showSuccess} />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/loyalty" element={
        <ProtectedRoute>
          <Layout 
            companyInfo={companyInfo}
            user={currentUser}
            activeTab="loyalty"
          >
            <LoyaltyPage showSuccess={showSuccess} />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Admin routes */}
      <Route path="/admin/*" element={
        <ProtectedRoute requiredRole="admin">
          <AdminPanel />
        </ProtectedRoute>
      } />
      
      {/* Catch-all route - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;