const express = require('express');
const router = express.Router();
const { uploadStartupLogo } = require('../../controllers/entrepreneur/startupLogoController');
const auth = require('../../middleware/auth');
const upload = require('../../config/multer');

/**
 * Startup Logo Routes
 * @module routes/entrepreneur/startup-logo
 */

/**
 * @route   POST /api/entrepreneur/upload-startup-logo
 * @desc    Upload startup logo image
 * @access  Private
 * @param   {file} req.file - Image file (max 2MB)
 * @returns {object} URL of uploaded logo
 */
router.post('/upload-startup-logo', 
  auth, 
  upload.single('file'),
  (req, res, next) => {
    // File existence check
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

    // File size validation (2MB limit set in multer config)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (req.file.size > maxSize) {
      return res.status(400).json({ 
        status: 'error',
        message: 'File too large. Maximum size is 2MB' 
      });
    }

    next();
  },
  uploadStartupLogo
);

module.exports = router;