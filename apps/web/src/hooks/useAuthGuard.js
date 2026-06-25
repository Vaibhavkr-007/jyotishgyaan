
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.js';
import { setIntendedDestination } from '@/utils/authUtils.js';

export const useAuthGuard = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const checkAuthAndRedirect = (customRedirectPath = '/login') => {
    if (!isAuthenticated && !isLoading) {
      const currentPath = location.pathname + location.search;
      setIntendedDestination(currentPath);
      navigate(customRedirectPath);
      return false;
    }
    return true;
  };

  return {
    isAuthenticated,
    isLoading,
    checkAuthAndRedirect
  };
};
