// Authentication Middleware - Unified authentication for Passport.js and Auth.js

const jwt = require('jsonwebtoken');
const { authenticateJWT } = require('./passport.middleware');
const { authenticateAuthjs } = require('./authjs.middleware');

/**
 * Universal token authentication - tries both Passport JWT and Auth.js
 */
const authenticateToken = async (req, res, next) => {
  try {
    // First try Passport JWT
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      try {
        // Verify JWT token
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || 'your-super-secret-jwt-key'
        );

        req.user = {
          id: decoded.sub || decoded.id,
          email: decoded.email,
          role: decoded.role || 'user',
        };
        req.authMethod = 'passport-jwt';
        return next();
      } catch (jwtError) {
        // If JWT fails, try Auth.js
        // This will be handled in the Auth.js middleware below
      }
    }

    // Try Auth.js authentication
    return authenticateAuthjs(req, res, () => {
      req.authMethod = 'authjs';
      next();
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
};

/**
 * Passport JWT only authentication
 */
const authenticatePassportJWT = authenticateJWT;

/**
 * Auth.js only authentication
 */
const authenticateAuthjsOnly = authenticateAuthjs;

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken, // Universal - tries both methods
  authenticatePassportJWT, // Passport JWT only
  authenticateAuthjsOnly, // Auth.js only
  authorize, // Role-based authorization
};

