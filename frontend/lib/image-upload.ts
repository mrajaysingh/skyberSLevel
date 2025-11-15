/**
 * Image Upload Utility
 * Handles uploading images to S3 and managing image paths
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ImageUploadOptions {
  category: 'edit-page' | 'content-pages';
  subcategory?: string;
  imageKey: string;
  file: File;
  onProgress?: (progress: number) => void;
}

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  imageKey?: string;
  message?: string;
  error?: string;
}

/**
 * Convert file to base64 data URL
 */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Upload image to S3 via backend API
 */
export async function uploadImageToS3(options: ImageUploadOptions): Promise<ImageUploadResult> {
  try {
    const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
    if (!sessionToken) {
      return {
        success: false,
        error: 'Authentication required. Please log in.'
      };
    }

    // Convert file to data URL
    const dataUrl = await fileToDataUrl(options.file);

    // Upload to backend
    const response = await fetch(`${API_URL}/api/images/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`
      },
      body: JSON.stringify({
        category: options.category,
        subcategory: options.subcategory,
        imageKey: options.imageKey,
        dataUrl,
        originalName: options.file.name
      })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.message || 'Failed to upload image'
      };
    }

    return {
      success: true,
      url: data.url,
      imageKey: data.imageKey,
      message: data.message
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to upload image'
    };
  }
}

/**
 * Delete image from S3
 */
export async function deleteImageFromS3(
  category: 'edit-page' | 'content-pages',
  subcategory: string | undefined,
  imageKey: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
    if (!sessionToken) {
      return {
        success: false,
        error: 'Authentication required. Please log in.'
      };
    }

    const response = await fetch(`${API_URL}/api/images/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`
      },
      body: JSON.stringify({
        category,
        subcategory,
        imageKey
      })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.message || 'Failed to delete image'
      };
    }

    return {
      success: true,
      message: data.message
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to delete image'
    };
  }
}

/**
 * Get image URL from JSON storage
 */
export async function getImageUrl(
  category: 'edit-page' | 'content-pages',
  subcategory: string | undefined,
  imageKey: string
): Promise<string | null> {
  try {
    const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
    if (!sessionToken) {
      return null;
    }

    const response = await fetch(
      `${API_URL}/api/images/get?category=${category}${subcategory ? `&subcategory=${subcategory}` : ''}&imageKey=${imageKey}`,
      {
        headers: {
          'Authorization': `Bearer ${sessionToken}`
        }
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.success && data.data ? data.data.url : null;
  } catch (error) {
    console.error('Error getting image URL:', error);
    return null;
  }
}

/**
 * List all images for a category
 */
export async function listImages(
  category: 'edit-page' | 'content-pages',
  subcategory?: string
): Promise<Record<string, { url: string; uploadedAt: string }> | null> {
  try {
    const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
    if (!sessionToken) {
      return null;
    }

    const response = await fetch(
      `${API_URL}/api/images/list?category=${category}${subcategory ? `&subcategory=${subcategory}` : ''}`,
      {
        headers: {
          'Authorization': `Bearer ${sessionToken}`
        }
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.success && data.data ? data.data : null;
  } catch (error) {
    console.error('Error listing images:', error);
    return null;
  }
}

