/**
 * IP Address Helper Utilities
 * Normalizes and formats IP addresses for display and storage
 */

/**
 * Normalize IP address
 * Converts IPv6 localhost (::1) to IPv4 localhost (127.0.0.1)
 * Handles other localhost variants
 */
const normalizeIp = (ip) => {
  if (!ip || ip === 'unknown' || ip === '::1' || ip === '::ffff:127.0.0.1') {
    return '127.0.0.1';
  }
  
  // Remove IPv6 prefix if present
  if (ip.startsWith('::ffff:')) {
    return ip.replace('::ffff:', '');
  }
  
  return ip;
};

/**
 * Extract client IP from Express request
 * Handles proxies, IPv6, and various header formats
 */
const getClientIp = (req) => {
  // Priority order for IP extraction
  const ipSources = [
    req.headers['x-forwarded-for']?.split(',')[0]?.trim(),
    req.headers['x-real-ip'],
    req.ip,
    req.connection?.remoteAddress,
    req.socket?.remoteAddress,
    'unknown'
  ];

  // Get first valid IP
  let clientIp = ipSources.find(ip => ip && ip !== 'undefined' && ip !== 'null') || 'unknown';

  // Normalize the IP
  clientIp = normalizeIp(clientIp);

  return clientIp;
};

/**
 * Format IP for display
 * Shows user-friendly format for localhost
 */
const formatIpForDisplay = (ip) => {
  const normalized = normalizeIp(ip);
  
  if (normalized === '127.0.0.1') {
    return 'Localhost (127.0.0.1)';
  }
  
  return normalized;
};

/**
 * Check if IP is localhost/internal
 */
const isLocalhost = (ip) => {
  const normalized = normalizeIp(ip);
  return normalized === '127.0.0.1' || normalized === 'localhost';
};

module.exports = {
  normalizeIp,
  getClientIp,
  formatIpForDisplay,
  isLocalhost
};

