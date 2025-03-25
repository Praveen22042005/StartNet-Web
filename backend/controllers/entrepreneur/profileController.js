const Profile = require('../../models/entrepreneur/Profile');
const { entrepreneurContainerClient } = require('../../config/azureStorage');

/**
 * Entrepreneur Profile Controller
 * Handles all entrepreneur profile related operations
 * @module controllers/entrepreneur/profileController
 */
const profileController = {
  /**
   * Get entrepreneur's profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const profile = await Profile.findOne({ userId });
      
      if (!profile) {
        return res.status(404).json({
          status: 'error',
          message: 'Profile not found',
          code: 'PROFILE_NOT_FOUND'
        });
      }
      
      res.json({
        status: 'success',
        data: profile.getPublicProfile()
      });
    } catch (error) {
      handleError(error, res, 'Error fetching profile');
    }
  },

  /**
   * Update entrepreneur profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  updateProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const profileData = req.body;

      // Validate required fields
      const requiredFields = ['fullName', 'email'];
      const missingFields = requiredFields.filter(field => !profileData[field]);
      
      if (missingFields.length > 0) {
        return res.status(400).json({
          status: 'error',
          message: `Missing required fields: ${missingFields.join(', ')}`,
          code: 'MISSING_REQUIRED_FIELDS'
        });
      }

      const profile = await Profile.findOneAndUpdate(
        { userId },
        { ...profileData, updatedAt: new Date() },
        { new: true, upsert: true, runValidators: true }
      );

      res.json({
        status: 'success',
        data: profile.getPublicProfile()
      });
    } catch (error) {
      handleError(error, res, 'Error updating profile');
    }
  },

  /**
   * Delete entrepreneur profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  deleteProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const profile = await Profile.findOneAndDelete({ userId });

      if (!profile) {
        return res.status(404).json({
          status: 'error',
          message: 'Profile not found',
          code: 'PROFILE_NOT_FOUND'
        });
      }

      res.json({
        status: 'success',
        message: 'Profile deleted successfully',
        code: 'PROFILE_DELETED'
      });
    } catch (error) {
      handleError(error, res, 'Error deleting profile');
    }
  },

  /**
   * Upload entrepreneur profile picture
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  uploadProfilePicture: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          status: 'error',
          message: 'No file uploaded',
          code: 'NO_FILE_UPLOADED'
        });
      }

      const userId = req.user.id;
      const fileExt = getFileExtension(req.file.originalname);
      const blobName = `profile-picture-${userId}-${Date.now()}${fileExt}`;
      
      if (!entrepreneurContainerClient) {
        return res.status(500).json({
          status: 'error',
          message: 'Storage configuration error',
          code: 'STORAGE_CONFIG_ERROR'
        });
      }

      const blockBlobClient = entrepreneurContainerClient.getBlockBlobClient(blobName);

      // Upload file to Azure Storage
      await blockBlobClient.uploadData(req.file.buffer, {
        blobHTTPHeaders: { 
          blobContentType: req.file.mimetype,
          blobCacheControl: 'public, max-age=31536000'
        }
      });

      // Optimize storage and caching
      await blockBlobClient.setAccessTier('Hot');

      const profilePictureUrl = blockBlobClient.url;

      // Update profile with new picture URL
      const profile = await Profile.findOneAndUpdate(
        { userId },
        { profilePicture: profilePictureUrl },
        { new: true, upsert: true }
      );

      res.json({
        status: 'success',
        data: {
          profilePicture: profilePictureUrl
        }
      });
    } catch (error) {
      handleError(error, res, 'Failed to upload profile picture');
    }
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
    console.error('Profile controller error:', {
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

module.exports = { profileController };