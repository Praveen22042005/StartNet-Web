const express = require('express');
const router = express.Router();
const { investorProfileController } = require('../../controllers/investor/profileController');
const auth = require('../../middleware/auth');
const upload = require('../../config/multer');

/**
 * Investor Profile Routes
 * @module routes/investor/profile
 */

/**
 * @route   GET /api/investor/profile
 * @desc    Get current investor's profile
 * @access  Private
 * @returns {object} Investor profile data
 */
router.get('/', auth, investorProfileController.getProfile);

/**
 * @route   PUT /api/investor/profile
 * @desc    Update investor profile
 * @access  Private
 * @param   {object} req.body - Profile data to update
 * @returns {object} Updated profile data
 */
router.put('/', auth, investorProfileController.updateProfile);

/**
 * @route   POST /api/investor/profile/upload-profile-picture
 * @desc    Upload investor profile picture
 * @access  Private
 * @param   {file} req.file - Image file (max 2MB)
 * @returns {object} URL of uploaded picture
 */
router.post('/upload-profile-picture', 
  auth, 
  upload.single('file'),
  (req, res, next) => {
    // File validation
    if (!req.file) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Please upload an image file (jpg, jpeg, png)' 
      });
    }

    // File type validation
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Invalid file type. Only jpg, jpeg, and png are allowed' 
      });
    }

    // File size validation (2MB)
    const maxSize = 2 * 1024 * 1024;
    if (req.file.size > maxSize) {
      return res.status(400).json({ 
        status: 'error',
        message: 'File too large. Maximum size is 2MB' 
      });
    }

    next();
  },
  investorProfileController.uploadProfilePicture
);

/**
 * @route   GET /api/investor/profile/all
 * @desc    Get all investor profiles with pagination and filters
 * @access  Private
 * @param   {number} req.query.page - Page number (default: 1)
 * @param   {number} req.query.limit - Items per page (default: 10)
 * @param   {string} req.query.search - Search term for name/location/skills
 * @param   {string} req.query.portfolioSize - Filter by portfolio size
 * @param   {number} req.query.minInvestment - Minimum investment amount
 * @param   {number} req.query.maxInvestment - Maximum investment amount
 * @returns {object} List of investor profiles with pagination info
 */
router.get('/all', auth, investorProfileController.getAllProfiles);

/**
 * @route   GET /api/investor/profile/:id
 * @desc    Get investor profile by ID
 * @access  Private
 * @param   {string} req.params.id - Profile ID
 * @returns {object} Investor profile data
 */
router.get('/:id', auth, investorProfileController.getProfileById);

module.exports = router;