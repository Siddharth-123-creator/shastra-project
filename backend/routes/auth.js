// Shastra Platform - Phase 1: Foundation
// Authentication routes – placeholder for Phase 2 (login / register)

const express = require('express');
const router = express.Router();

// POST /api/auth/register  (Phase 2)
router.post('/register', (req, res) => {
  res.status(501).json({ message: 'Register endpoint coming in Phase 2' });
});

// POST /api/auth/login  (Phase 2)
router.post('/login', (req, res) => {
  res.status(501).json({ message: 'Login endpoint coming in Phase 2' });
});

module.exports = router;
