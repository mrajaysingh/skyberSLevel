const express = require('express');
const router = express.Router();
const siteConfigController = require('../controllers/site-config.controller');
const { authenticateRedis } = require('../middleware/redis-auth.middleware');

// Site configuration routes
// Get current site configuration (public - no auth required for viewing)
router.get('/current', siteConfigController.getCurrentConfig);

// Save site configuration (protected - super admin only)
router.post('/save', authenticateRedis, siteConfigController.saveConfig);

// List all available backups (protected - super admin only)
router.get('/backups', authenticateRedis, siteConfigController.listBackups);

// Restore from specific backup (protected - super admin only)
router.post('/restore/:filename', authenticateRedis, siteConfigController.restoreBackup);

module.exports = router;
