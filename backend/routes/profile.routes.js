const express = require('express');
const router = express.Router();
const { uploadProfileImage, deleteProfileImage, updateProfile, disconnectSocial, exportMyData, deleteAccount } = require('../controllers/profile.controller');
const { authenticateRedis } = require('../middleware/redis-auth.middleware');

router.post('/upload-image', authenticateRedis, uploadProfileImage);
router.post('/delete-image', authenticateRedis, deleteProfileImage);
router.post('/update', authenticateRedis, updateProfile);
router.post('/disconnect-social', authenticateRedis, disconnectSocial);
router.post('/export', authenticateRedis, exportMyData);
router.post('/delete-account', authenticateRedis, deleteAccount);

module.exports = router;

