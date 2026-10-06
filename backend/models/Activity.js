// Shastra Platform - Phase 3: Student Dashboard
// Activity schema – tracks student actions (tasks, logins, achievements)

const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['task_completed', 'login', 'achievement_unlocked', 'metric_updated'],
    required: true
  },
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  points:      { type: Number, default: 0 },
  timestamp:   { type: Date,   default: Date.now, index: true }
}, { timestamps: false });

module.exports = mongoose.model('Activity', activitySchema);
