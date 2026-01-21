const mongoose = require('mongoose');
require('dotenv').config();
const Permission = require('../models/Permission');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ips-admin';

async function activatePermissions() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB\n');

    // Find the inactive permissions
    const result = await Permission.updateMany(
      { isActive: false },
      { isActive: true }
    );

    console.log(`✓ Activated ${result.modifiedCount} permissions`);

    // Show all permissions
    const allPerms = await Permission.find().populate('module');
    console.log('\n=== ALL PERMISSIONS (NOW ACTIVE) ===');
    allPerms.forEach(p => {
      console.log(`${p.name} (${p.module?.displayName || 'Unknown'}) - Active: ${p.isActive}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

activatePermissions();
