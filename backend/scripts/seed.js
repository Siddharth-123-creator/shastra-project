// Shastra Platform - Phase 2: Authentication
// Seed script – creates test users so login can be tested immediately
// Usage: node scripts/seed.js

const dotenv    = require('dotenv');
const connectDB = require('../config/database');
const Student   = require('../models/Student');

dotenv.config({ path: require('path').join(__dirname, '../.env') });

const SEED_USERS = [
  { email: 'student@shastra.com', password: 'pass123', name: 'Arjun Singh',   role: 'student', class: '10-A', school: 'Vivekananda High School' },
  { email: 'teacher@shastra.com', password: 'pass123', name: 'Priya Sharma',  role: 'teacher', school: 'Vivekananda High School' }
];

(async () => {
  await connectDB();

  for (const data of SEED_USERS) {
    const exists = await Student.findOne({ email: data.email });
    if (exists) {
      console.log(`⏭  ${data.email} already exists – skipping`);
      continue;
    }
    await Student.create(data);
    console.log(`✅ Created ${data.role}: ${data.email} / pass123`);
  }

  console.log('\nSeed complete. Test credentials:');
  console.log('  student@shastra.com  /  pass123');
  console.log('  teacher@shastra.com  /  pass123');
  process.exit(0);
})();
