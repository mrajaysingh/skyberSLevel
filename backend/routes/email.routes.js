const express = require('express');
const router = express.Router();
const {
  sendEmail,
  saveDraft,
  getDrafts,
  getDraft,
  deleteDraft,
  getSentEmails,
  getScheduledEmails,
  cancelScheduledEmail,
} = require('../controllers/email.controller');
const { authenticateRedis } = require('../middleware/redis-auth.middleware');

// All routes require authentication
router.post('/send', authenticateRedis, sendEmail);
router.post('/draft', authenticateRedis, saveDraft);
router.get('/drafts', authenticateRedis, getDrafts);
router.get('/drafts/:id', authenticateRedis, getDraft);
router.delete('/drafts/:id', authenticateRedis, deleteDraft);
router.get('/sent', authenticateRedis, getSentEmails);
router.get('/scheduled', authenticateRedis, getScheduledEmails);
router.delete('/scheduled/:id', authenticateRedis, cancelScheduledEmail);

module.exports = router;

