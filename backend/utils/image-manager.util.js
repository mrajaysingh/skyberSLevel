const fs = require('fs').promises;
const path = require('path');

const IMAGE_DIR = path.join(__dirname, '../image');
const EDIT_PAGE_DIR = path.join(IMAGE_DIR, 'edit-page');
const CONTENT_PAGES_DIR = path.join(IMAGE_DIR, 'content-pages');

// Ensure directories exist
async function ensureDirectories() {
  try {
    await fs.mkdir(IMAGE_DIR, { recursive: true });
    await fs.mkdir(EDIT_PAGE_DIR, { recursive: true });
    await fs.mkdir(CONTENT_PAGES_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating directories:', error);
  }
}

// Initialize directories on module load
ensureDirectories();

/**
 * Get JSON file path for a category
 */
function getJsonPath(category, subcategory = null) {
  let dir;
  if (category === 'edit-page') {
    dir = EDIT_PAGE_DIR;
  } else if (category === 'content-pages') {
    dir = CONTENT_PAGES_DIR;
  } else {
    dir = IMAGE_DIR;
  }

  if (subcategory) {
    const subDir = path.join(dir, subcategory);
    ensureDirectories().then(() => fs.mkdir(subDir, { recursive: true }).catch(() => {}));
    return path.join(subDir, 'images.json');
  }
  return path.join(dir, 'images.json');
}

/**
 * Read image paths from JSON file
 */
async function getImagePaths(category, subcategory = null) {
  try {
    const jsonPath = getJsonPath(category, subcategory);
    const data = await fs.readFile(jsonPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Return empty structure if file doesn't exist
    return {};
  }
}

/**
 * Save image path to JSON file
 */
async function saveImagePath(category, subcategory, imageKey, s3Url, metadata = {}) {
  try {
    const jsonPath = getJsonPath(category, subcategory);
    const images = await getImagePaths(category, subcategory);
    
    images[imageKey] = {
      url: s3Url,
      uploadedAt: new Date().toISOString(),
      ...metadata
    };

    // Ensure directory exists
    const dir = path.dirname(jsonPath);
    await fs.mkdir(dir, { recursive: true });
    
    await fs.writeFile(jsonPath, JSON.stringify(images, null, 2), 'utf8');
    return images[imageKey];
  } catch (error) {
    console.error('Error saving image path:', error);
    throw error;
  }
}

/**
 * Delete image path from JSON file
 */
async function deleteImagePath(category, subcategory, imageKey) {
  try {
    const jsonPath = getJsonPath(category, subcategory);
    const images = await getImagePaths(category, subcategory);
    
    if (images[imageKey]) {
      delete images[imageKey];
      await fs.writeFile(jsonPath, JSON.stringify(images, null, 2), 'utf8');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting image path:', error);
    throw error;
  }
}

/**
 * Get all images for a category
 */
async function getAllImages(category, subcategory = null) {
  return await getImagePaths(category, subcategory);
}

module.exports = {
  getImagePaths,
  saveImagePath,
  deleteImagePath,
  getAllImages,
  getJsonPath,
  ensureDirectories
};

