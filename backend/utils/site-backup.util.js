const fs = require('fs').promises;
const path = require('path');

const SITE_CHANGES_DIR = path.join(__dirname, '../site-changes');
const DEFAULT_CONFIG_PATH = path.join(SITE_CHANGES_DIR, 'default.json');
const MAX_BACKUPS = 5;

/**
 * Get current site configuration from default.json
 */
async function getCurrentConfig() {
  try {
    const data = await fs.readFile(DEFAULT_CONFIG_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading default config:', error);
    throw new Error('Failed to read current configuration');
  }
}

/**
 * Save new configuration and create backup
 */
async function saveConfig(newConfig) {
  try {
    const now = new Date();
    const dateOnly = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const timestamp = now.toISOString();
    
    // Create filename based on date only
    const backupFilename = `skyber-${dateOnly}.json`;
    const backupPath = path.join(SITE_CHANGES_DIR, backupFilename);

    // Read current config to save
    const currentConfig = await getCurrentConfig();
    
    // Check if today's backup file already exists
    let backupData;
    try {
      const existingBackup = await fs.readFile(backupPath, 'utf8');
      backupData = JSON.parse(existingBackup);
      
      // Add new change log entry
      backupData.changeLog.push({
        timestamp: timestamp,
        previousConfig: currentConfig,
        note: 'Configuration updated'
      });
      
      // Update the latest config
      backupData.latestConfig = newConfig;
      backupData.lastModified = timestamp;
      
    } catch (error) {
      // File doesn't exist, create new backup structure
      backupData = {
        date: dateOnly,
        createdAt: timestamp,
        lastModified: timestamp,
        latestConfig: newConfig,
        changeLog: [
          {
            timestamp: timestamp,
            previousConfig: currentConfig,
            note: 'Initial backup for this day'
          }
        ]
      };
    }
    
    // Save the backup file with change log
    await fs.writeFile(backupPath, JSON.stringify(backupData, null, 2), 'utf8');

    // Merge new config with existing config (don't overwrite other sections)
    const existingConfig = await getCurrentConfig().catch(() => ({}));
    const configToSave = {
      ...existingConfig,
      ...newConfig,
      lastModified: timestamp,
      version: '1.0.0'
    };
    await fs.writeFile(DEFAULT_CONFIG_PATH, JSON.stringify(configToSave, null, 2), 'utf8');

    // Clean up old backups (keep only 5 latest days)
    await cleanupOldBackups();

    return {
      success: true,
      backupFile: backupFilename,
      timestamp: timestamp,
      changeCount: backupData.changeLog.length
    };
  } catch (error) {
    console.error('Error saving config:', error);
    throw new Error('Failed to save configuration');
  }
}

/**
 * Get list of all backups
 */
async function listBackups() {
  try {
    const files = await fs.readdir(SITE_CHANGES_DIR);
    const backupFiles = [];
    
    for (const file of files) {
      if (file.startsWith('skyber-') && file.endsWith('.json')) {
        const backupPath = path.join(SITE_CHANGES_DIR, file);
        const backupContent = await fs.readFile(backupPath, 'utf8');
        const backupData = JSON.parse(backupContent);
        
        backupFiles.push({
          filename: file,
          date: backupData.date,
          createdAt: backupData.createdAt,
          lastModified: backupData.lastModified,
          changeCount: backupData.changeLog.length,
          path: backupPath
        });
      }
    }
    
    // Sort by date (newest first) and keep only 5 latest days
    backupFiles.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
    
    return backupFiles.slice(0, MAX_BACKUPS);
  } catch (error) {
    console.error('Error listing backups:', error);
    throw new Error('Failed to list backups');
  }
}

/**
 * Restore configuration from backup
 */
async function restoreFromBackup(filename) {
  try {
    const backupPath = path.join(SITE_CHANGES_DIR, filename);
    
    // Check if backup exists
    try {
      await fs.access(backupPath);
    } catch {
      throw new Error('Backup file not found');
    }

    // Read backup file
    const backupData = await fs.readFile(backupPath, 'utf8');
    const backupContent = JSON.parse(backupData);
    
    // Get the latest config from the backup file
    const configToRestore = backupContent.latestConfig;

    // Save current config as a new backup before restoring
    await saveConfig(configToRestore);

    return {
      success: true,
      restoredFrom: filename,
      date: backupContent.date,
      changeCount: backupContent.changeLog.length,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error restoring from backup:', error);
    throw new Error(`Failed to restore from backup: ${error.message}`);
  }
}

/**
 * Clean up old backups, keeping only MAX_BACKUPS latest
 */
async function cleanupOldBackups() {
  try {
    const files = await fs.readdir(SITE_CHANGES_DIR);
    const backupFiles = files
      .filter(file => file.startsWith('skyber-') && file.endsWith('.json'))
      .map(file => ({
        name: file,
        path: path.join(SITE_CHANGES_DIR, file),
        stats: null
      }));

    // Get file stats to sort by creation time
    for (let file of backupFiles) {
      file.stats = await fs.stat(file.path);
    }

    // Sort by creation time (newest first)
    backupFiles.sort((a, b) => b.stats.birthtimeMs - a.stats.birthtimeMs);

    // Delete files beyond MAX_BACKUPS
    const filesToDelete = backupFiles.slice(MAX_BACKUPS);
    for (let file of filesToDelete) {
      await fs.unlink(file.path);
      console.log(`Deleted old backup: ${file.name}`);
    }
  } catch (error) {
    console.error('Error cleaning up old backups:', error);
    // Don't throw - this is a cleanup operation
  }
}

module.exports = {
  getCurrentConfig,
  saveConfig,
  listBackups,
  restoreFromBackup,
  cleanupOldBackups
};
