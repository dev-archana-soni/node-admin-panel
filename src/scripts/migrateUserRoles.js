const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Role = require('../models/Role');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ips-admin';

async function migrateUserRoles() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Find all users
    const users = await User.find();
    console.log(`Found ${users.length} users to migrate`);

    let migratedCount = 0;

    for (const user of users) {
      // Check if role is already an ObjectId
      if (typeof user.role === 'object' && user.role._id) {
        console.log(`✓ User ${user.email} already has ObjectId role`);
        continue;
      }

      // Find the role by name
      const roleName = user.role || 'user';
      const role = await Role.findOne({ name: roleName });

      if (role) {
        user.role = role._id;
        await user.save();
        console.log(`✓ Migrated user ${user.email}: ${roleName} -> ${role._id}`);
        migratedCount++;
      } else {
        console.warn(`✗ Role "${roleName}" not found for user ${user.email}`);
      }
    }

    console.log(`\n✓ Migration complete! ${migratedCount} users updated.`);
    process.exit(0);
  } catch (error) {
    console.error('Error migrating users:', error);
    process.exit(1);
  }
}

migrateUserRoles();
