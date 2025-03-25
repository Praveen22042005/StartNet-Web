const jwt = require('jsonwebtoken');

/**
 * Authentication Middleware
 * Validates JWT tokens from the Authorization header
 * 
 * @middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
const auth = (req, res, next) => {
  try {
    // Extract Bearer token from Authorization header
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Authorization header missing or invalid format',
        code: 'AUTH_HEADER_INVALID'
      });
    }

    // Remove Bearer prefix from token
    const token = authHeader.replace('Bearer ', '');
    
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Add user data to request object
      req.user = decoded.user;
      next();
    } catch (tokenError) {
      // Handle specific JWT errors
      if (tokenError.name === 'TokenExpiredError') {
        return res.status(401).json({
          status: 'error',
          message: 'Token has expired. Please sign in again.',
          code: 'TOKEN_EXPIRED',
          isExpired: true
        });
      }
      if (tokenError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid token format',
          code: 'TOKEN_INVALID'
        });
      }
      throw tokenError;
    }
  } catch (error) {
    // Handle unexpected errors
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? `Authentication error: ${error.message}`
      : 'Authentication failed';

    if (process.env.NODE_ENV === 'development') {
      // Log error in development only
      console.error('Auth middleware error:', {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
    }

    res.status(401).json({
      status: 'error',
      message: errorMessage,
      code: 'AUTH_FAILED'
    });
  }
};

module.exports = auth;