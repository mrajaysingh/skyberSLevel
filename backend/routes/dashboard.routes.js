const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authenticateRedis } = require('../middleware/redis-auth.middleware');

// Dashboard routes (protected with Redis-first authentication)
// Checks Redis first, falls back to DB, rehydrates Redis
router.get('/user/:userId', authenticateRedis, dashboardController.getUserDashboard);
router.get('/super-admin', authenticateRedis, dashboardController.getSuperAdminDashboard);
router.get('/stats', authenticateRedis, dashboardController.getDashboardStats);

module.exports = router;

