import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ToastProvider from './components/ui/Toast';
import PageTransition from './components/animations/PageTransition';
import ErrorBoundary from './components/common/ErrorBoundary';
import RouteFallback from './components/common/RouteFallback';

const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Send = lazy(() => import('./pages/Send'));
const Receive = lazy(() => import('./pages/Receive'));
const Transactions = lazy(() => import('./pages/Transactions'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Settings = lazy(() => import('./pages/Settings'));
const Connections = lazy(() => import('./pages/Connections'));

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  return currentUser ? <>{children}</> : <Navigate to="/login" />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  return !currentUser ? <>{children}</> : <Navigate to="/dashboard" />;
}

function AppRoutes() {
  const location = useLocation();

  return (
    <Suspense fallback={<RouteFallback />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public routes */}
          <Route path="/login" element={
            <PublicRoute>
              <PageTransition>
                <Login />
              </PageTransition>
            </PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute>
              <PageTransition>
                <Signup />
              </PageTransition>
            </PublicRoute>
          } />

          {/* Private routes */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <PageTransition>
                <Dashboard />
              </PageTransition>
            </PrivateRoute>
          } />
          <Route path="/send" element={
            <PrivateRoute>
              <PageTransition>
                <Send />
              </PageTransition>
            </PrivateRoute>
          } />
          <Route path="/receive" element={
            <PrivateRoute>
              <PageTransition>
                <Receive />
              </PageTransition>
            </PrivateRoute>
          } />
          <Route path="/connections" element={
            <PrivateRoute>
              <PageTransition>
                <Connections />
              </PageTransition>
            </PrivateRoute>
          } />
          <Route path="/transactions" element={
            <PrivateRoute>
              <PageTransition>
                <Transactions />
              </PageTransition>
            </PrivateRoute>
          } />
          <Route path="/notifications" element={
            <PrivateRoute>
              <PageTransition>
                <Notifications />
              </PageTransition>
            </PrivateRoute>
          } />
          <Route path="/settings" element={
            <PrivateRoute>
              <PageTransition>
                <Settings />
              </PageTransition>
            </PrivateRoute>
          } />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <ToastProvider />
          <AppRoutes />
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
