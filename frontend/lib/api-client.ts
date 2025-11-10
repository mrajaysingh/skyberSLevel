/**
 * API Client with automatic session expiration handling
 * Wraps fetch to catch 401 responses and show session expired modal
 */

let sessionExpiredHandler: (() => void) | null = null;

export function setSessionExpiredHandler(handler: () => void) {
  sessionExpiredHandler = handler;
}

export async function apiFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const response = await fetch(url, options);

  // If we get a 401, trigger session expired handler
  if (response.status === 401 && sessionExpiredHandler) {
    sessionExpiredHandler();
  }

  return response;
}

// Override global fetch in browser environment
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    const response = await originalFetch(...args);
    
    // Check for 401 responses
    if (response.status === 401 && sessionExpiredHandler) {
      // Only trigger if it's an API call (not login/refresh endpoints)
      const url = args[0]?.toString() || '';
      if (url.includes('/api/') && !url.includes('/api/auth/login') && !url.includes('/api/auth/refresh')) {
        sessionExpiredHandler();
      }
    }
    
    return response;
  };
}

