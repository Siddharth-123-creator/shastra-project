// Shastra Platform - Phase 1: Foundation
// config.js – shared constants used by all frontend scripts

'use strict';

const SHASTRA_CONFIG = Object.freeze({
  // Base URL for the Express API. Change to the production URL before deploying.
  API_BASE_URL: 'http://localhost:5000/api',

  // Named API endpoints – centralised here so a URL change only touches one file
  ENDPOINTS: {
    HEALTH:   '/health',
    LOGIN:    '/auth/login',    // Phase 2
    REGISTER: '/auth/register'  // Phase 2
  },

  // Application metadata
  APP_NAME:    'Shastra',
  APP_VERSION: '1.0.0',
  APP_PHASE:   'Phase 1 – Foundation',

  // The five core metrics tracked by the platform
  METRICS: [
    { key: 'concentration', label: 'Concentration', icon: '🧘', description: 'Sustained focus and deep attention' },
    { key: 'selfReliance',  label: 'Self-Reliance',  icon: '💪', description: 'Independence and inner strength' },
    { key: 'perseverance',  label: 'Perseverance',   icon: '🧗', description: 'Steady climb through challenges' },
    { key: 'confidence',    label: 'Confidence',     icon: '⭐', description: 'Belief in your own potential' },
    { key: 'character',     label: 'Character',      icon: '❤️', description: 'Virtue, integrity, and values' }
  ]
});

// Make globally accessible for other scripts
window.SHASTRA_CONFIG = SHASTRA_CONFIG;
