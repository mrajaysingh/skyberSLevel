const { uploadBufferToS3, deleteObjectFromS3 } = require('../lib/s3');
const { prisma } = require('../config/database');
const { decrypt } = require('../utils/crypto');
const crypto = require('crypto');

function dataUrlToBuffer(dataUrl) {
  const matches = dataUrl.match(/^data:(.+);base64,(.*)$/);
  if (!matches) throw new Error('Invalid data URL');
  const contentType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, 'base64');
  return { buffer, contentType };
}

function generateId16() {
  // 16 hex chars (0-9a-f), strong randomness
  return crypto.randomBytes(8).toString('hex');
}

/**
 * POST /api/profile/upload-image
 * Body: { type: 'avatar' | 'banner', dataUrl: string }
 */
const uploadProfileImage = async (req, res) => {
  try {
    const { type, dataUrl } = req.body || {};
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    if (!type || !['avatar', 'banner'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid type' });
    }
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
      return res.status(400).json({ success: false, message: 'Invalid dataUrl' });
    }

    const { buffer, contentType } = dataUrlToBuffer(dataUrl);
    const bucket = process.env.BUCKET_NAME;
    if (!bucket) {
      return res.status(500).json({ success: false, message: 'S3 bucket not configured' });
    }

    const folder = process.env.IMAGE_STORAGE_URI?.replace('s3://', '') || `${bucket}/Images/`;
    const keyPrefix = folder.includes('/') ? folder.split('/').slice(1).join('/') : '';
    const unique = generateId16();
    const key = `${keyPrefix}${req.user.id}/${unique}.jpg`;

    const url = await uploadBufferToS3({ bucket, key, buffer, contentType: contentType || 'image/jpeg' });

    // Persist to DB for SuperAdmin or User
    const updateData = type === 'avatar' ? { avatar: url } : { banner: url };
    if (req.user.isSuperAdmin) {
      await prisma.superAdmin.update({ where: { id: req.user.id }, data: updateData });
    } else {
      await prisma.user.update({ where: { id: req.user.id }, data: updateData });
    }

    return res.status(200).json({ success: true, url });
  } catch (error) {
    console.error('Upload image error:', error);
    return res.status(500).json({ success: false, message: error?.message || 'Failed to upload image' });
  }
};

module.exports = { uploadProfileImage };

function extractKeyFromUrl(url) {
  // Supports both path-style and virtual-hosted style
  try {
    const u = new URL(url);
    // path-style: /bucket/key
    if (u.hostname.startsWith('s3.')) {
      // /{bucket}/{...key}
      const parts = u.pathname.split('/').filter(Boolean);
      if (parts.length >= 2) {
        return parts.slice(1).join('/');
      }
    }
    // virtual-hosted: bucket.s3.region.amazonaws.com/key
    return u.pathname.replace(/^\//, '');
  } catch (_) {
    return null;
  }
}

/**
 * POST /api/profile/delete-image
 * Body: { type: 'avatar' | 'banner', url?: string }
 */
const deleteProfileImage = async (req, res) => {
  try {
    const { type, url } = req.body || {};
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    if (!type || !['avatar', 'banner'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid type' });
    }

    const bucket = process.env.BUCKET_NAME;
    if (!bucket) {
      return res.status(500).json({ success: false, message: 'S3 bucket not configured' });
    }

    // Find current url if not provided
    let currentUrl = url;
    if (!currentUrl) {
      const record = req.user.isSuperAdmin
        ? await prisma.superAdmin.findUnique({ where: { id: req.user.id }, select: { avatar: true, banner: true } })
        : await prisma.user.findUnique({ where: { id: req.user.id }, select: { avatar: true, banner: true } });
      currentUrl = type === 'avatar' ? record?.avatar : record?.banner;
    }

    if (currentUrl) {
      const key = extractKeyFromUrl(currentUrl);
      if (key) {
        await deleteObjectFromS3({ bucket, key });
      }
    }

    const updateData = type === 'avatar' ? { avatar: null } : { banner: null };
    if (req.user.isSuperAdmin) {
      await prisma.superAdmin.update({ where: { id: req.user.id }, data: updateData });
    } else {
      await prisma.user.update({ where: { id: req.user.id }, data: updateData });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Delete image error:', error);
    return res.status(500).json({ success: false, message: error?.message || 'Failed to delete image' });
  }
};

module.exports.deleteProfileImage = deleteProfileImage;

/**
 * POST /api/profile/update
 * Body: { firstName, middleName, lastName, designation, company, username, email, socialFacebook, socialLinkedIn, socialInstagram }
 */
const updateProfile = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const {
      firstName, middleName, lastName,
      designation, company, username, email,
      socialFacebook, socialLinkedIn, socialInstagram
    } = req.body || {};

    const data = {
      ...(firstName !== undefined ? { firstName } : {}),
      ...(middleName !== undefined ? { middleName } : {}),
      ...(lastName !== undefined ? { lastName } : {}),
      ...(designation !== undefined ? { designation } : {}),
      ...(company !== undefined ? { company } : {}),
      ...(username !== undefined ? { username } : {}),
      ...(socialFacebook !== undefined ? { socialFacebook } : {}),
      ...(socialLinkedIn !== undefined ? { socialLinkedIn } : {}),
      ...(socialInstagram !== undefined ? { socialInstagram } : {}),
      // Only allow changing email if provided and different (optional)
      ...(email !== undefined ? { email } : {}),
    };

    if (req.user.isSuperAdmin) {
      await prisma.superAdmin.update({ where: { id: req.user.id }, data });
    } else {
      await prisma.user.update({ where: { id: req.user.id }, data });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ success: false, message: error?.message || 'Failed to update profile' });
  }
};

