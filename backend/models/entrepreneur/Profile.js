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
 * @property {string} name - Name of the skill or technology
 */
const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true
  }
});

/**
 * Entrepreneur Profile Schema
 * @typedef {Object} EntrepreneurProfile
 */
const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true,
    immutable: true
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
    maxLength: [1000, 'Bio cannot be more than 1000 characters']
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
  socialMedia: [socialMediaSchema],
  skills: [skillSchema],
  expertise: [{
    type: String,
    trim: true
  }],
  achievements: [{
    type: String,
    trim: true,
    maxLength: [200, 'Achievement description cannot exceed 200 characters']
  }],
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
profileSchema.index({ userId: 1 });
profileSchema.index({ email: 1 });
profileSchema.index({ skills: 1 });

/**
 * Update timestamps before saving
 */
profileSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

/**
 * Get public profile (removes sensitive data)
 * @returns {Object} Public profile data
 */
profileSchema.methods.getPublicProfile = function() {
  const profile = this.toObject();
  delete profile.__v;
  delete profile.email; // Hide email in public profile
  delete profile.phone; // Hide phone in public profile
  return profile;
};

/**
 * Validate skill uniqueness in array
 */
profileSchema.path('skills').validate(function(skills) {
  if (!skills) return true;
  const uniqueSkills = new Set(skills.map(s => s.name.toLowerCase()));
  return uniqueSkills.size === skills.length;
}, 'Duplicate skills are not allowed');

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;