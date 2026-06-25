
import apiServerClient from '@/lib/apiServerClient';

/**
 * Centralized authenticated API client that automatically includes JWT Authorization header
 */
const getToken = () => {
  let token = localStorage.getItem('customerToken');
  let source = 'localStorage';
  
  if (!token) {
    token = sessionStorage.getItem('customerToken');
    source = 'sessionStorage';
  }
  
  if (!token) {
    const match = document.cookie.match(
      new RegExp('(^| )customerToken=([^;]+)')
    );
    if (match) {
      token = match[2];
      source = 'cookies';
    }
  }

  if (token) {
    console.log(`[Auth] Token found in ${source}, length: ${token.length}`);
  } else {
    console.log('[Auth] No token found in any storage');
  }

  return token;
};

const redirectToLogin = () => {

  localStorage.removeItem('customerToken');

  localStorage.removeItem('customerUser');

  sessionStorage.removeItem('customerToken');

  document.cookie =
      'customerToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

  window.location.href = '/login';

};

const request = async (url, options = {}) => {
  const token = getToken();
  
  if (!token) {
    console.error('[Auth] Error: No token available for authenticated request');
    redirectToLogin();
    throw new Error('Authentication required');
  }

  const headers = { ...options.headers };
  headers['Authorization'] = `Bearer ${token}`;
  
  console.log(`[Auth] Making request to: ${url}`);
  console.log(`[Auth] Authorization header: Bearer ${token.substring(0, 30)}...`);

  // Strip /hcgi/api if it was accidentally included, because apiServerClient adds it automatically
  const cleanUrl = url.replace(/^\/hcgi\/api/, '');

  const modifiedOptions = {
    ...options,
    headers,
    credentials: 'include'
  };

  const response = await apiServerClient.fetch(cleanUrl, modifiedOptions);

  if (response.status === 401) {
    console.error('[Auth] Error: 401 Unauthorized received');
    redirectToLogin();
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    let errorMessage = 'An error occurred during the request';
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch (e) {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response;
};

const authenticatedApiClient = {
  getToken,
  redirectToLogin,
  request,
  get: (url, options) => request(url, { ...options, method: 'GET' }),
  post: (url, body, options) => request(url, { ...options, method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json', ...options?.headers } }),
  put: (url, body, options) => request(url, { ...options, method: 'PUT', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json', ...options?.headers } }),
  delete: (url, options) => request(url, { ...options, method: 'DELETE' })
};

export default authenticatedApiClient;
