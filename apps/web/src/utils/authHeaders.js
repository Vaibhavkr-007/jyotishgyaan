
export const getToken = () => {
  const token = localStorage.getItem('customerToken');
  return token;
};

export const isAuthenticated = () => {
  const isAuth = !!getToken();
  console.log(`[authHeaders] Checking isAuthenticated: ${isAuth}`);
  return isAuth;
};

export const getAuthHeaders = () => {
  const token = getToken();
  console.log(`[authHeaders] Generating headers. Token exists: ${!!token}`);
  
  if (!token) {
    console.warn('[authHeaders] Warning: Generating headers without a token.');
    return {
      'Content-Type': 'application/json'
    };
  }

  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Alias as requested
export const getAuthorizationHeaders = getAuthHeaders;
