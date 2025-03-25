const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const InvestorProfile = require('../../models/investor/Profile');

/**
 * Investor Settings Controller
 * Handles password updates and account deletion
 * @module controllers/investor/settingsController
 */
const settingsController = {
  /**
   * Update investor's password
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} Success/error message
   */
  updatePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      // Validate password requirements
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          status: 'error',
          message: 'Both current and new password are required',
          code: 'MISSING_PASSWORDS'
        });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          status: 'error',
          message: 'New password must be at least 8 characters long',
          code: 'INVALID_PASSWORD_LENGTH'
        });
      }

      // Find user with password field
      const user = await User.findById(userId).select('+password');
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          status: 'error',
          message: 'Current password is incorrect',
          code: 'INVALID_CURRENT_PASSWORD'
        });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
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
   * Delete investor's account and related data
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} Success/error message
   */
  deleteAccount: async (req, res) => {
    try {
      const userId = req.user.id;

      // Start transaction
      const session = await User.startSession();
      session.startTransaction();

      try {
        // Delete investor profile
        const deleteProfile = await InvestorProfile.findOneAndDelete(
          { userId }, 
          { session }
        );

        // Delete user account
        const deleteUser = await User.findByIdAndDelete(
          userId, 
          { session }
        );

        if (!deleteProfile || !deleteUser) {
          throw new Error('Failed to delete account or profile');
        }

        // Commit transaction
        await session.commitTransaction();
        session.endSession();

        res.json({
          status: 'success',
          message: 'Account deleted successfully',
          code: 'ACCOUNT_DELETED'
        });
      } catch (error) {
        // Rollback transaction on error
        await session.abortTransaction();
        session.endSession();
        throw error;
      }
    } catch (error) {
      handleError(error, res, 'Error deleting account');
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
    console.error('Settings controller error:', {
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

module.exports = settingsController;