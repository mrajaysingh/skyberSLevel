const { prisma } = require('../config/database');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Encryption key from environment (should match smtp.controller.js)
function deriveKey(keyString) {
  if (!keyString) {
    return crypto.randomBytes(32);
  }
  if (keyString.length === 64 && /^[0-9a-fA-F]+$/.test(keyString)) {
    return Buffer.from(keyString, 'hex');
  }
  return crypto.createHash('sha256').update(keyString).digest();
}

const ENCRYPTION_KEY = deriveKey(process.env.SMTP_ENCRYPTION_KEY);
const ALGORITHM = 'aes-256-cbc';

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
 * POST /api/email/send - Send email
 */
const sendEmail = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { to, cc, bcc, subject, html, text, smtpId, scheduledFor } = req.body;

    // Validation
    if (!to || !subject || (!html && !text)) {
      return res.status(400).json({ success: false, message: 'Missing required fields: to, subject, html/text' });
    }

    const userId = req.user.isSuperAdmin ? null : req.user.id;
    const superAdminId = req.user.isSuperAdmin ? req.user.id : null;

    // Get default SMTP settings if not specified
    let smtpSetting;
    if (smtpId) {
      smtpSetting = await prisma.smtpSettings.findFirst({
        where: {
          id: smtpId,
          ...(userId ? { userId } : { superAdminId }),
        },
      });
    } else {
      smtpSetting = await prisma.smtpSettings.findFirst({
        where: {
          ...(userId ? { userId } : { superAdminId }),
          isDefault: true,
          isActive: true,
        },
      });
    }

    if (!smtpSetting) {
      return res.status(404).json({ success: false, message: 'No active SMTP settings found. Please configure SMTP first.' });
    }

    // If scheduled, save as scheduled email
    if (scheduledFor) {
      const scheduledEmail = await prisma.email.create({
        data: {
          userId,
          superAdminId,
          smtpSettingsId: smtpSetting.id,
          to,
          cc: cc || null,
          bcc: bcc || null,
          subject,
          html: html || null,
          text: text || null,
          status: 'scheduled',
          scheduledFor: new Date(scheduledFor),
        },
      });

      return res.status(200).json({
        success: true,
        message: 'Email scheduled successfully',
        data: scheduledEmail,
      });
    }

    // Send email immediately
    try {
      const decryptedPassword = decryptPassword(smtpSetting.password);
      
      const transporter = nodemailer.createTransport({
        host: smtpSetting.host,
        port: smtpSetting.port,
        secure: smtpSetting.secure || smtpSetting.port === 465,
        auth: {
          user: smtpSetting.username,
          pass: decryptedPassword,
        },
        tls: {
          rejectUnauthorized: false,
          minVersion: 'TLSv1',
        },
        connectionTimeout: 30000,
        greetingTimeout: 30000,
        socketTimeout: 30000,
      });

      const mailOptions = {
        from: `"${smtpSetting.fromName}" <${smtpSetting.fromEmail}>`,
        to,
        ...(cc && { cc }),
        ...(bcc && { bcc }),
        subject,
        ...(html && { html }),
        ...(text && { text }),
      };

      const info = await transporter.sendMail(mailOptions);

      // Save sent email to database
      const email = await prisma.email.create({
        data: {
          userId,
          superAdminId,
          smtpSettingsId: smtpSetting.id,
          to,
          cc: cc || null,
          bcc: bcc || null,
          subject,
          html: html || null,
          text: text || null,
          status: 'sent',
          messageId: info.messageId || null,
          sentAt: new Date(),
        },
      });

      return res.status(200).json({
        success: true,
        message: 'Email sent successfully',
        data: {
          ...email,
          messageId: info.messageId,
        },
      });
    } catch (error) {
      console.error('Email send error:', error);

      // Save failed email to database
      const email = await prisma.email.create({
        data: {
          userId,
          superAdminId,
          smtpSettingsId: smtpSetting.id,
          to,
          cc: cc || null,
          bcc: bcc || null,
          subject,
          html: html || null,
          text: text || null,
          status: 'failed',
          error: error.message || 'Failed to send email',
        },
      });

      return res.status(500).json({
        success: false,
        message: 'Failed to send email',
        error: error.message || 'Unknown error',
        data: email,
      });
    }
  } catch (error) {
    console.error('Send email error:', error);
    return res.status(500).json({ success: false, message: error?.message || 'Failed to send email' });
  }
};

