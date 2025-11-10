const nodemailer = require('nodemailer');

/**
 * Test SMTP connection
 * @param {Object} smtpConfig - SMTP configuration
 * @param {string} smtpConfig.host - SMTP host
 * @param {number} smtpConfig.port - SMTP port
 * @param {boolean} smtpConfig.secure - Use TLS/SSL
 * @param {string} smtpConfig.username - SMTP username
 * @param {string} smtpConfig.password - SMTP password
 * @param {string} smtpConfig.fromEmail - From email address
 * @param {string} smtpConfig.toEmail - Test recipient email
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function testSmtpConnection(smtpConfig) {
  const { host, port, secure, username, password, fromEmail, toEmail } = smtpConfig;

  try {
    // Create transporter with improved TLS/SSL configuration
    const transporter = nodemailer.createTransport({
      host,
      port: parseInt(port),
      secure: secure || port === 465, // true for 465, false for other ports
      auth: {
        user: username,
        pass: password,
      },
      // TLS/SSL configuration
      tls: {
        // Do not fail on invalid certificates (some SMTP servers use self-signed certs)
        rejectUnauthorized: false,
        // Allow legacy TLS versions if needed
        minVersion: 'TLSv1',
      },
      // Add timeout
      connectionTimeout: 30000, // 30 seconds
      greetingTimeout: 30000,
      socketTimeout: 30000,
      // Debug mode (set to true for verbose logging)
      debug: true, // Enable debug to see SMTP conversation
      logger: {
        // Log SMTP conversation for debugging
        info: (log) => console.log('[SMTP INFO]', log),
        debug: (log) => console.log('[SMTP DEBUG]', log),
        warn: (log) => console.warn('[SMTP WARN]', log),
        error: (log) => console.error('[SMTP ERROR]', log),
      },
    });

    console.log('Attempting SMTP connection:', {
      host,
      port: parseInt(port),
      secure: secure || port === 465,
      fromEmail,
      toEmail,
      username,
    });

    // Verify connection
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('SMTP connection verified successfully');

    // Optionally send a test email
    if (toEmail) {
      const testEmail = {
        from: `"${smtpConfig.fromName || 'SKYBER TECHNOLOGIES'}" <${fromEmail}>`,
        to: toEmail,
        subject: 'SMTP Test Connection - SKYBER',
        text: 'This is a test email to verify SMTP configuration.',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #17D492;">SMTP Test Connection</h2>
            <p>This is a test email to verify your SMTP configuration is working correctly.</p>
            <p><strong>Provider:</strong> ${smtpConfig.provider || 'Custom'}</p>
            <p><strong>Host:</strong> ${host}</p>
            <p><strong>Port:</strong> ${port}</p>
            <p style="margin-top: 20px; color: #666; font-size: 12px;">
              If you received this email, your SMTP configuration is working correctly.
            </p>
          </div>
        `,
      };

      try {
        console.log('Sending test email:', {
          from: testEmail.from,
          to: testEmail.to,
          subject: testEmail.subject,
        });

        const info = await transporter.sendMail(testEmail);
        
        console.log('Test email send result:', {
          messageId: info.messageId,
          accepted: info.accepted,
          rejected: info.rejected,
          pending: info.pending,
          response: info.response,
          envelope: info.envelope,
        });

        // Check if email was actually accepted
        if (info.rejected && info.rejected.length > 0) {
          console.error('Email was rejected:', info.rejected);
          return {
            success: false,
            error: `Email was rejected by server. Rejected recipients: ${info.rejected.join(', ')}. Response: ${info.response || 'No response'}`,
          };
        }

        if (!info.accepted || info.accepted.length === 0) {
          console.error('Email was not accepted by server');
          return {
            success: false,
            error: `Email was not accepted by the server. Please check the recipient email address: ${toEmail}. Server response: ${info.response || 'No response'}`,
          };
        }

        // Log successful send with all details
        console.log('✅ Email accepted by SMTP server:', {
          recipient: toEmail,
          messageId: info.messageId,
          serverResponse: info.response,
          acceptedRecipients: info.accepted,
        });

        // Email was accepted, but note that acceptance doesn't guarantee delivery
        // Some providers (like Brevo) may accept the email but it could still be:
        // 1. In transit (delayed delivery)
        // 2. Blocked by recipient server
        // 3. Filtered to spam
        // 4. Rejected by recipient server after acceptance
        return {
          success: true,
          message: `Dispatched to ${toEmail}`,
          details: {
            messageId: info.messageId,
            accepted: info.accepted,
            response: info.response,
          },
        };
      } catch (emailError) {
        console.error('Error sending test email:', emailError);
        return {
          success: false,
          error: `Failed to send test email: ${emailError.message || 'Unknown error'}. Connection verified but email sending failed.`,
        };
      }
    }

    return { success: true, message: 'SMTP connection verified successfully.' };
  } catch (error) {
    console.error('SMTP test connection error:', error);
    return {
      success: false,
      error: error.message || 'Failed to connect to SMTP server',
    };
  }
}

module.exports = {
  testSmtpConnection,
};

