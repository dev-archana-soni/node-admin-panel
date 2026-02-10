const mongoose = require('mongoose');
require('dotenv').config();

const { mongoUri } = require('../config/config');
const Module = require('../models/Module');
const Permission = require('../models/Permission');
const Role = require('../models/Role');

const ordersModule = {
  name: 'orders',
  displayName: 'Orders',
  description: 'Order management module',
  icon: 'mdi-receipt-text',
  isActive: true
};

const ordersPermissions = [
  { name: 'orders.view', description: 'View orders' },
  { name: 'orders.create', description: 'Create orders' },
  { name: 'orders.edit', description: 'Edit orders' },
  { name: 'orders.delete', description: 'Delete orders' }
];

async function ensureModule() {
  const existing = await Module.findOne({ name: ordersModule.name });
  if (existing) {
    return existing;
  }
  return Module.create(ordersModule);
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
    console.log(`✓ Added orders permissions to ${roleName}`);
  } else {
    console.log(`✓ ${roleName} already has orders permissions`);
  }
}

async function runSeed() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const moduleDoc = await ensureModule();
    console.log('✓ Orders module ensured');

    const permissionIds = [];
    for (const perm of ordersPermissions) {
      const created = await ensurePermission(perm, moduleDoc._id);
      permissionIds.push(created._id);
      console.log(`✓ Permission ensured: ${perm.name}`);
    }

    await grantPermissionsToRole('admin', permissionIds);

    console.log('\n✓ Orders permissions ensured successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error ensuring orders permissions:', error);
    process.exit(1);
  }
}

runSeed();
