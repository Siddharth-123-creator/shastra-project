// Shastra Platform - Phase 2: Authentication
// Student Mongoose schema

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const metricsSchema = new mongoose.Schema({
  concentration: { type: Number, default: 0, min: 0, max: 100 },
  selfReliance:  { type: Number, default: 0, min: 0, max: 100 },
  perseverance:  { type: Number, default: 0, min: 0, max: 100 },
  confidence:    { type: Number, default: 0, min: 0, max: 100 },
  character:     { type: Number, default: 0, min: 0, max: 100 }
}, { _id: false });

const studentSchema = new mongoose.Schema({
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:  { type: String, required: true, minlength: 6 },
  name:      { type: String, required: true, trim: true },
  role:      { type: String, enum: ['student', 'teacher'], default: 'student' },
  class:     { type: String, default: '' },
  school:    { type: String, default: '' },
  isActive:  { type: Boolean, default: true },
  lastLogin: { type: Date, default: null },
  metrics:   { type: metricsSchema, default: () => ({}) },
  badges:    { type: [String], default: [] }
}, { timestamps: true });

// Hash password before saving
studentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare plain password against stored hash
studentSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

// Strip password from any JSON output
studentSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('Student', studentSchema);
