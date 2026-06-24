import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import { LoginPage } from '../pages/LoginPage'
import NewDashboardPage from '../pages/NewDashboardPage'
import CommandCenterOverview from '../pages/CommandCenterOverview'
import CategoryDetailPage from '../pages/CategoryDetailPage'
import KpiDetailPage from '../pages/KpiDetailPage'

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route path="/" element={<CommandCenterOverview />} />
      <Route path="/category/:slug" element={<CategoryDetailPage />} />
      <Route path="/kpi/:id" element={<KpiDetailPage />} />
      <Route path="/kpi" element={<NewDashboardPage />} />
      <Route path="/*" element={<Navigate to="/" replace />} />
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
