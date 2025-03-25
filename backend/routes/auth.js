const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, password, accountType } = req.body;

    // Input validation
    if (!fullName || !email || !password || !accountType) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      fullName,
      email,
      password: hashedPassword,
      accountType,
    });

    await user.save();

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        accountType: user.accountType,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || '1h' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ 
          token,
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            accountType: user.accountType
          }
        });
      }
    );
  } catch (err) {
    res.status(500).json({ 
      message: process.env.NODE_ENV === 'development' 
        ? `Server error: ${err.message}` 
        : 'Internal server error'
    });
  }
});

/**
 * @route   POST /api/auth/signin
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        accountType: user.accountType,
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token,
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            accountType: user.accountType
          }
        });
      }
    );
  } catch (err) {
    res.status(500).json({ 
      message: process.env.NODE_ENV === 'development' 
        ? `Server error: ${err.message}` 
        : 'Internal server error'
    });
  }
});

module.exports = router;