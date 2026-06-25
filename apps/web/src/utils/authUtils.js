
export const setIntendedDestination = (url) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('intendedDestination', url);
  }
};

export const getIntendedDestination = () => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('intendedDestination');
  }
  return null;
};

export const clearIntendedDestination = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('intendedDestination');
  }
};

export const requireAuth = (isAuthenticated, redirectPath = '/login') => {
  if (!isAuthenticated) {
    if (typeof window !== 'undefined') {
      setIntendedDestination(window.location.pathname + window.location.search);
      window.location.href = redirectPath;
    }
    return false;
  }
  return true;
};
