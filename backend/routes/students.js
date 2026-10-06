// Shastra Platform - Phase 3: Student Dashboard
// Student data routes

const express        = require('express');
const Student        = require('../models/Student');
const StudentMetrics = require('../models/StudentMetrics');
const Activity       = require('../models/Activity');
const { protect }    = require('../middleware/auth');

const router = express.Router();

/* ── GET /api/students/:id ───────────────────────────────────────────────── */
router.get('/:id', protect, async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const student = await Student.findById(req.params.id).select('-password');
    if (!student) return res.status(404).json({ error: 'Student not found.' });

    res.json({
      id:          student._id,
      name:        student.name,
      email:       student.email,
      role:        student.role,
      class:       student.class,
      school:      student.school,
      joinedDate:  student.createdAt,
      lastLogin:   student.lastLogin
    });
  } catch (err) {
    next(err);
  }
});

/* ── GET /api/students/:id/activity ─────────────────────────────────────── */
router.get('/:id/activity', protect, async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const activities = await Activity
      .find({ studentId: req.params.id })
      .sort({ timestamp: -1 })
      .limit(limit);

    res.json(activities);
  } catch (err) {
    next(err);
  }
});

/* ── GET /api/students/:id/progress ─────────────────────────────────────── */
router.get('/:id/progress', protect, async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const now       = new Date();
    const weekStart = new Date(now - 7  * 24 * 60 * 60 * 1000);
    const monStart  = new Date(now - 30 * 24 * 60 * 60 * 1000);

    const [weekActivities, monActivities, allActivities, student] = await Promise.all([
      Activity.find({ studentId: req.params.id, timestamp: { $gte: weekStart } }),
      Activity.find({ studentId: req.params.id, timestamp: { $gte: monStart  } }),
      Activity.find({ studentId: req.params.id }),
      Student.findById(req.params.id).select('createdAt')
    ]);

    const summarise = (acts) => ({
      tasksCompleted: acts.filter(a => a.type === 'task_completed').length,
      totalPoints:    acts.reduce((s, a) => s + (a.points || 0), 0)
    });

    res.json({
      thisWeek:  summarise(weekActivities),
      thisMonth: summarise(monActivities),
      allTime: {
        ...summarise(allActivities),
        joinDate: student?.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
