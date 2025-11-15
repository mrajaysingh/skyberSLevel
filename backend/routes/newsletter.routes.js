const express = require('express');
const router = express.Router();
const {
  subscribe,
  unsubscribe,
  getSubscribers,
} = require('../controllers/newsletter.controller');
const { authenticateRedis } = require('../middleware/redis-auth.middleware');

// Public routes
router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);

// Admin routes
router.get('/subscribers', authenticateRedis, getSubscribers);

module.exports = router;

