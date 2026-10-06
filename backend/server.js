// Shastra Platform - Phase 1: Foundation
// Main Express server entry point

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');
const healthRoutes = require('./routes/health');
const authRoutes = require('./routes/auth');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────────────────────────

// Enable CORS so the frontend (localhost:3000) can reach this API
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Parse incoming JSON request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ── Routes ─────────────────────────────────────────────────────────────────────

// Health check: verifies the API is reachable from the frontend
app.use('/api/health', healthRoutes);

// Auth routes: login/register – empty placeholder for Phase 2
app.use('/api/auth', authRoutes);

// ── Global Error Handler ───────────────────────────────────────────────────────
// Must be registered last so it catches errors from all routes above
app.use(errorHandler);

// ── Start Server ───────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Shastra API running on http://localhost:${PORT}`);
  console.log(`   Environment : ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
