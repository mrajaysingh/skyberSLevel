const express = require('express');
const router = express.Router();
const { authenticateRedis } = require('../middleware/redis-auth.middleware');
const { saveCard, getMyCard, getMyCardFull } = require('../controllers/cards.controller');

// Save/update card for current user/super-admin
router.post('/save', authenticateRedis, saveCard);

// Get card summary for current user/super-admin
router.get('/me', authenticateRedis, getMyCard);

// Dev-only: Return decrypted card details (guarded by env ALLOW_PLAINTEXT_CARD_RETURN)
router.get('/me/full', authenticateRedis, getMyCardFull);

module.exports = router;
