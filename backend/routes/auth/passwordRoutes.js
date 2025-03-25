const express = require('express');
const router = express.Router();
const { passwordController } = require('../../controllers/auth/passwordController');
const auth = require('../../middleware/auth');

/**
 * Password Management Routes
 * @module routes/auth/password
 */

/**
 * @route   PUT /api/auth/password/update
 * @desc    Update user password
 * @access  Private
 * @param   {string} currentPassword - User's current password
 * @param   {string} newPassword - New password to set
 * @returns {object} Message indicating success/failure
 */
router.put('/update', auth, passwordController.updatePassword);

/**
 * @route   POST /api/auth/password/reset-request
 * @desc    Request password reset email
 * @access  Public
 * @param   {string} email - User's email address
 * @returns {object} Message indicating email sent
 */
router.post('/reset-request', passwordController.requestPasswordReset);

/**
 * @route   POST /api/auth/password/reset
 * @desc    Reset password using token
 * @access  Public
 * @param   {string} token - Reset token from email
 * @param   {string} newPassword - New password to set
 * @returns {object} Message indicating success/failure
 */
router.post('/reset', passwordController.resetPassword);

/**
 * @route   GET /api/auth/password/verify-token/:token
 * @desc    Verify reset token validity
 * @access  Public
 * @param   {string} token - Reset token to verify
 * @returns {object} Message indicating token validity
 */
router.get('/verify-token/:token', passwordController.verifyResetToken);

module.exports = router;