/**
 * POST /api/email/draft - Save draft email
 */
const saveDraft = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id, to, cc, bcc, subject, html, text } = req.body;

    const userId = req.user.isSuperAdmin ? null : req.user.id;
    const superAdminId = req.user.isSuperAdmin ? req.user.id : null;

    let draft;
    if (id) {
      // Update existing draft
      draft = await prisma.emailDraft.update({
        where: { id },
        data: {
          to: to || null,
          cc: cc || null,
          bcc: bcc || null,
          subject: subject || null,
          html: html || null,
          text: text || null,
        },
      });
    } else {
      // Create new draft
      draft = await prisma.emailDraft.create({
        data: {
          userId,
          superAdminId,
          to: to || null,
          cc: cc || null,
          bcc: bcc || null,
          subject: subject || null,
          html: html || null,
          text: text || null,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: id ? 'Draft updated successfully' : 'Draft saved successfully',
      data: draft,
    });
  } catch (error) {
    console.error('Save draft error:', error);
    return res.status(500).json({ success: false, message: error?.message || 'Failed to save draft' });
  }
};

/**
 * GET /api/email/drafts - Get all drafts
 */
const getDrafts = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const userId = req.user.isSuperAdmin ? null : req.user.id;
    const superAdminId = req.user.isSuperAdmin ? req.user.id : null;

    const drafts = await prisma.emailDraft.findMany({
      where: {
        ...(userId ? { userId } : { superAdminId }),
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return res.status(200).json({ success: true, data: drafts });
  } catch (error) {
    console.error('Get drafts error:', error);
    return res.status(500).json({ success: false, message: error?.message || 'Failed to get drafts' });
  }
};

/**
 * GET /api/email/drafts/:id - Get single draft
 */
const getDraft = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params;
    const userId = req.user.isSuperAdmin ? null : req.user.id;
    const superAdminId = req.user.isSuperAdmin ? req.user.id : null;

    const draft = await prisma.emailDraft.findFirst({
      where: {
        id,
        ...(userId ? { userId } : { superAdminId }),
      },
    });

    if (!draft) {
      return res.status(404).json({ success: false, message: 'Draft not found' });
    }

    return res.status(200).json({ success: true, data: draft });
  } catch (error) {
    console.error('Get draft error:', error);
    return res.status(500).json({ success: false, message: error?.message || 'Failed to get draft' });
  }
};

/**
 * DELETE /api/email/drafts/:id - Delete draft
 */
const deleteDraft = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params;
    const userId = req.user.isSuperAdmin ? null : req.user.id;
    const superAdminId = req.user.isSuperAdmin ? req.user.id : null;

    const draft = await prisma.emailDraft.findFirst({
      where: {
        id,
        ...(userId ? { userId } : { superAdminId }),
      },
    });

    if (!draft) {
      return res.status(404).json({ success: false, message: 'Draft not found' });
    }

    await prisma.emailDraft.delete({
      where: { id },
    });

    return res.status(200).json({ success: true, message: 'Draft deleted successfully' });
  } catch (error) {
    console.error('Delete draft error:', error);
    return res.status(500).json({ success: false, message: error?.message || 'Failed to delete draft' });
  }
};

/**
 * GET /api/email/sent - Get sent emails
 */
const getSentEmails = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { limit = 50, offset = 0, status } = req.query;
    const userId = req.user.isSuperAdmin ? null : req.user.id;
    const superAdminId = req.user.isSuperAdmin ? req.user.id : null;

    const where = {
      ...(userId ? { userId } : { superAdminId }),
      ...(status && { status }),
    };

    const emails = await prisma.email.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: parseInt(limit),
      skip: parseInt(offset),
      include: {
        smtpSettings: {
          select: {
            provider: true,
            fromEmail: true,
            fromName: true,
          },
        },
      },
    });

    const total = await prisma.email.count({ where });

    return res.status(200).json({
      success: true,
      data: emails,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.error('Get sent emails error:', error);
    return res.status(500).json({ success: false, message: error?.message || 'Failed to get sent emails' });
  }
};

/**
 * GET /api/email/scheduled - Get scheduled emails
 */
