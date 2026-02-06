import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ToastProvider from './components/ui/Toast';
import PageTransition from './components/animations/PageTransition';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Send from './pages/Send';
import Receive from './pages/Receive';
import Transactions from './pages/Transactions';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Connections from './pages/Connections';

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
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider />
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
