import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { ChatPage } from './pages/ChatPage';
import { LawyerPage } from './pages/LawyerPage';
import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Citizen / Shared Workspaces */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['citizen', 'lawyer', 'admin']}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Document-Specific Workspaces */}
          <Route
            path="/documents/:id/analysis"
            element={
              <ProtectedRoute allowedRoles={['citizen', 'lawyer', 'admin']}>
                <AnalysisPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/documents/:id/chat"
            element={
              <ProtectedRoute allowedRoles={['citizen', 'lawyer', 'admin']}>
                <ChatPage />
              </ProtectedRoute>
            }
          />

          {/* Lawyer Workspace */}
          <Route
            path="/lawyer"
            element={
              <ProtectedRoute allowedRoles={['lawyer', 'admin']}>
                <LawyerPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Console */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* 404 Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
