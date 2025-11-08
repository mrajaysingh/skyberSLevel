const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
// Passport middleware removed

// Enterprise authentication routes (Redis-first with DB fallback)
router.post('/login', authController.login); // Redis + DB authentication
router.post('/logout', authController.logout); // Invalidates Redis + DB
router.post('/register', authController.register); // Creates user + session
router.post('/refresh', authController.refreshToken); // Refresh session token
router.get('/verify', authController.verifyToken); // Verify token
router.get('/check-role/:email', authController.checkUserRole); // Check user role by email (public)

// Passport routes removed

// Auth.js compatible routes
router.post('/authjs/login', authController.authjsLogin);
router.post('/authjs/logout', authController.logout);
router.get('/authjs/session', authController.getAuthjsSession);

// OAuth (without Passport)
router.get('/oauth/github', authController.oauthGithubStart);
router.get('/oauth/github/callback', authController.oauthGithubCallback);
router.get('/oauth/google', authController.oauthGoogleStart);
router.get('/oauth/google/callback', authController.oauthGoogleCallback);

module.exports = router;

