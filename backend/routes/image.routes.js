const express = require('express');
const router = express.Router();
const imageController = require('../controllers/image.controller');
const { authenticateRedis } = require('../middleware/redis-auth.middleware');

// Image upload routes (protected - super admin only)
router.post('/upload', authenticateRedis, imageController.uploadImage);
router.delete('/delete', authenticateRedis, imageController.deleteImage);
router.get('/list', authenticateRedis, imageController.listImages);
router.get('/get', authenticateRedis, imageController.getImage);

module.exports = router;

