const multer = require('multer');

/**
 * Multer Configuration
 * Handles file upload configuration and validation
 * @module config/multer
 */

// Storage configuration
const storage = multer.memoryStorage();

// Allowed file types
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png'];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

/**
 * Custom file filter
 * Validates file type before upload
 */
const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'), false);
  }

  // Check original filename extension
  const filenameRegex = /\.(jpg|jpeg|png)$/i;
  if (!filenameRegex.test(file.originalname)) {
    return cb(new Error('Invalid file extension. Only .jpg, .jpeg, and .png are allowed.'), false);
  }

  cb(null, true);
};

/**
 * Custom error handler
 */
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 'error',
        message: 'File size exceeds 2MB limit',
        code: 'FILE_TOO_LARGE'
      });
    }
    return res.status(400).json({
      status: 'error',
      message: 'File upload error',
      code: 'UPLOAD_ERROR'
    });
  }
  
  if (error.message.includes('file type') || error.message.includes('extension')) {
    return res.status(400).json({
      status: 'error',
      message: error.message,
      code: 'INVALID_FILE_TYPE'
    });
  }

  next(error);
};

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1 // Allow only 1 file per request
  }
});

module.exports = {
  upload,
  handleMulterError,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE
};