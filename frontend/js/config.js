// Shastra Platform - Phase 1: Foundation
// config.js – shared constants used by all frontend scripts

'use strict';

const SHASTRA_CONFIG = Object.freeze({
  API_BASE_URL: 'http://localhost:5001/api',

  ENDPOINTS: {
    HEALTH:   '/health',
    LOGIN:    '/auth/login',
    REGISTER: '/auth/register'
  },

  APP_NAME:    'Shastra',
  APP_VERSION: '1.0.0',
  APP_PHASE:   'Phase 1 – Foundation',

  METRICS: [
    { key: 'concentration', label: 'Concentration', icon: '🧘', description: 'Sustained focus and deep attention across difficult tasks.' },
    { key: 'selfReliance',  label: 'Self-Reliance',  icon: '💪', description: 'Independence, inner strength, and ownership of your growth.' },
    { key: 'perseverance',  label: 'Perseverance',   icon: '🧗', description: 'Steady, consistent effort through every challenge.' },
    { key: 'confidence',    label: 'Confidence',     icon: '⭐', description: 'Earned belief in your own capabilities and voice.' },
    { key: 'character',     label: 'Character',      icon: '❤️', description: 'Integrity, virtue, and the values you live every day.' }
  ]
});

window.SHASTRA_CONFIG = SHASTRA_CONFIG;
