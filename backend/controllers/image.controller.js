const { uploadBufferToS3, deleteObjectFromS3 } = require('../lib/s3');
const { saveImagePath, deleteImagePath, getAllImages } = require('../utils/image-manager.util');
const { authenticateRedis } = require('../middleware/redis-auth.middleware');

/**
 * Convert data URL to buffer
 */
function dataUrlToBuffer(dataUrl) {
  const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid data URL');
  }
  const contentType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, 'base64');
  return { buffer, contentType };
}

/**
 * Generate unique filename
 */
function generateUniqueFilename(originalName, prefix = '') {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const ext = originalName ? originalName.split('.').pop() : 'jpg';
  return `${prefix}${timestamp}-${random}.${ext}`;
}

/**
 * POST /api/images/upload
 * Upload image to S3 and save path to JSON
 * Body: { 
 *   category: 'edit-page' | 'content-pages',
 *   subcategory: string (optional, e.g., 'header', 'hero', 'about-us', 'founder'),
 *   imageKey: string (unique key for this image, e.g., 'logo', 'hero-image', 'member-1'),
 *   dataUrl: string (base64 data URL),
 *   originalName: string (optional)
 * }
 */
async function uploadImage(req, res) {
  try {
    const { category, subcategory, imageKey, dataUrl, originalName } = req.body;

    if (!category || !['edit-page', 'content-pages'].includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category. Must be "edit-page" or "content-pages"'
      });
    }

    if (!imageKey) {
      return res.status(400).json({
        success: false,
        message: 'imageKey is required'
      });
    }

    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid dataUrl. Must be a base64 data URL'
      });
    }

    const bucket = process.env.BUCKET_NAME;
    if (!bucket) {
      return res.status(500).json({
        success: false,
        message: 'S3 bucket not configured'
      });
    }

    // Convert data URL to buffer
    const { buffer, contentType } = dataUrlToBuffer(dataUrl);

    // Generate S3 key with organized folder structure
    const folder = `images/${category}${subcategory ? `/${subcategory}` : ''}`;
    const filename = generateUniqueFilename(originalName || 'image', `${imageKey}-`);
    const s3Key = `${folder}/${filename}`;

    // Upload to S3
    const s3Url = await uploadBufferToS3({
      bucket,
      key: s3Key,
      buffer,
      contentType: contentType || 'image/jpeg'
    });

    // Save path to JSON file
    await saveImagePath(category, subcategory || null, imageKey, s3Url, {
      originalName: originalName || 'image',
      s3Key,
      bucket
    });

    return res.status(200).json({
      success: true,
      url: s3Url,
      imageKey,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Upload image error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload image'
    });
  }
}

/**
 * DELETE /api/images/delete
 * Delete image from S3 and remove from JSON
 * Body: {
 *   category: 'edit-page' | 'content-pages',
 *   subcategory: string (optional),
 *   imageKey: string
 * }
 */
async function deleteImage(req, res) {
  try {
    const { category, subcategory, imageKey } = req.body;

    if (!category || !imageKey) {
      return res.status(400).json({
        success: false,
        message: 'category and imageKey are required'
      });
    }

    // Get image info from JSON
    const images = await getAllImages(category, subcategory || null);
    const imageInfo = images[imageKey];

    if (!imageInfo) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    const bucket = process.env.BUCKET_NAME;
    if (bucket && imageInfo.s3Key) {
      // Delete from S3
      try {
        await deleteObjectFromS3({ bucket, key: imageInfo.s3Key });
      } catch (error) {
        console.error('Error deleting from S3:', error);
        // Continue to delete from JSON even if S3 delete fails
      }
    }

    // Delete from JSON
    await deleteImagePath(category, subcategory || null, imageKey);

    return res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Delete image error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete image'
    });
  }
}

/**
 * GET /api/images/list
 * Get all images for a category
 * Query: { category, subcategory (optional) }
 */
async function listImages(req, res) {
  try {
    const { category, subcategory } = req.query;

    if (!category || !['edit-page', 'content-pages'].includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category. Must be "edit-page" or "content-pages"'
      });
    }

    const images = await getAllImages(category, subcategory || null);

    return res.status(200).json({
      success: true,
      data: images
    });
  } catch (error) {
    console.error('List images error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to list images'
    });
  }
}

/**
 * GET /api/images/get
 * Get specific image URL by key
 * Query: { category, subcategory (optional), imageKey }
 */
async function getImage(req, res) {
  try {
    const { category, subcategory, imageKey } = req.query;

    if (!category || !imageKey) {
      return res.status(400).json({
        success: false,
        message: 'category and imageKey are required'
      });
    }

    const images = await getAllImages(category, subcategory || null);
    const imageInfo = images[imageKey];

    if (!imageInfo) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: imageInfo
    });
  } catch (error) {
    console.error('Get image error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to get image'
    });
  }
}

module.exports = {
  uploadImage,
  deleteImage,
  listImages,
  getImage
};

