const { prisma } = require('../config/database');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

/**
 * POST /api/newsletter/subscribe - Subscribe to newsletter
 */
const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    // Validation
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Valid email is required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if already subscribed
    const existing = await prisma.newsletterSubscription.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      if (existing.status === 'active') {
        return res.status(200).json({
          success: true,
          message: 'You are already subscribed to our newsletter',
          data: existing,
        });
      } else {
        // Re-subscribe
        const updated = await prisma.newsletterSubscription.update({
          where: { email: normalizedEmail },
          data: {
            status: 'active',
            unsubscribedAt: null,
            subscribedAt: new Date(),
          },
        });

        // Send welcome email
        await sendWelcomeEmail(normalizedEmail);

        return res.status(200).json({
          success: true,
          message: 'Successfully re-subscribed to newsletter',
          data: updated,
        });
      }
    }

    // Create new subscription
    const subscription = await prisma.newsletterSubscription.create({
      data: {
        email: normalizedEmail,
        status: 'active',
        source: req.headers['user-agent']?.includes('Mozilla') ? 'website' : 'api',
        ipAddress: req.ip || req.connection?.remoteAddress,
        userAgent: req.headers['user-agent'],
      },
    });

    // Send welcome email
    await sendWelcomeEmail(normalizedEmail);

    return res.status(200).json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      data: subscription,
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return res.status(500).json({
      success: false,
      message: error?.message || 'Failed to subscribe to newsletter',
    });
  }
};

/**
 * POST /api/newsletter/unsubscribe - Unsubscribe from newsletter
 */
const unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Valid email is required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const subscription = await prisma.newsletterSubscription.findUnique({
      where: { email: normalizedEmail },
    });

    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Email not found in subscriptions' });
    }

    if (subscription.status === 'unsubscribed') {
      return res.status(200).json({
        success: true,
        message: 'You are already unsubscribed',
      });
    }

    await prisma.newsletterSubscription.update({
      where: { email: normalizedEmail },
      data: {
        status: 'unsubscribed',
        unsubscribedAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Successfully unsubscribed from newsletter',
    });
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return res.status(500).json({
      success: false,
      message: error?.message || 'Failed to unsubscribe from newsletter',
    });
  }
};

/**
 * GET /api/newsletter/subscribers - Get all subscribers (admin only)
 */
