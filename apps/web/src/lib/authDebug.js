
/**
 * Debug utility that logs complete auth status
 */
export const debugAuth = () => {
  console.log('=== AUTH DEBUG ===');
  
  let token = localStorage.getItem('customerToken');
  let source = 'localStorage';
  
  if (!token) {
    token = sessionStorage.getItem('token');
    source = 'sessionStorage';
  }
  
  if (!token) {
    const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
    if (match) {
      token = match[2];
      source = 'cookies';
    }
  }

  console.log(`Token exists: ${!!token} (Source: ${source})`);
  
  if (token) {
    console.log(`Token length: ${token.length}`);
    const parts = token.split('.');
    console.log(`Token format valid (3 parts): ${parts.length === 3}`);
    
    if (parts.length === 3) {
      try {
        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
        );
        const payload = JSON.parse(jsonPayload);
        
        console.log('Decoded payload:', payload);
        if (payload.exp) {
          const expDate = new Date(payload.exp * 1000);
          const isExpired = expDate < new Date();
          console.log(`Expires at: ${expDate.toLocaleString()}`);
          console.log(`Is expired: ${isExpired}`);
        }
      } catch (e) {
        console.error('Failed to decode token payload:', e);
      }
    }
  } else {
    console.log('No token found in any storage mechanism.');
  }
  
  console.log('==================');
};
