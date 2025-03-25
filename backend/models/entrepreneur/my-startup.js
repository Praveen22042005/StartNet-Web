const mongoose = require('mongoose');

/**
 * Startup Schema - Defines the data structure for startup profiles
 * @typedef {Object} Startup
 */
const startupSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  // Basic Information
  startupName: {
    type: String,
    required: [true, 'Startup name is required'],
    trim: true,
    maxlength: [100, 'Startup name cannot exceed 100 characters'],
    index: true
  },
  industry: {
    type: String,
    required: [true, 'Industry is required'],
    trim: true,
    maxlength: [50, 'Industry name cannot exceed 50 characters'],
    index: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  startupLogo: {
    type: String,
    default: '',
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Logo URL must start with http:// or https://'
    }
  },

  // Contact Information
  website: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Website URL must start with http:// or https://'
    }
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
    maxlength: [100, 'Address cannot exceed 100 characters']
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
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    validate: {
      validator: function(v) {
        return /^\+?[\d\s-]+$/.test(v);
      },
      message: 'Please provide a valid mobile number'
    }
  },

  // Financial Information
  fundingGoal: {
    type: Number,
    required: [true, 'Funding goal is required'],
    min: [0, 'Funding goal cannot be negative']
  },
  raisedSoFar: {
    type: Number,
    default: 0,
    min: [0, 'Raised amount cannot be negative'],
    validate: {
      validator: function(v) {
        return v <= this.fundingGoal;
      },
      message: 'Raised amount cannot exceed funding goal'
    }
  },

  // Overview
  founded: {
    type: Number,
    required: [true, 'Founding year is required'],
    min: [1900, 'Invalid founding year'],
    max: [new Date().getFullYear(), 'Founding year cannot be in the future']
  },

  // Idea & Validation
  problem: {
    type: String,
    required: [true, 'Problem statement is required'],
    trim: true,
    maxlength: [300, 'Problem statement cannot exceed 300 characters']
  },
  solution: {
    type: String,
    required: [true, 'Solution description is required'],
    trim: true,
    maxlength: [300, 'Solution description cannot exceed 300 characters']
  },
  traction: {
    type: String,
    required: [true, 'Traction metrics are required'],
    trim: true,
    maxlength: [250, 'Traction metrics cannot exceed 250 characters']
  },

  // Market & Growth
  targetMarket: {
    type: String,
    required: [true, 'Target market is required'],
    trim: true,
    maxlength: [100, 'Target market description cannot exceed 100 characters']
  },
  tam: {
    type: String,
    required: [true, 'Total Addressable Market (TAM) is required'],
    trim: true,
    maxlength: [50, 'TAM description cannot exceed 50 characters']
  },
  demand: {
    type: String,
    required: [true, 'Market demand description is required'],
    trim: true,
    maxlength: [150, 'Market demand description cannot exceed 150 characters']
  },
  scalability: {
    type: String,
    required: [true, 'Scalability plan is required'],
    trim: true,
    maxlength: [150, 'Scalability plan cannot exceed 150 characters']
  },

  // Competitors & Edge
  competitors: {
    type: String,
    required: [true, 'Competitor analysis is required'],
    trim: true,
    maxlength: [150, 'Competitor analysis cannot exceed 150 characters']
  },
  advantage: {
    type: String,
    required: [true, 'Competitive advantage is required'],
    trim: true,
    maxlength: [150, 'Competitive advantage cannot exceed 150 characters']
  },

  // Revenue & Financials
  revenueStreams: {
    type: String,
    required: [true, 'Revenue streams are required'],
    trim: true,
    maxlength: [200, 'Revenue streams description cannot exceed 200 characters']
  },
  annualRevenue: {
    type: Number,
    required: [true, 'Annual revenue is required'],
    min: [0, 'Annual revenue cannot be negative']
  },
  projectedRevenue: {
    type: String,
    required: [true, 'Revenue projection is required'],
    trim: true,
    maxlength: [100, 'Revenue projection cannot exceed 100 characters']
  },

  // Funding & Investment
  previousFunding: {
    type: String,
    required: [true, 'Previous funding information is required'],
    trim: true,
    maxlength: [100, 'Previous funding description cannot exceed 100 characters']
  },
  seeking: {
    type: String,
    required: [true, 'Investment seeking details are required'],
    trim: true,
    maxlength: [100, 'Investment seeking details cannot exceed 100 characters']
  },
  investorROI: {
    type: String,
    required: [true, 'Investor ROI details are required'],
    trim: true,
    maxlength: [50, 'ROI description cannot exceed 50 characters']
  },
  equityAvailable: {
    type: String,
    required: [true, 'Available equity information is required'],
    trim: true,
    maxlength: [50, 'Equity description cannot exceed 50 characters']
  },

  // Team Members
  team: [{
    name: { 
      type: String, 
      required: [true, 'Team member name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    role: { 
      type: String, 
      required: [true, 'Team member role is required'],
      trim: true,
      maxlength: [50, 'Role cannot exceed 50 characters']
    },
    email: { 
      type: String, 
      required: [true, 'Team member email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    linkedIn: { 
      type: String,
      trim: true,
      maxlength: [200, 'LinkedIn URL cannot exceed 200 characters'],
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/(www\.)?linkedin\.com\/.+/.test(v);
        },
        message: 'Please provide a valid LinkedIn URL'
      }
    }
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
startupSchema.index({ startupName: 1 });
startupSchema.index({ industry: 1 });
startupSchema.index({ user: 1 });
startupSchema.index({ 'team.email': 1 });

/**
 * Get public startup profile (removes sensitive data)
 * @returns {Object} Public startup data
 */
startupSchema.methods.getPublicProfile = function() {
  const startup = this.toObject();
  delete startup.__v;
  startup.team = startup.team.map(member => {
    const { email, ...rest } = member;
    return rest;
  });
  return startup;
};

/**
 * Validate team members are unique by email
 */
startupSchema.path('team').validate(function(team) {
  if (!team) return true;
  const emails = team.map(t => t.email.toLowerCase());
  const uniqueEmails = new Set(emails);
  return uniqueEmails.size === emails.length;
}, 'Team members must have unique email addresses');

const Startup = mongoose.model('Startup', startupSchema);

module.exports = Startup;