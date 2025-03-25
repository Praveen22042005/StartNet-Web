const express = require('express');
const router = express.Router();
const { profileController } = require('../../controllers/entrepreneur/profileController');
const auth = require('../../middleware/auth');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

/**
 * Entrepreneur Profile Routes
 * @module routes/entrepreneur/profile
 */

/**
 * @route   GET /api/profile
 * @desc    Get entrepreneur profile
 * @access  Private
 * @returns {object} Profile data
 */
router.get('/', auth, profileController.getProfile);

/**
 * @route   PUT /api/profile
 * @desc    Update entrepreneur profile
 * @access  Private
 * @param   {object} req.body - Profile data to update
 * @returns {object} Updated profile data
 */
router.put('/', auth, profileController.updateProfile);

/**
 * @route   DELETE /api/profile
 * @desc    Delete entrepreneur profile
 * @access  Private
 * @returns {object} Success message
 */
router.delete('/', auth, profileController.deleteProfile);

/**
 * @route   POST /api/profile/upload-profile-picture
 * @desc    Upload profile picture
 * @access  Private
 * @param   {file} req.file - Image file (max 5MB)
 * @returns {object} URL of uploaded picture
 */
router.post('/upload-profile-picture', 
  auth, 
  upload.single('file'),
  (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ 
        message: 'Please upload an image file (jpg, jpeg, png, gif)' 
      });
    }
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ 
        message: 'Invalid file type. Only jpg, jpeg, png, and gif are allowed' 
      });
    }
    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (req.file.size > maxSize) {
      return res.status(400).json({ 
        message: 'File too large. Maximum size is 5MB' 
      });
    }
    next();
  },
  profileController.uploadProfilePicture
);

module.exports = router;