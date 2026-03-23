import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import PendingApprovalPage from './pages/PendingApprovalPage';
import ViewerPage from './pages/ViewerPage';
import AdminPage from './pages/AdminPage';

function PrivateRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <div style={{ color: '#888', padding: '2rem' }}>Loading...</div>;
  }

  if (!user) return <Navigate to="/login" />;
  if (user.role === 'pending') return <Navigate to="/pending" />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/viewer" />;

  return <>{children}</>;
}

function AppRoutes() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div style={{ background: '#141414', height: '100vh', color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={user && user.role !== 'pending' ? <Navigate to="/viewer" /> : <LoginPage />} />
      <Route path="/pending" element={<PendingApprovalPage />} />
      <Route path="/viewer" element={<PrivateRoute><ViewerPage /></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute allowedRoles={['admin']}><AdminPage /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/viewer" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
