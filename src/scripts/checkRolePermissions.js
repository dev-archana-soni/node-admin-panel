const mongoose = require('mongoose');
require('dotenv').config();

const { mongoUri } = require('../config/config');
const Role = require('../models/Role');
require('../models/Permission');

async function runCheck() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const roleName = process.argv[2] || 'admin';
    const role = await Role.findOne({ name: roleName })
      .populate('permissions', 'name isActive')
      .lean();

    if (!role) {
      console.log(`Role not found: ${roleName}`);
      process.exit(1);
      return;
    }

    console.log(`Role: ${role.name}`);
    console.log(`Active: ${role.isActive}`);
    console.log('Permissions:');
    (role.permissions || []).forEach((perm) => {
      console.log(`- ${perm.name} (active: ${perm.isActive})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error checking role permissions:', error);
    process.exit(1);
  }
}

runCheck();
