const { prisma } = require('../config/database');
const { logSmtpDetails, getSmtpLogs } = require('../utils/smtp-logger');
const { testSmtpConnection: testSmtpConnectionUtil } = require('../utils/smtp-tester');
const crypto = require('crypto');

// Encryption key from environment (should be 32 bytes for AES-256)
// Derive a consistent 32-byte key from the provided key
function deriveKey(keyString) {
  if (!keyString) {
    return crypto.randomBytes(32);
  }
  // If key is already 64 hex chars (32 bytes), use it directly
  if (keyString.length === 64 && /^[0-9a-fA-F]+$/.test(keyString)) {
    return Buffer.from(keyString, 'hex');
  }
  // Otherwise, hash the key to get a consistent 32-byte key
  return crypto.createHash('sha256').update(keyString).digest();
}

const ENCRYPTION_KEY = deriveKey(process.env.SMTP_ENCRYPTION_KEY);
const ALGORITHM = 'aes-256-cbc';

/**
 * Encrypt SMTP password
 */
function encryptPassword(password) {
  if (!password) return null;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

/**
 * Decrypt SMTP password
 */
function decryptPassword(encryptedPassword) {
  if (!encryptedPassword) return null;
  try {
    const parts = encryptedPassword.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Error decrypting password:', error);
    return null;
  }
}

/**
 * GET /api/smtp - Get SMTP settings for current user
 */
const getSmtpSettings = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const userId = req.user.isSuperAdmin ? null : req.user.id;
    const superAdminId = req.user.isSuperAdmin ? req.user.id : null;

    const smtpSettings = await prisma.smtpSettings.findMany({
      where: {
        ...(userId ? { userId } : { superAdminId }),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Decrypt passwords for display (but mask them)
    const settings = smtpSettings.map(setting => ({
      ...setting,
      password: setting.password ? '••••••••' : null, // Mask password
      decryptedPassword: null, // Don't send decrypted password
    }));

    return res.status(200).json({ success: true, data: settings });
  } catch (error) {
    console.error('Get SMTP settings error:', error);
    return res.status(500).json({ success: false, message: error?.message || 'Failed to get SMTP settings' });
  }
};

/**
 * GET /api/smtp/:id - Get single SMTP setting
 */
const getSmtpSetting = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params;
    const userId = req.user.isSuperAdmin ? null : req.user.id;
    const superAdminId = req.user.isSuperAdmin ? req.user.id : null;

    const smtpSetting = await prisma.smtpSettings.findFirst({
      where: {
        id,
        ...(userId ? { userId } : { superAdminId }),
      },
      include: {
        history: {
          orderBy: { createdAt: 'desc' },
          take: 10, // Last 10 changes
        },
      },
    });

    if (!smtpSetting) {
      return res.status(404).json({ success: false, message: 'SMTP setting not found' });
    }

    // Mask password
    const setting = {
      ...smtpSetting,
      password: smtpSetting.password ? '••••••••' : null,
    };

    return res.status(200).json({ success: true, data: setting });
  } catch (error) {
    console.error('Get SMTP setting error:', error);
    return res.status(500).json({ success: false, message: error?.message || 'Failed to get SMTP setting' });
  }
};

/**
 * POST /api/smtp - Create new SMTP settings
 */
const createSmtpSettings = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const {
      provider,
      host,
      port,
      secure,
      username,
      password,
      fromName,
      fromEmail,
      toEmail,
      isDefault,
    } = req.body;

    // Validation
    if (!provider || !host || !port || !username || !password || !fromEmail) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const userId = req.user.isSuperAdmin ? null : req.user.id;
    const superAdminId = req.user.isSuperAdmin ? req.user.id : null;

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.smtpSettings.updateMany({
        where: {
          ...(userId ? { userId } : { superAdminId }),
          isDefault: true,
        },
        data: { isDefault: false },
      });
    }

    // Encrypt password
    const encryptedPassword = encryptPassword(password);

    // Create SMTP settings
    const smtpSetting = await prisma.smtpSettings.create({
      data: {
        userId,
        superAdminId,
        provider,
        host,
        port: parseInt(port),
        secure: secure || false,
        username,
        password: encryptedPassword,
        fromName: fromName || 'SKYBER TECHNOLOGIES',
        fromEmail,
        toEmail: toEmail || req.user.email,
        isDefault: isDefault || false,
      },
    });

    // Create history entry
    await prisma.smtpSettingsHistory.create({
      data: {
        smtpSettingsId: smtpSetting.id,
        provider,
        host,
        port: parseInt(port),
        secure: secure || false,
        username,
        password: encryptedPassword,
        fromName: fromName || 'SKYBER TECHNOLOGIES',
        fromEmail,
        toEmail: toEmail || req.user.email,
        changedBy: req.user.id,
        changeType: 'created',
      },
    });

    // Log to JSON file
    logSmtpDetails({
      smtpId: smtpSetting.id,
      userId: req.user.id,
      action: 'created',
      settings: {
        provider,
        host,
        port: parseInt(port),
        secure: secure || false,
        username,
        fromName: fromName || 'SKYBER TECHNOLOGIES',
        fromEmail,
        toEmail: toEmail || req.user.email,
      },
    });

    return res.status(201).json({
      success: true,
      data: {
        ...smtpSetting,
        password: '••••••••', // Mask password
      },
    });
  } catch (error) {
    console.error('Create SMTP settings error:', error);
    return res.status(500).json({ success: false, message: error?.message || 'Failed to create SMTP settings' });
  }
};

