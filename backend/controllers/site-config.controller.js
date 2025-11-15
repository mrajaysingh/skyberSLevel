const siteBackupUtil = require('../utils/site-backup.util');

/**
 * Get current site configuration
 */
async function getCurrentConfig(req, res) {
  try {
    const config = await siteBackupUtil.getCurrentConfig();
    res.json({
      success: true,
      data: config
    });
  } catch (error) {
    console.error('Error getting current config:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * Save site configuration and create backup
 */
async function saveConfig(req, res) {
  try {
    const { header, hero, logoLoop, about, founder, trucomm, whyChooseUs, clientTestimonials, stayUpdated } = req.body;

    // Allow saving header, hero, logoLoop, about, founder, trucomm, whyChooseUs, clientTestimonials, stayUpdated, or any combination
    const configToSave = {};
    if (header) {
      configToSave.header = header;
    }
    if (hero) {
      configToSave.hero = hero;
    }
    if (logoLoop) {
      configToSave.logoLoop = logoLoop;
    }
    if (about) {
      configToSave.about = about;
    }
    if (founder) {
      configToSave.founder = founder;
    }
    if (trucomm) {
      configToSave.trucomm = trucomm;
    }
    if (whyChooseUs) {
      configToSave.whyChooseUs = whyChooseUs;
    }
    if (clientTestimonials) {
      configToSave.clientTestimonials = clientTestimonials;
    }
    if (stayUpdated) {
      configToSave.stayUpdated = stayUpdated;
    }

    if (Object.keys(configToSave).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one configuration (header, hero, logoLoop, about, founder, trucomm, whyChooseUs, clientTestimonials, or stayUpdated) is required'
      });
    }

    const result = await siteBackupUtil.saveConfig(configToSave);
    
    res.json({
      success: true,
      data: result,
      message: 'Configuration saved successfully'
    });
  } catch (error) {
    console.error('Error saving config:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * List all available backups
 */
async function listBackups(req, res) {
  try {
    const backups = await siteBackupUtil.listBackups();
    
    res.json({
      success: true,
      data: backups,
      count: backups.length
    });
  } catch (error) {
    console.error('Error listing backups:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * Restore configuration from backup
 */
async function restoreBackup(req, res) {
  try {
    const { filename } = req.params;

    if (!filename) {
      return res.status(400).json({
        success: false,
        error: 'Backup filename is required'
      });
    }

    const result = await siteBackupUtil.restoreFromBackup(filename);
    
    res.json({
      success: true,
      data: result,
      message: 'Configuration restored successfully'
    });
  } catch (error) {
    console.error('Error restoring backup:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

module.exports = {
  getCurrentConfig,
  saveConfig,
  listBackups,
  restoreBackup
};
