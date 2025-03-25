const mongoose = require('mongoose');

/**
 * Social Media Platform Schema
 * @typedef {Object} SocialMedia
 * @property {string} platform - Social media platform name
 * @property {string} url - Profile URL on the platform
 */
const socialMediaSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: [true, 'Platform name is required'],
    enum: {
      values: ['LinkedIn', 'Twitter', 'Instagram', 'GitHub', 'Facebook', 'YouTube'],
      message: '{VALUE} is not a supported platform'
    }
  },
  url: {
    type: String,
    required: [true, 'URL is required'],
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Please enter a valid URL starting with http:// or https://'
    }
  }
});

/**
 * Skill Schema
 * @typedef {Object} Skill
 * @property {string} name - Name of the skill
 */
const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true
  }
});

/**
 * Investor Profile Schema
 * @typedef {Object} InvestorProfile
 */
const investorProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true,
    immutable: true
  },
  profilePicture: {
    type: String,
    default: '',
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Profile picture URL must start with http:// or https://'
    }
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxLength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address'
    ]
  },
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^\+?[\d\s-]+$/.test(v);
      },
      message: 'Please provide a valid phone number'
    }
  },
  location: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    trim: true,
    maxLength: [500, 'Bio cannot be more than 500 characters']
  },
  socialMedia: [socialMediaSchema],
  skills: [skillSchema],
  investmentPreferences: [{
    type: String,
    trim: true
  }],
  portfolioSize: {
    type: String,
    enum: {
      values: ['< $100K', '$100K-$500K', '$500K-$1M', '$1M-$5M', '$5M-$10M', '> $10M'],
      message: '{VALUE} is not a valid portfolio size'
    }
  },
  investmentRange: {
    min: {
      type: Number,
      min: [0, 'Minimum investment cannot be negative']
    },
    max: {
      type: Number,
      validate: {
        validator: function(v) {
          return !v || v >= this.investmentRange.min;
        },
        message: 'Maximum investment must be greater than minimum investment'
      }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
investorProfileSchema.index({ userId: 1 });
investorProfileSchema.index({ portfolioSize: 1 });
investorProfileSchema.index({ 'investmentRange.min': 1, 'investmentRange.max': 1 });

/**
 * Update timestamps before saving
 */
investorProfileSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

/**
 * Get public profile (removes sensitive data)
 * @returns {Object} Public profile data
 */
investorProfileSchema.methods.getPublicProfile = function() {
  const profile = this.toObject();
  delete profile.__v;
  return profile;
};

const InvestorProfile = mongoose.model('InvestorProfile', investorProfileSchema);

module.exports = InvestorProfile;