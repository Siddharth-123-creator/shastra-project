// Shastra Platform - Phase 1: Foundation
// Global error-handling middleware

/**
 * errorHandler
 * Catches any error forwarded via next(err) from routes or other middleware.
 * Always returns JSON so the frontend can parse responses uniformly.
 *
 * Express recognises a four-argument middleware as an error handler.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;

  // Log the full stack in development; omit it in production to avoid leaking internals
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[Error] ${statusCode} – ${err.message}`);
    console.error(err.stack);
  }

  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    status: statusCode,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

module.exports = errorHandler;
