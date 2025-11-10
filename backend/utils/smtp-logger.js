const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, '../smtp-details');
const LOG_FILE = path.join(LOG_DIR, 'details-log.json');

// Ensure directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Initialize log file if it doesn't exist
if (!fs.existsSync(LOG_FILE)) {
  fs.writeFileSync(LOG_FILE, JSON.stringify([], null, 2));
}

/**
 * Log SMTP settings change to JSON file
 * @param {Object} logData - SMTP settings data to log
 * @param {string} logData.smtpId - SMTP settings ID
 * @param {string} logData.userId - User ID who made the change
 * @param {string} logData.action - Action type (created, updated, deleted, tested)
 * @param {Object} logData.settings - SMTP settings snapshot
 * @param {string} logData.status - Test status (success, failure) if action is 'tested'
 * @param {string} logData.error - Error message if test failed
 */
function logSmtpDetails(logData) {
  try {
    const { smtpId, userId, action, settings, status, error } = logData;
    
    const logEntry = {
      id: require('crypto').randomBytes(16).toString('hex'),
      smtpId,
      userId,
      action,
      timestamp: new Date().toISOString(),
      settings: {
        provider: settings.provider,
        host: settings.host,
        port: settings.port,
        secure: settings.secure,
        username: settings.username,
        // Don't log password for security, just indicate if it was changed
        passwordChanged: action === 'created' || action === 'updated',
        fromName: settings.fromName,
        fromEmail: settings.fromEmail,
        toEmail: settings.toEmail,
      },
      ...(action === 'tested' && {
        testStatus: status,
        testError: error || null,
      }),
    };

    // Read existing logs
    let logs = [];
    try {
      const fileContent = fs.readFileSync(LOG_FILE, 'utf8');
      logs = JSON.parse(fileContent);
    } catch (err) {
      console.error('Error reading SMTP log file:', err);
      logs = [];
    }

    // Add new log entry
    logs.push(logEntry);

    // Keep only last 1000 entries to prevent file from growing too large
    if (logs.length > 1000) {
      logs = logs.slice(-1000);
    }

    // Write back to file
    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
    
    return logEntry;
  } catch (error) {
    console.error('Error logging SMTP details:', error);
    throw error;
  }
}

/**
 * Get SMTP logs
 * @param {Object} options - Query options
 * @param {string} options.smtpId - Filter by SMTP ID
 * @param {string} options.userId - Filter by User ID
 * @param {number} options.limit - Limit number of results
 */
function getSmtpLogs(options = {}) {
  try {
    const fileContent = fs.readFileSync(LOG_FILE, 'utf8');
    let logs = JSON.parse(fileContent);

    // Filter by smtpId if provided
    if (options.smtpId) {
      logs = logs.filter(log => log.smtpId === options.smtpId);
    }

    // Filter by userId if provided
    if (options.userId) {
      logs = logs.filter(log => log.userId === options.userId);
    }

    // Sort by timestamp (newest first)
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Limit results
    if (options.limit) {
      logs = logs.slice(0, options.limit);
    }

    return logs;
  } catch (error) {
    console.error('Error reading SMTP logs:', error);
    return [];
  }
}

module.exports = {
  logSmtpDetails,
  getSmtpLogs,
};

