// Auth.js (NextAuth) Configuration for Express
// This provides Auth.js compatible authentication for Express backend

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.AUTHJS_SECRET || process.env.JWT_SECRET || 'your-authjs-secret-key-change-this';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generate Auth.js compatible JWT token
 */
const generateAuthjsToken = (user) => {
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name || user.email,
    role: user.role || 'user',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
  };
  
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Verify Auth.js JWT token
 */
const verifyAuthjsToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return {
      valid: true,
      user: {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role,
      },
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message,
    };
  }
};

/**
 * Format user for Auth.js response
 */
const formatUserForAuthjs = (user) => {
  return {
    id: user.id,
    email: user.email,
    name: user.name || user.email,
    role: user.role || 'user',
    image: user.avatar || user.image || null,
  };
};

/**
 * Create Auth.js session object
 */
const createAuthjsSession = (user, token) => {
  return {
    user: formatUserForAuthjs(user),
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    token: token,
  };
};

module.exports = {
  generateAuthjsToken,
  verifyAuthjsToken,
  formatUserForAuthjs,
  createAuthjsSession,
  JWT_SECRET,
};

