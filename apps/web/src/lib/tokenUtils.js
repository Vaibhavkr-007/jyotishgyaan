
import apiServerClient from '@/lib/apiServerClient';
import pb from '@/lib/pocketbaseClient';

/**
 * Safely decodes a JWT payload to extract claims like 'exp'
 * @param {string} token - The JWT token
 * @returns {object|null} - The decoded payload or null if invalid
 */
export const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to decode token:', e);
    return null;
  }
};

/**
 * Calls the backend refresh endpoint to get a new token
 * @param {string} oldToken - The expired or expiring token
 * @returns {Promise<string>} - The new JWT token
 */
export const refreshToken = async (oldToken) => {
  const response = await apiServerClient.fetch('/admin/refresh', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${oldToken}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error('Token refresh failed');
  }
  
  const data = await response.json();
  return data.token;
};

/**
 * Retrieves a valid token, checking expiry and refreshing if necessary
 * @returns {Promise<string|null>} - A valid JWT token or null
 */
export const getValidToken = async () => {
  // Retrieve token from PocketBase or localStorage
  let token = pb.authStore.token || localStorage.getItem('adminToken');
  
  if (!token) {
    return null;
  }

  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return token; // Not a standard JWT, return as is
  }

  // Check if token expires within the next 60 seconds
  const isExpired = (decoded.exp * 1000) < (Date.now() + 60000);
  
  if (isExpired) {
    try {
      // If it's a PocketBase token, use PB's built-in refresh
      if (pb.authStore.isValid && pb.authStore.token === token) {
        const authData = await pb.collection('users').authRefresh({ $autoCancel: false });
        return authData.token;
      } else {
        // Otherwise use the custom backend refresh endpoint
        const newToken = await refreshToken(token);
        localStorage.setItem('adminToken', newToken);
        return newToken;
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
      pb.authStore.clear();
      localStorage.removeItem('adminToken');
      return null;
    }
  }

  return token;
};
