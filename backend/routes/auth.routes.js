const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const {
  authenticateLocal,
  authenticateGoogle,
  authenticateGoogleCallback,
  authenticateGitHub,
  authenticateGitHubCallback,
} = require('../middleware/passport.middleware');

// Enterprise authentication routes (Redis-first with DB fallback)
router.post('/login', authController.login); // Redis + DB authentication
router.post('/logout', authController.logout); // Invalidates Redis + DB
router.post('/register', authController.register); // Creates user + session
router.post('/refresh', authController.refreshToken); // Refresh session token
router.get('/verify', authController.verifyToken); // Verify token
router.get('/check-role/:email', authController.checkUserRole); // Check user role by email (public)

// Passport Local authentication
router.post('/passport/login', authenticateLocal, authController.passportLogin);

// Passport Google OAuth routes
router.get('/passport/google', authenticateGoogle);
router.get('/passport/google/callback', authenticateGoogleCallback, authController.oauthCallback);

// Passport GitHub OAuth routes
router.get('/passport/github', authenticateGitHub);
router.get('/passport/github/callback', authenticateGitHubCallback, authController.oauthCallback);

// Auth.js compatible routes
router.post('/authjs/login', authController.authjsLogin);
router.post('/authjs/logout', authController.logout);
router.get('/authjs/session', authController.getAuthjsSession);

module.exports = router;

