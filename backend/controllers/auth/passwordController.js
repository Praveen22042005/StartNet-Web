const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../../models/User');
const sendEmail = require('../../utils/sendEmail');

/**
 * Password Controller
 * Handles password management operations
 * @module controllers/auth/passwordController
 */
const passwordController = {
  /**
   * Update user password
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  updatePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      // Validate input
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          status: 'error',
          message: 'Both current and new password are required',
          code: 'MISSING_PASSWORDS'
        });
      }

      // Find user with password
      const user = await User.findById(userId).select('+password');
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }

      // Verify current password
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          status: 'error',
          message: 'Current password is incorrect',
          code: 'INVALID_PASSWORD'
        });
      }

      // Validate new password
      if (newPassword.length < 8) {
        return res.status(400).json({
          status: 'error',
          message: 'New password must be at least 8 characters',
          code: 'INVALID_PASSWORD_LENGTH'
        });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.json({
        status: 'success',
        message: 'Password updated successfully',
        code: 'PASSWORD_UPDATED'
      });
    } catch (error) {
      handleError(error, res, 'Error updating password');
    }
  },

  /**
   * Request password reset email
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  requestPasswordReset: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          status: 'error',
          message: 'Email is required',
          code: 'MISSING_EMAIL'
        });
      }

      const user = await User.findOne({ email });
      
      // Always return success to prevent email enumeration
      if (!user) {
        return res.json({
          status: 'success',
          message: 'If a user exists with this email, they will receive password reset instructions'
        });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

      // Save reset token
      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
      await user.save();

      // Send reset email
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        text: `You requested a password reset. Please visit: ${resetUrl}`
      });

      res.json({
        status: 'success',
        message: 'If a user exists with this email, they will receive password reset instructions'
      });
    } catch (error) {
      handleError(error, res, 'Error requesting password reset');
    }
  },

  /**
   * Reset password using token
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  resetPassword: async (req, res) => {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({
          status: 'error',
          message: 'Token and new password are required',
          code: 'MISSING_FIELDS'
        });
      }

      const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid or expired reset token',
          code: 'INVALID_TOKEN'
        });
      }

      // Update password and clear reset token
      user.password = newPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      res.json({
        status: 'success',
        message: 'Password has been reset successfully',
        code: 'PASSWORD_RESET'
      });
    } catch (error) {
      handleError(error, res, 'Error resetting password');
    }
  },

  /**
   * Verify reset token validity
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  verifyResetToken: async (req, res) => {
    try {
      const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }
      });

      res.json({
        status: 'success',
        data: {
          isValid: !!user
        }
      });
    } catch (error) {
      handleError(error, res, 'Error verifying token');
    }
  }
};

/**
 * Handle controller errors
 * @param {Error} error - Error object
 * @param {Object} res - Express response object
 * @param {string} defaultMessage - Default error message
 */
const handleError = (error, res, defaultMessage) => {
  if (process.env.NODE_ENV === 'development') {
    console.error('Password controller error:', {
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

module.exports = { passwordController };