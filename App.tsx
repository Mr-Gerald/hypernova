
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import BookingPage from './pages/BookingPage';
import TrackingPage from './pages/TrackingPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminShipmentsPage from './pages/admin/AdminShipmentsPage';
import AdminUpdateShipmentPage from './pages/admin/AdminUpdateShipmentPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/track" element={<TrackingPage />} />
            
            <Route path="/book" element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            } />

            <Route path="/admin/dashboard" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/admin/shipments" element={
              <AdminRoute>
                <AdminShipmentsPage />
              </AdminRoute>
            } />
            <Route path="/admin/shipments/update/:trackingNumber" element={
              <AdminRoute>
                <AdminUpdateShipmentPage />
              </AdminRoute>
            } />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
