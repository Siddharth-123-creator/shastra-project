// Shastra Platform - Phase 3: Student Dashboard
// StudentMetrics schema – stores one snapshot per student per day

const mongoose = require('mongoose');

const metricDetailSchema = new mongoose.Schema({
  base:        { type: Number, default: 0 },
  total:       { type: Number, default: 0, min: 0, max: 100 },
  breakdown:   { type: mongoose.Schema.Types.Mixed, default: {} }
}, { _id: false });

const studentMetricsSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    index: true
  },
  date: { type: Date, default: Date.now, index: true },

  concentration: { type: metricDetailSchema, default: () => ({}) },
  selfReliance:  { type: metricDetailSchema, default: () => ({}) },
  perseverance:  { type: metricDetailSchema, default: () => ({}) },
  confidence:    { type: metricDetailSchema, default: () => ({}) },
  character:     { type: Number, default: 0, min: 0, max: 100 },

  // % change vs previous snapshot (positive = improved)
  weeklyChange: { type: Number, default: 0 },

  // Raw input data used during calculation (for auditability)
  rawInput: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('StudentMetrics', studentMetricsSchema);
