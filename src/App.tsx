import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Send from './pages/Send';
import Receive from './pages/Receive';
import Transactions from './pages/Transactions';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  return currentUser ? <>{children}</> : <Navigate to="/login" />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  return !currentUser ? <>{children}</> : <Navigate to="/dashboard" />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={
        <PublicRoute><Login /></PublicRoute>
      } />
      <Route path="/signup" element={
        <PublicRoute><Signup /></PublicRoute>
      } />

      {/* Private routes */}
      <Route path="/dashboard" element={
        <PrivateRoute><Dashboard /></PrivateRoute>
      } />
      <Route path="/send" element={
        <PrivateRoute><Send /></PrivateRoute>
      } />
      <Route path="/receive" element={
        <PrivateRoute><Receive /></PrivateRoute>
      } />
      <Route path="/transactions" element={
        <PrivateRoute><Transactions /></PrivateRoute>
      } />
      <Route path="/notifications" element={
        <PrivateRoute><Notifications /></PrivateRoute>
      } />
      <Route path="/settings" element={
        <PrivateRoute><Settings /></PrivateRoute>
      } />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
