import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import AdminRouteWrapper from './components/admin/AdminRouteWrapper.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute.jsx';

// Public Pages
import HomePage from './pages/HomePage.jsx';
import AstrologyPage from './pages/AstrologyPage.jsx';
import MeditationPage from './pages/MeditationPage.jsx';
import ReikiPage from './pages/ReikiPage.jsx';
import TarotPage from './pages/TarotPage.jsx';
import BlogPage from './pages/BlogPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import BookingPage from './pages/BookingPage.jsx';
import ConsultationsPage from './pages/ConsultationsPage.jsx';
import AwardsPage from './pages/AwardsPage.jsx';
import CertificatesPage from './pages/CertificatesPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';

// Protected Pages
import DashboardPage from './pages/DashboardPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import BookingsPage from './pages/BookingsPage.jsx';
import AppointmentsPage from './pages/AppointmentsPage.jsx';
import AccountSettingsPage from './pages/AccountSettingsPage.jsx';

import ConfirmVerificationPage from './pages/ConfirmVerificationPage.jsx';

import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";


// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminBookingsPage from './pages/admin/AdminBookingsPage.jsx';
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage.jsx';
import AdminCustomersPage from './pages/admin/AdminCustomersPage.jsx';
import AdminAvailabilityPage from './pages/admin/AdminAvailabilityPage.jsx';
import AdminPricingPage from './pages/admin/AdminPricingPage.jsx';
import AdminCalendarPage from './pages/admin/AdminCalendarPage.jsx';
import AdminSettingsPage from './pages/admin/AdminSettingsPage.jsx';
import { AdminAuthProvider }
from './contexts/AdminAuthContext.jsx';

function App() {
  return (
    <AuthProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/awards" element={<AwardsPage />} />
            <Route path="/certificates" element={<CertificatesPage />} />
            <Route path="/astrology" element={<AstrologyPage />} />
            <Route path="/meditation" element={<MeditationPage />} />
            <Route path="/reiki" element={<ReikiPage />} />
            <Route path="/tarot" element={<TarotPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/consultations" element={<ConsultationsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />


            {/* Protected User Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/bookings" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
            <Route path="/appointments" element={<ProtectedRoute><AppointmentsPage /></ProtectedRoute>} />
            <Route path="/account-settings" element={<ProtectedRoute><AccountSettingsPage /></ProtectedRoute>} />
            <Route
            path="/auth/confirm-verification/:token"
            element={<ConfirmVerificationPage />}
            />
            
            {/* Admin Login */}
            <Route
                path="/admin/login"
                element={
                    <AdminAuthProvider>
                        <AdminLoginPage />
                    </AdminAuthProvider>
                }
            />

            {/* Protected Admin Area */}
            <Route element={<AdminRouteWrapper />}>

                <Route
                    path="/admin"
                    element={<AdminDashboard />}
                />

                {/* <Route
                    path="/admin/dashboard"
                    element={<AdminDashboard />}
                /> */}

                <Route
                    path="/admin/bookings"
                    element={<AdminBookingsPage />}
                />

                {/* <Route
                    path="/admin/payments"
                    element={<AdminPaymentsPage />}
                /> */}

                <Route
                    path="/admin/customers"
                    element={<AdminCustomersPage />}
                />

                <Route
                    path="/admin/availability"
                    element={<AdminAvailabilityPage />}
                />

                {/* <Route
                    path="/admin/pricing"
                    element={<AdminPricingPage />}
                /> */}

                {/* <Route
                    path="/admin/calendar"
                    element={<AdminCalendarPage />}
                /> */}

                <Route
                    path="/admin/settings"
                    element={<AdminSettingsPage />}
                />

            </Route>
          </Routes>
        </Router>
    </AuthProvider>
  );
}

export default App;