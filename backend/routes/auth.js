// Shastra Platform - Phase 2: Authentication
// Auth routes: register, login, logout, verify

const express = require('express');
const jwt     = require('jsonwebtoken');
const Student = require('../models/Student');
const { protect } = require('../middleware/auth');

const router = express.Router();

const signToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

/* ── POST /api/auth/register ─────────────────────────────────────────────── */
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name, role = 'student', class: cls, school } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const existing = await Student.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'An account with that email already exists.' });
    }

    const user = await Student.create({ email, password, name, role, class: cls, school });

    res.status(201).json({
      message: 'Account created successfully.',
      user: { id: user._id, email: user.email, name: user.name, role: user.role }
    });
  } catch (err) {
    next(err);
  }
});

/* ── POST /api/auth/login ────────────────────────────────────────────────── */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await Student.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      // Deliberately vague to prevent user enumeration
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account is deactivated. Contact support.' });
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = signToken(user);

    res.status(200).json({
      message: 'Login successful.',
      token,
      user: { id: user._id, email: user.email, name: user.name, role: user.role }
    });
  } catch (err) {
    next(err);
  }
});

/* ── POST /api/auth/logout ───────────────────────────────────────────────── */
// JWT is stateless; logout is handled client-side by clearing the token.
// This endpoint exists so the frontend has a consistent API contract.
router.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out successfully.' });
});

/* ── GET /api/auth/verify ────────────────────────────────────────────────── */
router.get('/verify', protect, async (req, res, next) => {
  try {
    const user = await Student.findById(req.user.id).select('-password');
    if (!user) return res.status(401).json({ valid: false, error: 'User not found.' });
    res.status(200).json({ valid: true, user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
