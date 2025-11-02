const passport = require('passport');

// Local authentication middleware
const authenticateLocal = passport.authenticate('local', { session: false });

// JWT authentication middleware
const authenticateJWT = passport.authenticate('jwt', { session: false });

// Google OAuth authentication
const authenticateGoogle = passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false,
});

// Google OAuth callback
const authenticateGoogleCallback = passport.authenticate('google', {
  session: false,
  failureRedirect: '/login',
});

// GitHub OAuth authentication
const authenticateGitHub = passport.authenticate('github', {
  scope: ['user:email'],
  session: false,
});

// GitHub OAuth callback
const authenticateGitHubCallback = passport.authenticate('github', {
  session: false,
  failureRedirect: '/login',
});

module.exports = {
  authenticateLocal,
  authenticateJWT,
  authenticateGoogle,
  authenticateGoogleCallback,
  authenticateGitHub,
  authenticateGitHubCallback,
};

