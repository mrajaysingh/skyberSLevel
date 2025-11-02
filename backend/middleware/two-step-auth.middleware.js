// Two-Step Authentication Middleware
// Step 1: Auth.js authentication
// Step 2: Passport.js verification

const jwt = require('jsonwebtoken');
const { verifyAuthjsToken } = require('../config/authjs.config');

/**
 * Two-step authentication middleware
 * 1. First verifies Auth.js token
 * 2. Then verifies Passport.js JWT token
 */
const twoStepAuthenticate = async (req, res, next) => {
  try {
    // Step 1: Extract and verify Auth.js token
    let authjsToken = null;

    // Try to get token from Authorization header
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      const parts = authHeader.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        authjsToken = parts[1];
      }
    }

    // Also check cookies for Auth.js token
    if (!authjsToken && req.cookies) {
      authjsToken = req.cookies['authjs.session-token'] || 
                   req.cookies['next-auth.session-token'] ||
                   req.cookies['authToken'];
    }

    if (!authjsToken) {
      return res.status(401).json({
        success: false,
        message: 'Step 1 failed: Auth.js token required',
        step: 1,
        error: 'AUTHJS_TOKEN_MISSING'
      });
    }

    // Step 1: Verify Auth.js token
    const authjsResult = verifyAuthjsToken(authjsToken);
    
    if (!authjsResult.valid) {
      return res.status(401).json({
        success: false,
        message: 'Step 1 failed: Invalid or expired Auth.js token',
        step: 1,
        error: 'AUTHJS_TOKEN_INVALID',
        details: authjsResult.error
      });
    }

    // Auth.js token is valid - attach user from Auth.js
    req.authjsUser = authjsResult.user;
    req.authjsToken = authjsToken;

    // Step 2: Verify Passport.js JWT token
    // Get Passport token from header (may be same token or separate)
    let passportToken = authjsToken; // Try same token first
    
    // Or look for separate Passport token in custom header
    const passportAuthHeader = req.headers['x-passport-token'];
    if (passportAuthHeader) {
      passportToken = passportAuthHeader.startsWith('Bearer ') 
        ? passportAuthHeader.split(' ')[1] 
        : passportAuthHeader;
    }

    // Also check for passport token in cookies
    if (!passportAuthHeader && req.cookies) {
      passportToken = req.cookies['passportToken'] || passportToken;
    }

    if (!passportToken) {
      return res.status(401).json({
        success: false,
        message: 'Step 2 failed: Passport.js token required',
        step: 2,
        error: 'PASSPORT_TOKEN_MISSING'
      });
    }

    try {
      // Step 2: Verify Passport.js JWT
      const passportDecoded = jwt.verify(
        passportToken,
        process.env.JWT_SECRET || 'your-super-secret-jwt-key'
      );

      // Verify that Passport token user matches Auth.js token user
      const authjsUserId = req.authjsUser.id;
      const passportUserId = passportDecoded.sub || passportDecoded.id;

      if (authjsUserId !== passportUserId) {
        return res.status(401).json({
          success: false,
          message: 'Step 2 failed: Token user mismatch',
          step: 2,
          error: 'TOKEN_USER_MISMATCH',
          details: 'Auth.js and Passport.js tokens belong to different users'
        });
      }

      // Both tokens valid and user matches - attach user to request
      req.user = {
        id: passportDecoded.sub || passportDecoded.id,
        email: passportDecoded.email || req.authjsUser.email,
        role: passportDecoded.role || req.authjsUser.role,
        name: passportDecoded.name || req.authjsUser.name,
      };

      req.authMethod = 'two-step';
      req.passportToken = passportToken;

      // Both steps passed!
      return next();
    } catch (passportError) {
      // Passport JWT verification failed
      return res.status(401).json({
        success: false,
        message: 'Step 2 failed: Invalid or expired Passport.js token',
        step: 2,
        error: 'PASSPORT_TOKEN_INVALID',
        details: passportError.message
      });
    }
  } catch (error) {
    console.error('Two-step authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error occurred',
      error: error.message
    });
  }
};

/**
 * Optional two-step authentication - doesn't fail if tokens are missing
 * Useful for routes that work with or without authentication
 */
const optionalTwoStepAuth = async (req, res, next) => {
  try {
    await twoStepAuthenticate(req, res, next);
  } catch (error) {
    // Continue without authentication
    next();
  }
};

module.exports = {
  twoStepAuthenticate,
  optionalTwoStepAuth
};

