const InvestorProfile = require('../../models/investor/Profile');
const { investorContainerClient } = require('../../config/azureStorage');

/**
 * Investor Profile Controller
 * Handles all investor profile related operations
 * @module controllers/investor/profileController
 */
const investorProfileController = {
  /**
   * Get current investor's profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const profile = await InvestorProfile.findOne({ userId });
      
      if (!profile) {
        return res.status(404).json({
          status: 'error',
          message: 'Profile not found'
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
   * Get investor profile by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getProfileById: async (req, res) => {
    try {
      const profile = await InvestorProfile.findById(req.params.id);
      
      if (!profile) {
        return res.status(404).json({
          status: 'error',
          message: 'Investor profile not found'
        });
      }
      
      res.json({
        status: 'success',
        data: profile.getPublicProfile()
      });
    } catch (error) {
      handleError(error, res, 'Error fetching investor profile');
    }
  },

  /**
   * Update investor profile
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
          message: `Missing required fields: ${missingFields.join(', ')}`
        });
      }

      const profile = await InvestorProfile.findOneAndUpdate(
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
   * Upload investor profile picture
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  uploadProfilePicture: async (req, res) => {
    try {
      const userId = req.user.id;
      const blobName = `profile-picture-${userId}-${Date.now()}${getFileExtension(req.file.originalname)}`;
      const blockBlobClient = investorContainerClient.getBlockBlobClient(blobName);

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
      const profile = await InvestorProfile.findOneAndUpdate(
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
  },

  /**
   * Get all investor profiles with filters and pagination
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getAllProfiles: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const query = {};
      
      // Search functionality
      if (req.query.search) {
        query.$or = [
          { fullName: { $regex: req.query.search, $options: 'i' } },
          { location: { $regex: req.query.search, $options: 'i' } },
          { 'skills.name': { $regex: req.query.search, $options: 'i' } }
        ];
      }

      // Portfolio size filter
      if (req.query.portfolioSize && req.query.portfolioSize !== 'All') {
        query.portfolioSize = req.query.portfolioSize;
      }

      // Investment range filters
      if (req.query.minInvestment) {
        query['investmentRange.min'] = { $gte: parseInt(req.query.minInvestment) };
      }
      if (req.query.maxInvestment) {
        query['investmentRange.max'] = { $lte: parseInt(req.query.maxInvestment) };
      }

      const investors = await InvestorProfile
        .find(query)
        .select('fullName location profilePicture bio portfolioSize investmentRange skills')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await InvestorProfile.countDocuments(query);

      res.json({
        status: 'success',
        data: {
          investors: investors.map(investor => investor.getPublicProfile()),
          pagination: {
            total,
            pages: Math.ceil(total / limit),
            page,
            limit
          }
        }
      });
    } catch (error) {
      handleError(error, res, 'Error fetching investor profiles');
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
    console.error('Controller error:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }

  const message = process.env.NODE_ENV === 'development' 
    ? `${defaultMessage}: ${error.message}`
    : defaultMessage;

  res.status(500).json({
    status: 'error',
    message
  });
};

module.exports = { investorProfileController };