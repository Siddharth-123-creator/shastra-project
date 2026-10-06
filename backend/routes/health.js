// Shastra Platform - Phase 1: Foundation
// Health check route – lets the frontend confirm the API is reachable

const express = require('express');
const router = express.Router();

// GET /api/health
// Returns a lightweight status object. The frontend calls this on page load
// to verify connectivity before rendering interactive UI.
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Shastra API running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    phase: 'Phase 1 – Foundation'
  });
});

module.exports = router;
