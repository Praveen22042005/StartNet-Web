const express = require('express');
const router = express.Router();
const Startup = require('../../models/entrepreneur/my-startup');
const auth = require('../../middleware/auth');

/**
 * Startup Management Routes
 * @module routes/entrepreneur/startup
 */

/**
 * @route   POST /api/entrepreneur/startups
 * @desc    Create a new startup
 * @access  Private
 */
router.post('/', auth, async (req, res) => {
  try {
    const requiredFields = [
      'startupName', 
      'industry', 
      'fundingGoal', 
      'description', 
      'address', 
      'email', 
      'mobile'
    ];
    
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    if (!req.body.team || !Array.isArray(req.body.team) || req.body.team.length === 0) {
      return res.status(400).json({ 
        message: 'At least one team member is required'
      });
    }

    const newStartup = new Startup({
      ...req.body,
      user: req.user.id 
    });

    const startup = await newStartup.save();
    res.status(201).json(startup);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: Object.values(err.errors).map(e => e.message).join(', ')
      });
    }
    res.status(500).json({ 
      message: process.env.NODE_ENV === 'development' 
        ? `Server Error: ${err.message}` 
        : 'Internal server error'
    });
  }
});

/**
 * @route   GET /api/entrepreneur/startups/:id
 * @desc    Get startup by ID
 * @access  Private
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id)
      .orFail(new Error('Startup not found'));
    res.json(startup);
  } catch (err) {
    if (err.message === 'Startup not found' || err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Startup not found' });
    }
    res.status(500).json({ 
      message: process.env.NODE_ENV === 'development' 
        ? `Server Error: ${err.message}` 
        : 'Internal server error'
    });
  }
});

/**
 * @route   GET /api/entrepreneur/startups
 * @desc    Get all startups for the authenticated user
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
  try {
    const startups = await Startup.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(startups);
  } catch (err) {
    res.status(500).json({ 
      message: process.env.NODE_ENV === 'development' 
        ? `Server Error: ${err.message}` 
        : 'Internal server error'
    });
  }
});

/**
 * @route   PUT /api/entrepreneur/startups/:id
 * @desc    Update startup details
 * @access  Private
 */
router.put('/:id', auth, async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id)
      .select('+user')
      .orFail(new Error('Startup not found'));

    if (!startup.user || startup.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to update this startup' });
    }

    const updatedStartup = await Startup.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).orFail(new Error('Update failed'));
    
    res.json(updatedStartup);
  } catch (err) {
    const statusCode = err.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({ 
      message: err.message.includes('validation') 
        ? 'Invalid data' 
        : process.env.NODE_ENV === 'development'
          ? err.message
          : 'Internal server error'
    });
  }
});

/**
 * @route   DELETE /api/entrepreneur/startups/:id
 * @desc    Delete a startup
 * @access  Private
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);

    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }

    if (startup.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this startup' });
    }

    await startup.remove();
    res.json({ message: 'Startup removed successfully' });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Startup not found' });
    }
    res.status(500).json({ 
      message: process.env.NODE_ENV === 'development' 
        ? `Server Error: ${err.message}` 
        : 'Internal server error'
    });
  }
});

module.exports = router;