/**
 * PUT /api/smtp/:id - Update SMTP settings
 */
const updateSmtpSettings = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params;
    const {
      provider,
      host,
      port,
      secure,
      username,
      password,
      fromName,
      fromEmail,
      toEmail,
      isDefault,
      isActive,
    } = req.body;

    const userId = req.user.isSuperAdmin ? null : req.user.id;
    const superAdminId = req.user.isSuperAdmin ? req.user.id : null;

    // Check if SMTP setting exists and belongs to user
    const existing = await prisma.smtpSettings.findFirst({
      where: {
        id,
        ...(userId ? { userId } : { superAdminId }),
      },
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: 'SMTP setting not found' });
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.smtpSettings.updateMany({
        where: {
          ...(userId ? { userId } : { superAdminId }),
          isDefault: true,
          id: { not: id },
        },
        data: { isDefault: false },
      });
    }

    // Prepare update data
    const updateData = {};
    if (provider !== undefined) updateData.provider = provider;
    if (host !== undefined) updateData.host = host;
    if (port !== undefined) updateData.port = parseInt(port);
    if (secure !== undefined) updateData.secure = secure;
    if (username !== undefined) updateData.username = username;
    if (password !== undefined) updateData.password = encryptPassword(password);
    if (fromName !== undefined) updateData.fromName = fromName;
    if (fromEmail !== undefined) updateData.fromEmail = fromEmail;
    if (toEmail !== undefined) updateData.toEmail = toEmail;
    if (isDefault !== undefined) updateData.isDefault = isDefault;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Update SMTP settings
    const updated = await prisma.smtpSettings.update({
      where: { id },
      data: updateData,
    });

    // Get full settings for history
    const fullSettings = await prisma.smtpSettings.findUnique({ where: { id } });

    // Create history entry
    await prisma.smtpSettingsHistory.create({
      data: {
        smtpSettingsId: id,
        provider: fullSettings.provider,
        host: fullSettings.host,
        port: fullSettings.port,
        secure: fullSettings.secure,
        username: fullSettings.username,
        password: fullSettings.password,
        fromName: fullSettings.fromName,
        fromEmail: fullSettings.fromEmail,
        toEmail: fullSettings.toEmail,
        changedBy: req.user.id,
        changeType: 'updated',
      },
    });

    // Log to JSON file
    logSmtpDetails({
      smtpId: id,
      userId: req.user.id,
      action: 'updated',
      settings: {
        provider: fullSettings.provider,
        host: fullSettings.host,
        port: fullSettings.port,
        secure: fullSettings.secure,
        username: fullSettings.username,
        fromName: fullSettings.fromName,
        fromEmail: fullSettings.fromEmail,
        toEmail: fullSettings.toEmail,
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        ...updated,
        password: '••••••••', // Mask password
      },
    });
  } catch (error) {
    console.error('Update SMTP settings error:', error);
    return res.status(500).json({ success: false, message: error?.message || 'Failed to update SMTP settings' });
  }
};

/**
 * DELETE /api/smtp/:id - Delete SMTP settings
 */
