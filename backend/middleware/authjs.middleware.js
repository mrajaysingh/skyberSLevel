const { verifyAuthjsToken } = require('../config/authjs.config');

/**
 * Middleware to authenticate requests using Auth.js JWT tokens
 */
const authenticateAuthjs = (req, res, next) => {
  try {
    // Get token from Authorization header or cookie
    let token = req.headers.authorization?.split(' ')[1];
    
    if (!token && req.cookies) {
      token = req.cookies['authjs.session-token'] || req.cookies['next-auth.session-token'];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided',
      });
    }

    const result = verifyAuthjsToken(token);

    if (!result.valid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        error: result.error,
      });
    }

    // Attach user to request
    req.user = result.user;
    req.authjs = true;
    
    next();
  } catch (error) {
    console.error('Auth.js authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};

/**
 * Optional authentication - doesn't fail if no token
 */
const optionalAuthjs = (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(' ')[1];
    
    if (!token && req.cookies) {
      token = req.cookies['authjs.session-token'] || req.cookies['next-auth.session-token'];
    }

    if (token) {
      const result = verifyAuthjsToken(token);
      if (result.valid) {
        req.user = result.user;
        req.authjs = true;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

module.exports = {
  authenticateAuthjs,
  optionalAuthjs,
};

