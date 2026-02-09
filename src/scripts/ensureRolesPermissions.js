const mongoose = require('mongoose');
require('dotenv').config();

const { mongoUri } = require('../config/config');
const Module = require('../models/Module');
const Permission = require('../models/Permission');
const Role = require('../models/Role');

const rolesModule = {
  name: 'roles',
  displayName: 'Roles',
  description: 'Role management module',
  icon: 'mdi-security',
  isActive: true
};

const rolesPermissions = [
  { name: 'roles.view', description: 'View roles' },
  { name: 'roles.create', description: 'Create roles' },
  { name: 'roles.edit', description: 'Edit roles' },
  { name: 'roles.delete', description: 'Delete roles' }
];

async function ensureModule() {
  const existing = await Module.findOne({ name: rolesModule.name });
  if (existing) {
    return existing;
  }
  return Module.create(rolesModule);
}

async function ensurePermission(permissionData, moduleId) {
  const existing = await Permission.findOne({ name: permissionData.name });
  if (existing) {
    return existing;
  }
  return Permission.create({
    name: permissionData.name,
    module: moduleId,
    description: permissionData.description,
    isActive: true
  });
}

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

    const moduleDoc = await ensureModule();
    console.log('✓ Roles module ensured');

    let rolesEditPermission = null;
    for (const perm of rolesPermissions) {
      const created = await ensurePermission(perm, moduleDoc._id);
      if (perm.name === 'roles.edit') {
        rolesEditPermission = created;
      }
      console.log(`✓ Permission ensured: ${perm.name}`);
    }

    if (rolesEditPermission) {
      await grantPermissionToRole('admin', rolesEditPermission._id);
      await grantPermissionToRole('user', rolesEditPermission._id);
    }

    console.log('\n✓ Roles permissions ensured successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error ensuring roles permissions:', error);
    process.exit(1);
  }
}

runSeed();
