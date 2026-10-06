// Shastra Platform - Phase 3: Student Dashboard
// Metrics routes + calculation engine

const express        = require('express');
const StudentMetrics = require('../models/StudentMetrics');
const Activity       = require('../models/Activity');
const { protect }    = require('../middleware/auth');

const router = express.Router();

/* ── Calculation helpers ─────────────────────────────────────────────────── */

function calculateConcentration(data) {
  const focusPct      = data.totalSeconds > 0 ? data.focusSeconds / data.totalSeconds : 0;
  const base          = Math.round(focusPct * 60);
  const switchPenalty = Math.min((data.tabSwitches || 0) * 4, 15);
  const streakBonus   = Math.min((data.correctStreak || 0) * 5, 25);
  const total         = Math.max(0, Math.min(100, base - switchPenalty + streakBonus));
  return { base, breakdown: { switchPenalty, streakBonus, focusPct: Math.round(focusPct * 100) }, total };
}

function calculateSelfReliance(data) {
  const tasksCompleted   = data.tasksCompleted || 1;
  const tasksWithoutHint = data.tasksWithoutHint || 0;
  const hintsUsed        = tasksCompleted - tasksWithoutHint;
  const hintRate         = hintsUsed / tasksCompleted;
  const base             = Math.round((1 - hintRate) * 60);
  const trendBonus       = Math.min(((data.hintReductionTrend || 1) - 1) * 100, 25);
  const total            = Math.max(0, Math.min(100, base + trendBonus + 15));
  return { base, breakdown: { hintsUsed, hintRate: Math.round(hintRate * 100), trendBonus }, total };
}

function calculatePerseverance(data) {
  const totalRetries      = data.totalRetries || 0;
  const successfulRetries = data.successfulRetries || 0;
  const successRate       = totalRetries > 0 ? successfulRetries / totalRetries : 0;
  const base              = Math.round(successRate * 60);
  const healthyBonus      = Math.min((data.healthyAttempts || 0) * 2, 35);
  const total             = Math.max(0, Math.min(100, base + healthyBonus + 5));
  return { base, breakdown: { successRate: Math.round(successRate * 100), healthyBonus }, total };
}

function calculateConfidence(data) {
  const selfRating   = data.selfRating   || 50;
  const actualScore  = data.actualScore  || 50;
  const calibration  = 100 - Math.abs(selfRating - actualScore);
  const total        = Math.max(0, Math.min(100, calibration));
  return { base: calibration, breakdown: { selfRating, actualScore }, total };
}

function calculateCharacter(conc, self, pers, conf) {
  return Math.round((conc + self + pers + conf) / 4);
}

/* ── GET /api/metrics/:studentId ─────────────────────────────────────────── */
router.get('/:studentId', protect, async (req, res, next) => {
  try {
    // Students can only read their own metrics
    if (req.user.id !== req.params.studentId && req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const latest = await StudentMetrics
      .findOne({ studentId: req.params.studentId })
      .sort({ date: -1 });

    if (!latest) {
      return res.status(404).json({ error: 'No metrics found for this student.' });
    }

    // Compute weekly trend: compare against snapshot from ~7 days ago
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const previous = await StudentMetrics
      .findOne({ studentId: req.params.studentId, date: { $lte: weekAgo } })
      .sort({ date: -1 });

    const trend = {};
    const keys  = ['concentration', 'selfReliance', 'perseverance', 'confidence'];
    keys.forEach((k) => {
      const now  = latest[k]?.total   || 0;
      const prev = previous?.[k]?.total || now;
      trend[k]   = now - prev;
    });

    res.json({
      concentration: latest.concentration,
      selfReliance:  latest.selfReliance,
      perseverance:  latest.perseverance,
      confidence:    latest.confidence,
      character:     latest.character,
      weeklyTrend:   trend,
      lastUpdated:   latest.updatedAt
    });
  } catch (err) {
    next(err);
  }
});

/* ── POST /api/metrics/calculate ─────────────────────────────────────────── */
router.post('/calculate', protect, async (req, res, next) => {
  try {
    const { studentId, ...inputData } = req.body;

    if (!studentId) return res.status(400).json({ error: 'studentId is required.' });
    if (req.user.id !== studentId && req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const conc = calculateConcentration(inputData);
    const self = calculateSelfReliance(inputData);
    const pers = calculatePerseverance(inputData);
    const conf = calculateConfidence(inputData);
    const char = calculateCharacter(conc.total, self.total, pers.total, conf.total);

    const snapshot = await StudentMetrics.create({
      studentId,
      concentration: conc,
      selfReliance:  self,
      perseverance:  pers,
      confidence:    conf,
      character:     char,
      rawInput:      inputData
    });

    // Log as activity
    await Activity.create({
      studentId,
      type:        'metric_updated',
      title:       'Metrics recalculated',
      description: `Character score: ${char}/100`,
      points:      char
    });

    res.status(201).json({ message: 'Metrics calculated.', snapshot });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
