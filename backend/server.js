// Shastra Platform - Phase 3: Student Dashboard
// Main Express server entry point

const express      = require('express');
const cors         = require('cors');
const bodyParser   = require('body-parser');
const dotenv       = require('dotenv');
const connectDB    = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const healthRoutes  = require('./routes/health');
const authRoutes    = require('./routes/auth');
const metricsRoutes = require('./routes/metrics');
const studentsRoutes = require('./routes/students');

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5001;

// ── Database ───────────────────────────────────────────────────────────────
connectDB().catch(() => {
  console.warn('⚠️  Running without database – auth/metrics endpoints will fail.');
});

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/health',   healthRoutes);
app.use('/api/auth',     authRoutes);
app.use('/api/metrics',  metricsRoutes);
app.use('/api/students', studentsRoutes);

// ── Error handler ──────────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start ──────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Shastra API running on http://localhost:${PORT}`);
  console.log(`   Environment : ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