const getScheduledEmails = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const userId = req.user.isSuperAdmin ? null : req.user.id;
    const superAdminId = req.user.isSuperAdmin ? req.user.id : null;

    const emails = await prisma.email.findMany({
      where: {
        ...(userId ? { userId } : { superAdminId }),
        status: 'scheduled',
      },
      orderBy: {
        scheduledFor: 'asc',
      },
      include: {
        smtpSettings: {
          select: {
            provider: true,
            fromEmail: true,
            fromName: true,
          },
        },
      },
    });

    return res.status(200).json({ success: true, data: emails });
  } catch (error) {
    console.error('Get scheduled emails error:', error);
    return res.status(500).json({ success: false, message: error?.message || 'Failed to get scheduled emails' });
  }
};

/**
 * DELETE /api/email/scheduled/:id - Cancel scheduled email
 */
const cancelScheduledEmail = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params;
    const userId = req.user.isSuperAdmin ? null : req.user.id;
    const superAdminId = req.user.isSuperAdmin ? req.user.id : null;

    const email = await prisma.email.findFirst({
      where: {
        id,
        ...(userId ? { userId } : { superAdminId }),
        status: 'scheduled',
      },
    });

    if (!email) {
      return res.status(404).json({ success: false, message: 'Scheduled email not found' });
    }

    await prisma.email.delete({
      where: { id },
    });

    return res.status(200).json({ success: true, message: 'Scheduled email cancelled successfully' });
  } catch (error) {
    console.error('Cancel scheduled email error:', error);
    return res.status(500).json({ success: false, message: error?.message || 'Failed to cancel scheduled email' });
  }
};

/**
 * Process scheduled emails - checks for emails that should be sent now
 * This function is called by the scheduler
 */
const processScheduledEmails = async () => {
  try {
    const now = new Date();
    
    // Find all scheduled emails where scheduledFor <= now
    const scheduledEmails = await prisma.email.findMany({
      where: {
        status: 'scheduled',
        scheduledFor: {
          lte: now,
        },
      },
      include: {
        smtpSettings: true,
      },
    });

    if (scheduledEmails.length === 0) {
      return; // No emails to process
    }

    console.log(`📧 Processing ${scheduledEmails.length} scheduled email(s)...`);

    for (const email of scheduledEmails) {
      try {
        // Check if SMTP settings still exist
        if (!email.smtpSettings) {
          await prisma.email.update({
            where: { id: email.id },
            data: {
              status: 'failed',
              error: 'SMTP settings not found',
            },
          });
          console.error(`❌ Email ${email.id}: SMTP settings not found`);
          continue;
        }

        const decryptedPassword = decryptPassword(email.smtpSettings.password);
        
        if (!decryptedPassword) {
          await prisma.email.update({
            where: { id: email.id },
            data: {
              status: 'failed',
              error: 'Failed to decrypt SMTP password',
            },
          });
          console.error(`❌ Email ${email.id}: Failed to decrypt password`);
          continue;
        }

        const transporter = nodemailer.createTransport({
          host: email.smtpSettings.host,
          port: email.smtpSettings.port,
          secure: email.smtpSettings.secure || email.smtpSettings.port === 465,
          auth: {
            user: email.smtpSettings.username,
            pass: decryptedPassword,
          },
          tls: {
            rejectUnauthorized: false,
            minVersion: 'TLSv1',
          },
          connectionTimeout: 30000,
          greetingTimeout: 30000,
          socketTimeout: 30000,
        });

        const mailOptions = {
          from: `"${email.smtpSettings.fromName}" <${email.smtpSettings.fromEmail}>`,
          to: email.to,
          ...(email.cc && { cc: email.cc }),
          ...(email.bcc && { bcc: email.bcc }),
          subject: email.subject,
          ...(email.html && { html: email.html }),
          ...(email.text && { text: email.text }),
        };

        const info = await transporter.sendMail(mailOptions);

        // Update email status to sent
        await prisma.email.update({
          where: { id: email.id },
          data: {
            status: 'sent',
            messageId: info.messageId || null,
            sentAt: new Date(),
          },
        });

        console.log(`✅ Email ${email.id} sent successfully to ${email.to}`);
      } catch (error) {
        console.error(`❌ Error sending scheduled email ${email.id}:`, error);
        
        // Update email status to failed
        await prisma.email.update({
          where: { id: email.id },
          data: {
            status: 'failed',
            error: error.message || 'Failed to send email',
          },
        });
      }
    }
  } catch (error) {
    console.error('Error processing scheduled emails:', error);
  }
};

module.exports = {
  sendEmail,
  saveDraft,
  getDrafts,
  getDraft,
  deleteDraft,
  getSentEmails,
  getScheduledEmails,
  cancelScheduledEmail,
  processScheduledEmails,
};

