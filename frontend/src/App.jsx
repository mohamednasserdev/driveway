import { AnimatePresence } from 'framer-motion';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import CarDetailPage from './pages/CarDetailPage';
import BookingPage from './pages/BookingPage';
import MyBookingsPage from './pages/MyBookingsPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import VerifyOTPPage from './pages/VerifyOTPPage';

 
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              borderRadius: '10px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              fontSize: '0.9rem',
            },
          }}
        />
        <AnimatePresence mode="wait">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/cars/:id" element={<CarDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-otp" element={<VerifyOTPPage />} />

          {/* Protected user routes */}
          <Route
            path="/book/:carId"
            element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookingsPage />
              </ProtectedRoute>
            }
          />
 
          {/* Admin-only routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fleet"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard defaultTab="cars" />
              </ProtectedRoute>
            }
          />
 
          {/* 404 fallback */}
          <Route
            path="*"
            element={
              <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
                <p style={{ fontSize: '5rem', margin: 0 }}>🚗</p>
                <h1 style={{ fontSize: '2rem', color: '#1e293b' }}>404 — Page Not Found</h1>
                <a href="/" style={{ color: '#3b82f6', fontSize: '1rem' }}>← Go Home</a>
              </div>
            }
          />
        </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </AuthProvider>
  );
}
 
export default App;