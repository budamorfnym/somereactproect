import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Layout
import Layout from '../components/layout/Layout';

// Public pages
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
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

  if (loading) {
    return null;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Layout companyInfo={companyInfo}><HomePage /></Layout>} />
      <Route path="/login" element={<Layout companyInfo={companyInfo}><LoginPage /></Layout>} />
      <Route path="/register" element={<Layout companyInfo={companyInfo}><RegisterPage /></Layout>} />
      <Route path="/services" element={<Layout companyInfo={companyInfo}><ServicesPage /></Layout>} />
      <Route path="/gallery" element={<Layout companyInfo={companyInfo}><GalleryPage /></Layout>} />
      <Route path="/contact" element={<Layout companyInfo={companyInfo}><ContactPage /></Layout>} />
      
      {/* Protected routes for all authenticated users */}
      <Route path="/booking" element={
        <ProtectedRoute>
          <Layout companyInfo={companyInfo}><BookingPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/booking/:id" element={
        <ProtectedRoute>
          <Layout companyInfo={companyInfo}><BookingDetailsPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/profile/*" element={
        <ProtectedRoute>
          <Layout companyInfo={companyInfo}><ProfilePage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/cars" element={
        <ProtectedRoute>
          <Layout companyInfo={companyInfo}><CarsPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/cars/add" element={
        <ProtectedRoute>
          <Layout companyInfo={companyInfo}><CarFormPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/cars/:id/edit" element={
        <ProtectedRoute>
          <Layout companyInfo={companyInfo}><CarFormPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/loyalty" element={
        <ProtectedRoute>
          <Layout companyInfo={companyInfo}><LoyaltyPage /></Layout>
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