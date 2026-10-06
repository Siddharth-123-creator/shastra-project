// Shastra Platform - Phase 2: Authentication
// JWT verification middleware – protects routes from Phase 3 onwards

const jwt = require('jsonwebtoken');

/**
 * protect
 * Reads the Bearer token from the Authorization header, verifies it,
 * and attaches the decoded payload to req.user.
 * Rejects with 401 if the token is missing, malformed, or expired.
 */
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided', valid: false });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role, iat, exp }
    next();
  } catch (err) {
    const message = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
    return res.status(401).json({ error: message, valid: false });
  }
};

module.exports = { protect };