const getSubscribers = async (req, res) => {
  try {
    if (!req.user?.isSuperAdmin) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const { status, limit = 100, offset = 0 } = req.query;

    const where = {};
    if (status) {
      where.status = status;
    }

    const subscribers = await prisma.newsletterSubscription.findMany({
      where,
      orderBy: { subscribedAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset),
    });

    const total = await prisma.newsletterSubscription.count({ where });

    return res.status(200).json({
      success: true,
      data: subscribers,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.error('Get subscribers error:', error);
    return res.status(500).json({
      success: false,
      message: error?.message || 'Failed to get subscribers',
    });
  }
};

/**
 * Decrypt SMTP password (same as email.controller.js)
 */
function deriveKey(keyString) {
  if (!keyString) {
    return crypto.randomBytes(32);
  }
  if (keyString.length === 64 && /^[0-9a-fA-F]+$/.test(keyString)) {
    return Buffer.from(keyString, 'hex');
  }
  return crypto.createHash('sha256').update(keyString).digest();
}

function decryptPassword(encryptedPassword) {
  if (!encryptedPassword) return null;
  try {
    const parts = encryptedPassword.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const ENCRYPTION_KEY = deriveKey(process.env.SMTP_ENCRYPTION_KEY);
    const ALGORITHM = 'aes-256-cbc';
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
 * Log newsletter email to Sent Emails table
 */
const logNewsletterEmail = async (to, smtpSettingsId, subject, html, status, messageId, error) => {
  try {
    // Get a super admin ID for logging (use the first super admin or null)
    const superAdmin = await prisma.superAdmin.findFirst({
      where: { isActive: true },
      select: { id: true },
    });

    await prisma.email.create({
      data: {
        superAdminId: superAdmin?.id || null,
        smtpSettingsId: smtpSettingsId || null,
        to: to,
        subject: subject || 'Newsletter Welcome Email',
        html: html || null,
        status: status || 'failed',
        messageId: messageId || null,
        error: error || null,
        sentAt: status === 'sent' ? new Date() : null,
      },
    });
  } catch (error) {
    console.error('Error logging newsletter email to database:', error);
    // Don't throw - this is just logging
  }
};

/**
 * Send welcome email to new subscriber and log to Sent Emails
 */
const sendWelcomeEmail = async (email) => {
  let smtpSetting = null;
  let subject = '';
  let html = '';
  let messageId = null;
  let errorMessage = null;

  try {
    // Get default SMTP settings
    smtpSetting = await prisma.smtpSettings.findFirst({
      where: {
        superAdminId: { not: null },
        isDefault: true,
        isActive: true,
      },
    });

    if (!smtpSetting) {
      console.warn('No default SMTP settings found, skipping welcome email');
      errorMessage = 'No default SMTP settings found';
      // Still log the attempt to database
      await logNewsletterEmail(email, null, 'Welcome to SKYBER Newsletter!', null, 'failed', null, errorMessage);
      return;
    }

    // Get newsletter welcome template or use default
    let template = await prisma.emailTemplate.findFirst({
      where: {
        superAdminId: { not: null },
        category: 'newsletter',
        name: { contains: 'welcome' },
        isActive: true,
      },
    });

    if (!template) {
      // Use default template
      const defaultSubject = 'Welcome to SKYBER Newsletter!';
      const defaultHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to SKYBER Newsletter</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #17D492 0%, #14c082 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Welcome to SKYBER!</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; margin-bottom: 20px;">Thank you for subscribing to our newsletter!</p>
            <p style="font-size: 16px; margin-bottom: 20px;">You'll now receive:</p>
            <ul style="font-size: 16px; margin-bottom: 20px;">
              <li>Weekly cybersecurity insights and updates</li>
              <li>Exclusive offers and early access to new features</li>
              <li>Expert tips and best practices</li>
            </ul>
            <p style="font-size: 16px; margin-bottom: 20px;">We're excited to have you on board!</p>
            <p style="font-size: 14px; color: #666; margin-top: 30px;">Best regards,<br>The SKYBER Team</p>
          </div>
        </body>
        </html>
      `;

      // Send email using the email controller
      const req = {
        user: { id: smtpSetting.superAdminId, isSuperAdmin: true },
        body: {
          to: email,
          subject: defaultSubject,
          html: defaultHtml,
          smtpId: smtpSetting.id,
        },
      };

      const decryptedPassword = decryptPassword(smtpSetting.password);
      if (!decryptedPassword) {
        console.error('Failed to decrypt SMTP password');
        errorMessage = 'Failed to decrypt SMTP password';
        await logNewsletterEmail(email, smtpSetting.id, defaultSubject, defaultHtml, 'failed', null, errorMessage);
        return;
      }

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

      try {
        const mailResult = await transporter.sendMail({
          from: `"${smtpSetting.fromName}" <newsletter@skyber.dev>`,
          to: email,
          subject: defaultSubject,
          html: defaultHtml,
        });

        messageId = mailResult.messageId;
        subject = defaultSubject;
        html = defaultHtml;

        // Log successful email to database
        await logNewsletterEmail(email, smtpSetting.id, subject, html, 'sent', messageId, null);
        console.log(`✅ Welcome email sent to ${email} - logged to Sent Emails`);
      } catch (sendError) {
        errorMessage = sendError.message || 'Failed to send email';
        subject = defaultSubject;
        html = defaultHtml;
        // Log failed email to database
        await logNewsletterEmail(email, smtpSetting.id, subject, html, 'failed', null, errorMessage);
        console.error(`❌ Failed to send welcome email to ${email}:`, errorMessage);
        throw sendError; // Re-throw to be caught by outer catch
      }
    } else {
      // Use template with variable replacement
      let subject = template.subject;
      let html = template.html;

      // Replace variables (for now, just basic replacements)
      // In the future, we can add more sophisticated variable handling
      html = html.replace(/{email}/g, email);
      html = html.replace(/{username}/g, email.split('@')[0]);

      const decryptedPassword = decryptPassword(smtpSetting.password);
      if (!decryptedPassword) {
        console.error('Failed to decrypt SMTP password');
        errorMessage = 'Failed to decrypt SMTP password';
        await logNewsletterEmail(email, smtpSetting.id, subject, html, 'failed', null, errorMessage);
        return;
      }

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

      try {
        const mailResult = await transporter.sendMail({
          from: `"${smtpSetting.fromName}" <newsletter@skyber.dev>`,
          to: email,
          subject: subject,
          html: html,
        });

        messageId = mailResult.messageId;

        // Log successful email to database
        await logNewsletterEmail(email, smtpSetting.id, subject, html, 'sent', messageId, null);
        console.log(`✅ Welcome email sent to ${email} using template - logged to Sent Emails`);
      } catch (sendError) {
        errorMessage = sendError.message || 'Failed to send email';
        // Log failed email to database
        await logNewsletterEmail(email, smtpSetting.id, subject, html, 'failed', null, errorMessage);
        console.error(`❌ Failed to send welcome email to ${email}:`, errorMessage);
        throw sendError; // Re-throw to be caught by outer catch
      }
    }
  } catch (error) {
    console.error('Error sending welcome email:', error);
    errorMessage = error.message || 'Failed to send welcome email';
    
    // Log failed email to database
    if (smtpSetting) {
      await logNewsletterEmail(email, smtpSetting.id, subject || 'Welcome to SKYBER Newsletter!', html || null, 'failed', null, errorMessage);
    } else {
      await logNewsletterEmail(email, null, 'Welcome to SKYBER Newsletter!', null, 'failed', null, errorMessage);
    }
    // Don't throw - subscription should still succeed even if email fails
  }
};

module.exports = {
  subscribe,
  unsubscribe,
  getSubscribers,
};

