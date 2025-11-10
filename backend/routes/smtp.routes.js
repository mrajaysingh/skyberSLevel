const express = require('express');
const router = express.Router();
const {
  getSmtpSettings,
  getSmtpSetting,
  createSmtpSettings,
  updateSmtpSettings,
  deleteSmtpSettings,
  testSmtpConnection,
  getSmtpLogsHandler,
} = require('../controllers/smtp.controller');
const { authenticateRedis } = require('../middleware/redis-auth.middleware');

// All routes require authentication
router.get('/', authenticateRedis, getSmtpSettings);
router.get('/logs', authenticateRedis, getSmtpLogsHandler);
router.get('/:id', authenticateRedis, getSmtpSetting);
router.post('/', authenticateRedis, createSmtpSettings);
router.put('/:id', authenticateRedis, updateSmtpSettings);
router.delete('/:id', authenticateRedis, deleteSmtpSettings);
router.post('/:id/test', authenticateRedis, testSmtpConnection);

module.exports = router;

