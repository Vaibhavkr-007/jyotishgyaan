import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import { Loader2 } from 'lucide-react';

const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const location = useLocation();

  console.log(`[ProtectedAdminRoute] Route: ${location.pathname} | Auth: ${isAuthenticated} | Loading: ${isLoading}`);

  if (isLoading) {
    console.log(`[ProtectedAdminRoute] Showing loading state for ${location.pathname}`);
    return (
      <div className="min-h-screen flex items-center justify-center bg-admin-background">
        <Loader2 className="w-8 h-8 animate-spin text-admin-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log(`[ProtectedAdminRoute] Access denied. Redirecting from ${location.pathname} to /admin/login`);
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  console.log(`[ProtectedAdminRoute] Access granted for ${location.pathname}. Rendering children.`);
  return children;
};

export default ProtectedAdminRoute;