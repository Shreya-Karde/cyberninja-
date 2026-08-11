import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import QuizPage from './pages/QuizPage';
import LearnPage from './pages/LearnPage';
import ArticlePage from './pages/ArticlePage';
import SimulationPage from './pages/SimulationPage';
import PhishingDetectorPage from './pages/PhishingDetectorPage';
import LeaderboardPage from './pages/LeaderboardPage';
import AdminPage from './pages/AdminPage';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-cyber-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-cyber text-cyber-accent text-sm tracking-widest">INITIALIZING...</p>
      </div>
    </div>
  );
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  return user?.role === 'admin' ? children : <Navigate to="/dashboard" />;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="quiz" element={<QuizPage />} />
        <Route path="learn" element={<LearnPage />} />
        <Route path="learn/:id" element={<ArticlePage />} />
        <Route path="simulations" element={<SimulationPage />} />
        <Route path="phishing-detector" element={<PhishingDetectorPage />} />
        <Route path="leaderboard" element={<LeaderboardPage />} />
        <Route path="admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <Toaster position="top-right" toastOptions={{
            style: { background: '#0f1629', color: '#e2e8f0', border: '1px solid #1a2744' },
            success: { iconTheme: { primary: '#00f5d4', secondary: '#0a0e1a' } },
            error: { iconTheme: { primary: '#ff2d55', secondary: '#0a0e1a' } }
          }} />
          <AppRoutes />
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
