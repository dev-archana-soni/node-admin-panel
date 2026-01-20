require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connectToDatabase } = require('../db/connection');
const User = require('../models/User');

async function main() {
  try {
    await connectToDatabase();

    const email = process.env.SEED_EMAIL || 'admin@example.com';
    const password = process.env.SEED_PASSWORD || 'Admin@123';
    const name = process.env.SEED_NAME || 'Admin User';
    const role = process.env.SEED_ROLE || 'admin';

    const existing = await User.findOne({ email });
    if (existing) {
      console.log(`User already exists for email ${email}`);
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ email, passwordHash, name, role });
    console.log(`Seeded user ${email} with password ${password}`);
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
}

main();
