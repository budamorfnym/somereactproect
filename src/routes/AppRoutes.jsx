import React, { useState, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Layout
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Public pages - eagerly loaded
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import ServicesPage from '../pages/ServicesPage';
import ContactPage from '../pages/ContactPage';

// Lazily loaded pages for better performance
const GalleryPage = lazy(() => import('../pages/GalleryPage'));
const BookingPage = lazy(() => import('../pages/BookingPage'));
const BookingDetailsPage = lazy(() => import('../pages/BookingDetailsPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const CarsPage = lazy(() => import('../pages/CarsPage'));
const CarFormPage = lazy(() => import('../pages/CarFormPage'));
const LoyaltyPage = lazy(() => import('../pages/LoyaltyPage'));
const AdminPanel = lazy(() => import('../components/admin/AdminPanel'));

// Protected route component
import ProtectedRoute from '../components/auth/ProtectedRoute';

/**
 * Main application routes component
 */
const AppRoutes = ({ companyInfo }) => {
  const { isAuthenticated, currentUser, loading } = useAuth();
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // Helper function to show success message
  const showSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccessMessage(true);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };
  
  // Common layout props
  const layoutProps = {
    companyInfo,
    user: currentUser,
    successMessage,
    showSuccessMessage,
    setShowSuccessMessage
  };
  
  // Loading state while checking authentication
  if (loading) {
    return <LoadingSpinner fullscreen />;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/" 
        element={
          <Layout {...layoutProps} activeTab="home">
            <HomePage />
          </Layout>
        } 
      />

      <Route 
        path="/login" 
        element={
          <Layout {...layoutProps} activeTab="login">
            <LoginPage />
          </Layout>
        } 
      />

      <Route 
        path="/register" 
        element={
          <Layout {...layoutProps} activeTab="register">
            <RegisterPage />
          </Layout>
        } 
      />

      <Route 
        path="/forgot-password" 
        element={
          <Layout {...layoutProps} activeTab="login">
            <ForgotPasswordPage />
          </Layout>
        } 
      />

      <Route 
        path="/reset-password/:token" 
        element={
          <Layout {...layoutProps} activeTab="login">
            <ResetPasswordPage />
          </Layout>
        } 
      />

      <Route 
        path="/services" 
        element={
          <Layout {...layoutProps} activeTab="services">
            <ServicesPage />
          </Layout>
        } 
      />

      <Route 
        path="/gallery" 
        element={
          <Layout {...layoutProps} activeTab="gallery">
            <Suspense fallback={<LoadingSpinner fullscreen />}>
              <GalleryPage />
            </Suspense>
          </Layout>
        } 
      />

      <Route 
        path="/contact" 
        element={
          <Layout {...layoutProps} activeTab="contact">
            <ContactPage />
          </Layout>
        } 
      />
      
      {/* Protected booking routes */}
      <Route 
        path="/booking" 
        element={
          <ProtectedRoute>
            <Layout {...layoutProps} activeTab="booking">
              <Suspense fallback={<LoadingSpinner fullscreen />}>
                <BookingPage showSuccess={showSuccess} />
              </Suspense>
            </Layout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/booking/:id" 
        element={
          <ProtectedRoute>
            <Layout {...layoutProps} activeTab="booking">
              <Suspense fallback={<LoadingSpinner fullscreen />}>
                <BookingDetailsPage showSuccess={showSuccess} />
              </Suspense>
            </Layout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/profile/*" 
        element={
          <ProtectedRoute>
            <Layout {...layoutProps} activeTab="profile">
              <Suspense fallback={<LoadingSpinner fullscreen />}>
                <ProfilePage showSuccess={showSuccess} />
              </Suspense>
            </Layout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/cars" 
        element={
          <ProtectedRoute>
            <Layout {...layoutProps} activeTab="cars">
              <Suspense fallback={<LoadingSpinner fullscreen />}>
                <CarsPage showSuccess={showSuccess} />
              </Suspense>
            </Layout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/cars/add" 
        element={
          <ProtectedRoute>
            <Layout {...layoutProps} activeTab="cars">
              <Suspense fallback={<LoadingSpinner fullscreen />}>
                <CarFormPage showSuccess={showSuccess} />
              </Suspense>
            </Layout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/cars/:id/edit" 
        element={
          <ProtectedRoute>
            <Layout {...layoutProps} activeTab="cars">
              <Suspense fallback={<LoadingSpinner fullscreen />}>
                <CarFormPage showSuccess={showSuccess} />
              </Suspense>
            </Layout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/loyalty" 
        element={
          <ProtectedRoute>
            <Layout {...layoutProps} activeTab="loyalty">
              <Suspense fallback={<LoadingSpinner fullscreen />}>
                <LoyaltyPage showSuccess={showSuccess} />
              </Suspense>
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      {/* Admin routes with role check */}
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute requiredRole="admin">
            <Suspense fallback={<LoadingSpinner fullscreen />}>
              <AdminPanel />
            </Suspense>
          </ProtectedRoute>
        } 
      />
      
      {/* Catch-all route - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;