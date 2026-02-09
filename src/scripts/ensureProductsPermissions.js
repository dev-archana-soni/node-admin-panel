const mongoose = require('mongoose');
require('dotenv').config();

const { mongoUri } = require('../config/config');
const Module = require('../models/Module');
const Permission = require('../models/Permission');
const Role = require('../models/Role');

const productsModule = {
  name: 'products',
  displayName: 'Products',
  description: 'Products management module',
  icon: 'mdi-package-variant-closed',
  isActive: true
};

const productsPermissions = [
  { name: 'products.view', description: 'View products' },
  { name: 'products.create', description: 'Create products' },
  { name: 'products.edit', description: 'Edit products' },
  { name: 'products.delete', description: 'Delete products' }
];

async function ensureModule() {
  const existing = await Module.findOne({ name: productsModule.name });
  if (existing) {
    return existing;
  }
  return Module.create(productsModule);
}

async function ensurePermission(permissionData, moduleId) {
  const existing = await Permission.findOne({ name: permissionData.name });
  if (existing) {
    let changed = false;
    if (!existing.isActive) {
      existing.isActive = true;
      changed = true;
    }
    if (existing.description !== permissionData.description) {
      existing.description = permissionData.description;
      changed = true;
    }
    if (existing.module?.toString() !== moduleId.toString()) {
      existing.module = moduleId;
      changed = true;
    }
    if (changed) {
      await existing.save();
    }
    return existing;
  }
  return Permission.create({
    name: permissionData.name,
    module: moduleId,
    description: permissionData.description,
    isActive: true
  });
}

async function grantPermissionsToRole(roleName, permissionIds) {
  const role = await Role.findOne({ name: roleName });
  if (!role) {
    console.log(`! Role not found: ${roleName}`);
    return;
  }

  const existing = new Set((role.permissions || []).map(id => id.toString()));
  const toAdd = permissionIds.filter(id => !existing.has(id.toString()));
  if (toAdd.length) {
    role.permissions = [...(role.permissions || []), ...toAdd];
    await role.save();
    console.log(`✓ Added products permissions to ${roleName}`);
  } else {
    console.log(`✓ ${roleName} already has products permissions`);
  }
}

async function runSeed() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const moduleDoc = await ensureModule();
    console.log('✓ Products module ensured');

    const permissionIds = [];
    for (const perm of productsPermissions) {
      const created = await ensurePermission(perm, moduleDoc._id);
      permissionIds.push(created._id);
      console.log(`✓ Permission ensured: ${perm.name}`);
    }

    await grantPermissionsToRole('admin', permissionIds);
    await grantPermissionsToRole('user', permissionIds);

    console.log('\n✓ Products permissions ensured successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error ensuring products permissions:', error);
    process.exit(1);
  }
}

runSeed();