module.exports.updateProfile = updateProfile;

/**
 * POST /api/profile/disconnect-social
 * Body: { provider: 'github' | 'google' | 'all' }
 * Effect: Removes connected OAuth provider IDs and clears social links from the profile.
 */
const disconnectSocial = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const { provider } = req.body || {};
    const allowed = ['github', 'google', 'all'];
    if (!provider || !allowed.includes(provider)) {
      return res.status(400).json({ success: false, message: 'Invalid provider' });
    }

    const baseClear = {
      // Clear social links as requested (remove all references)
      socialFacebook: null,
      socialLinkedIn: null,
      socialInstagram: null,
    };

    let clearProviders = {};
    if (provider === 'github') {
      clearProviders = { githubId: null };
    } else if (provider === 'google') {
      clearProviders = { googleId: null };
    } else {
      clearProviders = { githubId: null, googleId: null };
    }

    const data = { ...baseClear, ...clearProviders, provider: 'local' };

    if (req.user.isSuperAdmin) {
      await prisma.superAdmin.update({ where: { id: req.user.id }, data });
    } else {
      await prisma.user.update({ where: { id: req.user.id }, data });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Disconnect social error:', error);
    return res.status(500).json({ success: false, message: error?.message || 'Failed to disconnect social' });
  }
};

module.exports.disconnectSocial = disconnectSocial;

/**
 * POST /api/profile/export
 * Returns a JSON snapshot of the current account, including S3 image URLs and base64 data.
 */
