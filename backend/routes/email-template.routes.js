const express = require('express');
const router = express.Router();
const {
  createTemplate,
  updateTemplate,
  getTemplates,
  getTemplate,
  deleteTemplate,
} = require('../controllers/email-template.controller');
const { authenticateRedis } = require('../middleware/redis-auth.middleware');

// All routes require authentication
router.post('/', authenticateRedis, createTemplate);
router.put('/:id', authenticateRedis, updateTemplate);
router.get('/', authenticateRedis, getTemplates);
router.get('/:id', authenticateRedis, getTemplate);
router.delete('/:id', authenticateRedis, deleteTemplate);

module.exports = router;

