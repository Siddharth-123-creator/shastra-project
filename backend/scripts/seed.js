// Shastra Platform - Phase 3: Student Dashboard
// Seed script – creates test users, metrics, and activity data
// Usage: node scripts/seed.js

const path           = require('path');
const dotenv         = require('dotenv');
const connectDB      = require('../config/database');
const Student        = require('../models/Student');
const StudentMetrics = require('../models/StudentMetrics');
const Activity       = require('../models/Activity');

dotenv.config({ path: path.join(__dirname, '../.env') });

const SEED_USERS = [
  { email: 'student@shastra.com', password: 'pass123', name: 'Rahul Singh',  role: 'student', class: '10-B', school: 'Delhi Public School' },
  { email: 'teacher@shastra.com', password: 'pass123', name: 'Priya Sharma', role: 'teacher', school: 'Delhi Public School' }
];

const ACTIVITIES = [
  { type: 'task_completed', title: 'Math Algebra Problem',      description: 'Solved quadratic equations',        points: 50 },
  { type: 'task_completed', title: 'English Grammar Exercise',  description: 'Tenses and subject-verb agreement', points: 40 },
  { type: 'task_completed', title: 'Science: Newton\'s Laws',   description: 'Force and motion problems',         points: 60 },
  { type: 'achievement_unlocked', title: '7-Day Streak!',       description: 'Logged in 7 days in a row',        points: 100 },
  { type: 'task_completed', title: 'History: Mughal Empire',    description: 'Timeline and key events',          points: 35 }
];

const METRICS_INPUT = {
  focusSeconds: 2700, totalSeconds: 3600,
  tabSwitches: 3, correctStreak: 5,
  tasksCompleted: 10, tasksWithoutHint: 8, hintReductionTrend: 1.2,
  totalRetries: 8, successfulRetries: 6, healthyAttempts: 7,
  selfRating: 70, actualScore: 72
};

function calcConc(d) {
  const fp = d.focusSeconds / d.totalSeconds;
  const base = Math.round(fp * 60);
  const sp = Math.min(d.tabSwitches * 4, 15);
  const sb = Math.min(d.correctStreak * 5, 25);
  return { base, breakdown: { switchPenalty: sp, streakBonus: sb, focusPct: Math.round(fp * 100) }, total: Math.max(0, Math.min(100, base - sp + sb)) };
}
function calcSelf(d) {
  const hintRate = (d.tasksCompleted - d.tasksWithoutHint) / d.tasksCompleted;
  const base = Math.round((1 - hintRate) * 60);
  const tb = Math.min((d.hintReductionTrend - 1) * 100, 25);
  return { base, breakdown: { hintRate: Math.round(hintRate * 100), trendBonus: tb }, total: Math.max(0, Math.min(100, base + tb + 15)) };
}
function calcPers(d) {
  const sr = d.totalRetries > 0 ? d.successfulRetries / d.totalRetries : 0;
  const base = Math.round(sr * 60);
  const hb = Math.min(d.healthyAttempts * 2, 35);
  return { base, breakdown: { successRate: Math.round(sr * 100), healthyBonus: hb }, total: Math.max(0, Math.min(100, base + hb + 5)) };
}
function calcConf(d) {
  const cal = 100 - Math.abs(d.selfRating - d.actualScore);
  return { base: cal, breakdown: { selfRating: d.selfRating, actualScore: d.actualScore }, total: Math.max(0, Math.min(100, cal)) };
}

(async () => {
  await connectDB();

  for (const userData of SEED_USERS) {
    let user = await Student.findOne({ email: userData.email });
    if (!user) {
      user = await Student.create(userData);
      console.log(`✅ Created ${user.role}: ${user.email}`);
    } else {
      console.log(`⏭  ${user.email} already exists`);
    }

    // Only seed metrics/activity for the student
    if (user.role !== 'student') continue;

    const existingMetrics = await StudentMetrics.findOne({ studentId: user._id });
    if (!existingMetrics) {
      const conc = calcConc(METRICS_INPUT);
      const self = calcSelf(METRICS_INPUT);
      const pers = calcPers(METRICS_INPUT);
      const conf = calcConf(METRICS_INPUT);
      const char = Math.round((conc.total + self.total + pers.total + conf.total) / 4);

      // Seed a "week ago" snapshot for trend calculation
      const weekAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000);
      await StudentMetrics.create({
        studentId: user._id, date: weekAgo,
        concentration: { ...conc, total: conc.total - 5 },
        selfReliance:  { ...self, total: self.total - 3 },
        perseverance:  { ...pers, total: pers.total - 2 },
        confidence:    { ...conf, total: conf.total - 4 },
        character: char - 4
      });

      await StudentMetrics.create({
        studentId: user._id,
        concentration: conc, selfReliance: self, perseverance: pers, confidence: conf, character: char
      });
      console.log(`   📊 Metrics seeded (character: ${char}/100)`);
    }

    const existingActivity = await Activity.findOne({ studentId: user._id });
    if (!existingActivity) {
      for (let i = 0; i < ACTIVITIES.length; i++) {
        await Activity.create({
          studentId: user._id,
          ...ACTIVITIES[i],
          timestamp: new Date(Date.now() - (i + 1) * 2 * 60 * 60 * 1000)
        });
      }
      console.log(`   📋 ${ACTIVITIES.length} activities seeded`);
    }
  }

  console.log('\n✅ Seed complete.');
  console.log('   student@shastra.com / pass123');
  console.log('   teacher@shastra.com / pass123');
  process.exit(0);
})();
