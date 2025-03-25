const express = require('express');
const router = express.Router();
const settingsController = require('../../controllers/investor/settingsController');
const auth = require('../../middleware/auth');

/**
 * Investor Settings Routes
 * @module routes/investor/settings
 */

/**
 * @route   PUT /api/investor/settings/update-password
 * @desc    Update investor's password
 * @access  Private
 * @param   {string} req.body.currentPassword - Current password
 * @param   {string} req.body.newPassword - New password
 * @returns {object} Message indicating success/failure
 */
router.put('/update-password', auth, settingsController.updatePassword);

/**
 * @route   DELETE /api/investor/settings/delete-account
 * @desc    Delete investor's account and related data
 * @access  Private
 * @returns {object} Message indicating account deletion status
 */
router.delete('/delete-account', auth, settingsController.deleteAccount);

module.exports = router;