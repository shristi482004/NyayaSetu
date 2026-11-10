import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NyayaSetuLogo } from './BrandGraphics';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pale-200 flex flex-col items-center justify-center p-6">
        <NyayaSetuLogo size="sm" variant="light" />
        <div className="mt-6 flex items-center gap-3 text-sm font-mono text-slate-600">
          <span className="w-2.5 h-2.5 rounded-full bg-midnight-900 animate-ping"></span>
          <span>Verifying session authorization...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    // If citizen tries to access lawyer or admin route, redirect to citizen dashboard
    return (
      <div className="min-h-screen bg-pale-200 flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-2xl bg-white border border-slate-300 shadow-subtle text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 mx-auto flex items-center justify-center font-mono font-bold text-sm border border-amber-200">
            [403]
          </div>
          <h2 className="text-xl font-serif font-bold text-midnight-900">
            Access Restricted
          </h2>
          <p className="text-sm font-sans text-slate-600 leading-relaxed">
            Your current account role (<span className="font-semibold text-midnight-900">{user?.role}</span>) does not have authorization to access this workspace.
          </p>
          <div className="pt-2">
            <Navigate to="/dashboard" replace />
          </div>
        </div>
      </div>
    );
  }

  return children;
};