const exportMyData = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const bucket = process.env.BUCKET_NAME;
    const kind = req.user.isSuperAdmin ? 'superAdmin' : 'user';
    const me = req.user.isSuperAdmin
      ? await prisma.superAdmin.findUnique({ where: { id: req.user.id } })
      : await prisma.user.findUnique({ where: { id: req.user.id } });

    const cardRow = await prisma.crdsb.findFirst({
      where: req.user.isSuperAdmin ? { superAdminId: req.user.id } : { userId: req.user.id },
      select: {
        last4: true,
        brand: true,
        createdAt: true,
        updatedAt: true,
        cardNumberEnc: true,
        expMonthEnc: true,
        expYearEnc: true,
        cvvEnc: true,
      }
    }).catch(() => null);

    let card = null;
    if (cardRow) {
      // Always include encrypted; best-effort decrypt if key configured
      let plaintext = { cardNumber: null, expiryMonth: null, expiryYear: null, cvv: null };
      try {
        plaintext = {
          cardNumber: cardRow.cardNumberEnc ? decrypt(cardRow.cardNumberEnc) : null,
          expiryMonth: cardRow.expMonthEnc ? decrypt(cardRow.expMonthEnc) : null,
          expiryYear: cardRow.expYearEnc ? decrypt(cardRow.expYearEnc) : null,
          cvv: cardRow.cvvEnc ? decrypt(cardRow.cvvEnc) : null,
        };
      } catch (_) {
        // ignore decryption errors (likely key not configured)
      }
      card = {
        last4: cardRow.last4,
        brand: cardRow.brand || null,
        createdAt: cardRow.createdAt,
        updatedAt: cardRow.updatedAt,
        encrypted: {
          cardNumberEnc: cardRow.cardNumberEnc || null,
          expMonthEnc: cardRow.expMonthEnc || null,
          expYearEnc: cardRow.expYearEnc || null,
          cvvEnc: cardRow.cvvEnc || null,
        },
        plaintext,
      };
    }

    const sessions = await prisma.session.findMany({
      where: req.user.isSuperAdmin ? { superAdminId: req.user.id } : { userId: req.user.id },
      select: { id: true, isValid: true, createdAt: true, expiresAt: true, ipAddress: true, userAgent: true }
    }).catch(() => []);

    function addImage(url) {
      // As requested: do not include base64 in the export; only include URL
      if (!url) return { url: null };
      return { url };
    }

    const avatar = addImage(me?.avatar || null);
    const banner = addImage(me?.banner || null);

    const payload = {
      meta: {
        generatedAt: new Date().toISOString(),
        app: 'Skyber',
        version: '1.0'
      },
      account: {
        kind,
        id: me?.id || req.user.id,
        email: me?.email || null,
        name: me?.name || null,
        profile: {
          firstName: me?.firstName || null,
          middleName: me?.middleName || null,
          lastName: me?.lastName || null,
          designation: me?.designation || null,
          company: me?.company || null,
          username: me?.username || null,
          socialFacebook: me?.socialFacebook || null,
          socialLinkedIn: me?.socialLinkedIn || null,
          socialInstagram: me?.socialInstagram || null,
        },
        oauth: {
          githubId: me?.githubId || null,
          googleId: me?.googleId || null,
          provider: me?.provider || null,
        },
        planTier: me?.planTier || null,
        createdAt: me?.createdAt || null,
        updatedAt: me?.updatedAt || null,
      },
      media: { avatar, banner },
      card: card || null,
      sessions: sessions || [],
    };

    return res.status(200).json({ success: true, data: payload });
  } catch (error) {
    console.error('Export data error:', error);
    return res.status(500).json({ success: false, message: error?.message || 'Failed to export data' });
  }
};

module.exports.exportMyData = exportMyData;

/**
 * POST /api/profile/delete-account
 * Body: { agree: boolean, skipBackup?: boolean }
 * Moves account to "depricated" archive table and removes from active tables.
 */
const deleteAccount = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { agree } = req.body || {};
    if (!agree) return res.status(400).json({ success: false, message: 'Agreement required' });

    const kind = req.user.isSuperAdmin ? 'superAdmin' : 'user';
    const me = req.user.isSuperAdmin
      ? await prisma.superAdmin.findUnique({ where: { id: req.user.id } })
      : await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!me) return res.status(404).json({ success: false, message: 'Account not found' });

    // Build snapshot using export logic (without S3 base64 to keep it light here)
    const card = await prisma.crdsb.findFirst({
      where: req.user.isSuperAdmin ? { superAdminId: req.user.id } : { userId: req.user.id }
    }).catch(() => null);
    const sessions = await prisma.session.findMany({
      where: req.user.isSuperAdmin ? { superAdminId: req.user.id } : { userId: req.user.id }
    }).catch(() => []);

    const snapshot = {
      account: me,
      card,
      sessions,
      archivedAt: new Date().toISOString(),
    };

    // Write to depricated table
    await prisma.depricated.create({
      data: {
        kind,
        userId: req.user.isSuperAdmin ? null : me.id,
        superAdminId: req.user.isSuperAdmin ? me.id : null,
        email: me.email || null,
        payload: snapshot,
      }
    });

    // Remove from active tables inside transaction
    await prisma.$transaction(async (tx) => {
      // Invalidate sessions first
      await tx.session.updateMany({
        where: req.user.isSuperAdmin ? { superAdminId: me.id } : { userId: me.id },
        data: { isValid: false }
      }).catch(() => {});
      // Delete related card
      await tx.crdsb.deleteMany({
        where: req.user.isSuperAdmin ? { superAdminId: me.id } : { userId: me.id }
      }).catch(() => {});
      // Delete principal record
      if (req.user.isSuperAdmin) {
        await tx.superAdmin.delete({ where: { id: me.id } });
      } else {
        await tx.user.delete({ where: { id: me.id } });
      }
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Delete account error:', error);
    return res.status(500).json({ success: false, message: error?.message || 'Failed to delete account' });
  }
};

module.exports.deleteAccount = deleteAccount;
