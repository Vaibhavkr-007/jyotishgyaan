
import apiServerClient from '@/lib/apiServerClient';

/**
 * Utility to automatically add JWT Authorization header to requests.
 * It retrieves the token from localStorage ('token') and handles 401 errors.
 */
const apiClient = {
  fetch: async (url, options = {}) => {
    const token = localStorage.getItem('adminToken');
    
    console.log(`[apiClient] Requesting: ${url}`);
    console.log(`[apiClient] Token exists: ${!!token}`);

    const headers = {
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log(`[apiClient] Authorization header set`);
    } else {
      console.log(`[apiClient] Missing token, Authorization header NOT set`);
    }

    const modifiedOptions = {
      ...options,
      headers,
      credentials: 'include'
    };

    // We use apiServerClient under the hood to ensure the /hcgi/api prefix is applied
    const response = await apiServerClient.fetch(url, modifiedOptions);
    
    console.log(`[apiClient] Response status: ${response.status}`);

    if (response.status === 401) {

      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');

      window.location.href = '/admin/login';

    }

    if (!response.ok) {
      let errorMessage = 'An error occurred during the request';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {
        // If response is not JSON, we just use the default or status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return response;
  }
};

export default apiClient;
export { apiClient };
