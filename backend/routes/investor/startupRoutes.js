const express = require('express');
const router = express.Router();
const Startup = require('../../models/entrepreneur/my-startup');
const auth = require('../../middleware/auth');

/**
 * Investor Startup Routes
 * @module routes/investor/startups
 */

/**
 * @route   GET /api/investor/startups/all
 * @desc    Get all startups with pagination and filters
 * @access  Private
 * @param   {number} req.query.page - Page number (default: 1)
 * @param   {number} req.query.limit - Items per page (default: 9)
 * @param   {string} req.query.search - Search term for name/industry/description
 * @param   {string} req.query.industry - Filter by specific industry
 * @returns {object} Startups list with pagination info
 */
router.get('/all', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const query = {};
    
    // Search functionality
    if (req.query.search) {
      query.$or = [
        { startupName: { $regex: req.query.search, $options: 'i' } },
        { industry: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Industry filter
    if (req.query.industry && req.query.industry !== 'All') {
      query.industry = req.query.industry;
    }

    const startups = await Startup
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Startup.countDocuments(query);

    res.json({
      status: 'success',
      data: {
        startups,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          page,
          limit
        }
      }
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: process.env.NODE_ENV === 'development' 
        ? `Error fetching startups: ${error.message}` 
        : 'Error fetching startups'
    });
  }
});

/**
 * @route   GET /api/investor/startups/:id
 * @desc    Get startup by ID
 * @access  Private
 * @param   {string} req.params.id - Startup ID
 * @returns {object} Startup details
 */
router.get('/:id', auth, async (req, res) => {  
  try {
    const startup = await Startup.findById(req.params.id);

    if (!startup) {
      return res.status(404).json({
        status: 'error',
        message: 'Startup not found'
      });
    }

    res.json({
      status: 'success',
      data: startup
    });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        status: 'error',
        message: 'Startup not found'
      });
    }
    res.status(500).json({
      status: 'error',
      message: process.env.NODE_ENV === 'development' 
        ? `Server Error: ${err.message}` 
        : 'Internal server error'
    });
  }
});

module.exports = router;