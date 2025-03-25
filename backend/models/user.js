const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema
 * @typedef {Object} User
 * @property {string} fullName - User's full name
 * @property {string} email - User's email address
 * @property {string} password - Encrypted password
 * @property {string} accountType - Type of account (entrepreneur/investor)
 * @property {Date} createdAt - Account creation date
 */
const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please provide a full name'],
    trim: true,
    maxLength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't return password in queries by default
  },
  accountType: {
    type: String,
    enum: {
      values: ['entrepreneur', 'investor'],
      message: '{VALUE} is not a valid account type'
    },
    default: 'entrepreneur'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true // Prevent modification of creation date
  },
  lastLogin: {
    type: Date
  },
  active: {
    type: Boolean,
    default: true
  }
});

// Index for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ accountType: 1 });

/**
 * Compare entered password with user's hashed password
 * @param {string} enteredPassword - The password to compare
 * @returns {Promise<boolean>} - True if password matches
 */
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Hash password before saving
 * @returns {void}
 */
UserSchema.pre('save', async function(next) {
  // Only hash password if it has been modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Update lastLogin date
 * @returns {void}
 */
UserSchema.methods.updateLastLogin = async function() {
  this.lastLogin = new Date();
  return this.save();
};

/**
 * Get public profile (removes sensitive data)
 * @returns {Object} Public user data
 */
UserSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

module.exports = mongoose.model('User', UserSchema);