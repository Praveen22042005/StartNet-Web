const { startupLogosContainerClient } = require('../../config/azureStorage');

/**
 * Startup Logo Controller
 * Handles startup logo upload operations
 * @module controllers/entrepreneur/startupLogoController
 */

/**
 * Upload startup logo to cloud storage
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Upload result with logo URL
 */
const uploadStartupLogo = async (req, res) => {
  try {
    if (!startupLogosContainerClient) {
      return res.status(500).json({
        status: 'error',
        message: 'Storage configuration error',
        code: 'STORAGE_CONFIG_ERROR'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No file uploaded',
        code: 'NO_FILE_UPLOADED'
      });
    }

    const fileExt = getFileExtension(req.file.originalname);
    const blobName = `startup-logo-${Date.now()}${fileExt}`;
    const blockBlobClient = startupLogosContainerClient.getBlockBlobClient(blobName);

    // Upload file to cloud storage
    await blockBlobClient.uploadData(req.file.buffer, {
      blobHTTPHeaders: { 
        blobContentType: req.file.mimetype,
        blobCacheControl: 'public, max-age=31536000'
      }
    });

    // Optimize storage and caching
    await blockBlobClient.setAccessTier('Hot');

    const logoUrl = blockBlobClient.url;

    res.json({
      status: 'success',
      data: { logoUrl },
      code: 'LOGO_UPLOADED'
    });
  } catch (error) {
    handleError(error, res, 'Failed to upload startup logo');
  }
};

/**
 * Get file extension from filename
 * @param {string} filename - Original filename
 * @returns {string} File extension with dot
 */
const getFileExtension = (filename) => {
  const ext = filename.split('.').pop();
  return ext ? `.${ext}` : '';
};

/**
 * Handle controller errors
 * @param {Error} error - Error object
 * @param {Object} res - Express response object
 * @param {string} defaultMessage - Default error message
 */
const handleError = (error, res, defaultMessage) => {
  if (process.env.NODE_ENV === 'development') {
    console.error('Startup Logo Controller error:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }

  res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'development' 
      ? `${defaultMessage}: ${error.message}`
      : defaultMessage,
    code: 'SERVER_ERROR'
  });
};

module.exports = { uploadStartupLogo };