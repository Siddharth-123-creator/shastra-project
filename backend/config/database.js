// Shastra Platform - Phase 1: Foundation
// Database connection configuration

// Database connection will be added in Phase 3
// This file scaffolds the connection factory so Phase 3 can drop it in cleanly.

const mongoose = require('mongoose');

/**
 * connectDatabase
 * Establishes a MongoDB connection using the URI stored in process.env.MONGO_URI.
 * Call this once from server.js when the database integration is ready (Phase 3).
 */
const connectDatabase = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error('MONGO_URI is not set in environment variables.');
    }

    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    // Exit the process so a broken DB state is visible immediately in CI/CD
    process.exit(1);
  }
};

module.exports = connectDatabase;