const deleteSmtpSettings = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params;
    const userId = req.user.isSuperAdmin ? null : req.user.id;
    const superAdminId = req.user.isSuperAdmin ? req.user.id : null;

    // Check if SMTP setting exists and belongs to user
    const existing = await prisma.smtpSettings.findFirst({
      where: {
        id,
        ...(userId ? { userId } : { superAdminId }),
      },
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: 'SMTP setting not found' });
    }

    // Get settings for logging before deletion
    const settingsForLog = {
      provider: existing.provider,
      host: existing.host,
      port: existing.port,
      secure: existing.secure,
      username: existing.username,
      fromName: existing.fromName,
      fromEmail: existing.fromEmail,
      toEmail: existing.toEmail,
    };

    // Delete SMTP settings (history will be cascade deleted)
    await prisma.smtpSettings.delete({
      where: { id },
    });

    // Log to JSON file
    logSmtpDetails({
      smtpId: id,
      userId: req.user.id,
      action: 'deleted',
      settings: settingsForLog,
    });

    return res.status(200).json({ success: true, message: 'SMTP settings deleted successfully' });
  } catch (error) {
    console.error('Delete SMTP settings error:', error);
    return res.status(500).json({ success: false, message: error?.message || 'Failed to delete SMTP settings' });
  }
};

/**
 * POST /api/smtp/:id/test - Test SMTP connection
 */
const testSmtpConnection = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params;
    const { toEmail } = req.body; // Optional test email recipient

    const userId = req.user.isSuperAdmin ? null : req.user.id;
    const superAdminId = req.user.isSuperAdmin ? req.user.id : null;

    // Get SMTP settings
    const smtpSetting = await prisma.smtpSettings.findFirst({
      where: {
        id,
        ...(userId ? { userId } : { superAdminId }),
      },
    });

    if (!smtpSetting) {
      return res.status(404).json({ success: false, message: 'SMTP setting not found' });
    }

    // Decrypt password for testing
    const decryptedPassword = decryptPassword(smtpSetting.password);

    // Test connection
    const recipientEmail = toEmail || smtpSetting.toEmail || req.user.email;
    console.log('Testing SMTP connection:', {
      smtpId: id,
      provider: smtpSetting.provider,
      host: smtpSetting.host,
      port: smtpSetting.port,
      fromEmail: smtpSetting.fromEmail,
      toEmail: recipientEmail,
    });

    const testResult = await testSmtpConnectionUtil({
      provider: smtpSetting.provider,
      host: smtpSetting.host,
      port: smtpSetting.port,
      secure: smtpSetting.secure,
      username: smtpSetting.username,
      password: decryptedPassword,
      fromName: smtpSetting.fromName,
      fromEmail: smtpSetting.fromEmail,
      toEmail: recipientEmail,
    });

    console.log('SMTP test result:', {
      success: testResult.success,
      error: testResult.error,
      message: testResult.message,
      details: testResult.details || null,
    });

    // Log recipient email for debugging
    console.log('Test email recipient:', recipientEmail);

    // Update test status in database
    await prisma.smtpSettings.update({
      where: { id },
      data: {
        lastTestStatus: testResult.success ? 'success' : 'failure',
        lastTestAt: new Date(),
        lastTestError: testResult.error || null,
      },
    });

    // Log to JSON file
    logSmtpDetails({
      smtpId: id,
      userId: req.user.id,
      action: 'tested',
      settings: {
        provider: smtpSetting.provider,
        host: smtpSetting.host,
        port: smtpSetting.port,
        secure: smtpSetting.secure,
        username: smtpSetting.username,
        fromName: smtpSetting.fromName,
        fromEmail: smtpSetting.fromEmail,
        toEmail: recipientEmail,
      },
      status: testResult.success ? 'success' : 'failure',
      error: testResult.error || null,
      message: testResult.message || null,
    });

    return res.status(200).json({
      success: testResult.success,
      message: testResult.message || (testResult.success 
        ? `Dispatched to ${recipientEmail}` 
        : 'SMTP connection test failed'),
      error: testResult.error || null,
      details: testResult.details || null,
    });
  } catch (error) {
    console.error('Test SMTP connection error:', error);
    return res.status(500).json({
      success: false,
      message: error?.message || 'Failed to test SMTP connection',
    });
  }
};

/**
 * GET /api/smtp/logs - Get SMTP logs
 */
const getSmtpLogsHandler = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { smtpId, limit } = req.query;

    const logs = getSmtpLogs({
      userId: req.user.id,
      smtpId,
      limit: limit ? parseInt(limit) : undefined,
    });

    return res.status(200).json({ success: true, data: logs });
  } catch (error) {
    console.error('Get SMTP logs error:', error);
    return res.status(500).json({ success: false, message: error?.message || 'Failed to get SMTP logs' });
  }
};

module.exports = {
  getSmtpSettings,
  getSmtpSetting,
  createSmtpSettings,
  updateSmtpSettings,
  deleteSmtpSettings,
  testSmtpConnection,
  getSmtpLogsHandler,
};

