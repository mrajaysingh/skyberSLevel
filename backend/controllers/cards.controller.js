const { prisma } = require('../config/database');
const { encrypt, decrypt } = require('../utils/crypto');

/**
 * POST /api/cards/save
 * Body: { cardNumber: string, expiryMonth: string, expiryYear: string, cvv: string, brand?: string }
 * Stores encrypted card details associated with the authenticated account (user or super-admin).
 */
async function saveCard(req, res) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const { cardNumber, expiryMonth, expiryYear, cvv, brand } = req.body || {};

    // Basic validation
    const pan = String(cardNumber || '').replace(/\D/g, '');
    if (pan.length < 12 || pan.length > 19) {
      return res.status(400).json({ success: false, message: 'Invalid card number' });
    }
    const mm = String(expiryMonth || '').padStart(2, '0');
    const yy = String(expiryYear || '');
    if (!/^\d{2}$/.test(mm) || Number(mm) < 1 || Number(mm) > 12) {
      return res.status(400).json({ success: false, message: 'Invalid expiry month' });
    }
    if (!/^\d{4}$/.test(yy)) {
      return res.status(400).json({ success: false, message: 'Invalid expiry year' });
    }
    const cv = String(cvv || '').replace(/\D/g, '');
    if (cv && (cv.length < 3 || cv.length > 4)) {
      return res.status(400).json({ success: false, message: 'Invalid CVV' });
    }

    const owner = req.user.isSuperAdmin ? { superAdminId: req.user.id } : { userId: req.user.id };

    const payload = {
      ...owner,
      cardNumberEnc: encrypt(pan),
      expMonthEnc: encrypt(mm),
      expYearEnc: encrypt(yy),
      cvvEnc: encrypt(cv || ''),
      last4: pan.slice(-4),
      ...(brand ? { brand } : {}),
    };

    // Upsert-by-owner (one card per owner)
    const existing = await prisma.crdsb.findFirst({ where: owner });
    if (existing) {
      await prisma.crdsb.update({ where: { id: existing.id }, data: payload });
    } else {
      await prisma.crdsb.create({ data: payload });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('saveCard error:', error);
    return res.status(500).json({ success: false, message: error?.message || 'Failed to save card' });
  }
}

/**
 * GET /api/cards/me
 * Returns masked card info for the authenticated account.
 */
async function getMyCard(req, res) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const owner = req.user.isSuperAdmin ? { superAdminId: req.user.id } : { userId: req.user.id };
    const card = await prisma.crdsb.findFirst({ where: owner });
    if (!card) {
      return res.status(200).json({ success: true, data: null });
    }

    let expiryMonth, expiryYear;
    try {
      expiryMonth = decrypt(card.expMonthEnc);
      expiryYear = decrypt(card.expYearEnc);
    } catch (_) {
      expiryMonth = null; expiryYear = null;
    }

    return res.status(200).json({
      success: true,
      data: {
        last4: card.last4,
        brand: card.brand || null,
        expiryMonth,
        expiryYear,
      }
    });
  } catch (error) {
    console.error('getMyCard error:', error);
    return res.status(500).json({ success: false, message: error?.message || 'Failed to fetch card' });
  }
}

async function getMyCardFull(req, res) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    if (String(process.env.ALLOW_PLAINTEXT_CARD_RETURN).toLowerCase() !== 'true') {
      return res.status(403).json({ success: false, message: 'Plaintext return disabled' });
    }

    const owner = req.user.isSuperAdmin ? { superAdminId: req.user.id } : { userId: req.user.id };
    const card = await prisma.crdsb.findFirst({ where: owner });
    if (!card) {
      return res.status(200).json({ success: true, data: null });
    }

    let cardNumber, expiryMonth, expiryYear, cvv;
    try {
      cardNumber = decrypt(card.cardNumberEnc);
      expiryMonth = decrypt(card.expMonthEnc);
      expiryYear = decrypt(card.expYearEnc);
      cvv = decrypt(card.cvvEnc);
    } catch (_) {
      cardNumber = null; expiryMonth = null; expiryYear = null; cvv = null;
    }

    return res.status(200).json({
      success: true,
      data: {
        cardNumber,
        expiryMonth,
        expiryYear,
        cvv,
        brand: card.brand || null,
      }
    });
  } catch (error) {
    console.error('getMyCardFull error:', error);
    return res.status(500).json({ success: false, message: error?.message || 'Failed to fetch card' });
  }
}

module.exports = { saveCard, getMyCard, getMyCardFull };
