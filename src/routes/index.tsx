import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import { LoginPage } from '../pages/LoginPage'
import NewDashboardPage from '../pages/NewDashboardPage'

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route path="/*" element={<NewDashboardPage />} />
    </Routes>
  );
}

export function AppRouter() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
