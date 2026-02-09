const mongoose = require('mongoose');
require('dotenv').config();

const { mongoUri } = require('../config/config');
const Permission = require('../models/Permission');
const Role = require('../models/Role');

async function grantPermissionToRole(roleName, permissionId) {
  const role = await Role.findOne({ name: roleName });
  if (!role) {
    console.log(`! Role not found: ${roleName}`);
    return;
  }

  const existing = new Set((role.permissions || []).map(id => id.toString()));
  if (!existing.has(permissionId.toString())) {
    role.permissions = [...(role.permissions || []), permissionId];
    await role.save();
    console.log(`✓ Added roles.edit to ${roleName}`);
  } else {
    console.log(`✓ ${roleName} already has roles.edit`);
  }
}

async function runSeed() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const permission = await Permission.findOne({ name: 'roles.edit' }).select('_id').lean();
    if (!permission) {
      console.log('! Permission roles.edit not found');
      process.exit(1);
      return;
    }

    await grantPermissionToRole('admin', permission._id);
    await grantPermissionToRole('user', permission._id);

    console.log('\n✓ Role permissions updated');
    process.exit(0);
  } catch (error) {
    console.error('Error granting roles.edit:', error);
    process.exit(1);
  }
}

runSeed();
