// Shastra Platform - Phase 2: Authentication
// Main Express server entry point

const express     = require('express');
const cors        = require('cors');
const bodyParser  = require('body-parser');
const dotenv      = require('dotenv');
const connectDB   = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const healthRoutes = require('./routes/health');
const authRoutes   = require('./routes/auth');

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5001;

// ── Database ───────────────────────────────────────────────────────────────
// Connect to MongoDB; non-blocking – server still starts if DB is down,
// but auth endpoints will error until the connection succeeds.
connectDB().catch(() => {
  console.warn('⚠️  Running without database – auth endpoints will fail.');
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
app.use('/api/health', healthRoutes);
app.use('/api/auth',   authRoutes);

// ── Error handler (must be last) ───────────────────────────────────────────
app.use(errorHandler);

// ── Start ──────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Shastra API running on http://localhost:${PORT}`);
  console.log(`   Environment : ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
