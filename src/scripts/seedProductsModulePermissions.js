const mongoose = require('mongoose');
require('dotenv').config();

const { mongoUri } = require('../config/config');
const Module = require('../models/Module');
const Permission = require('../models/Permission');
const Role = require('../models/Role');

const modulesToEnsure = [
  {
    name: 'products',
    displayName: 'Products',
    description: 'Products management module',
    icon: 'mdi-package-variant-closed',
    isActive: true
  }
];

const permissionsToEnsure = [
  { name: 'products.view', description: 'View products', module: 'products' },
  { name: 'products.create', description: 'Create products', module: 'products' },
  { name: 'products.edit', description: 'Edit products', module: 'products' },
  { name: 'products.delete', description: 'Delete products', module: 'products' }
];

async function ensureModule(moduleData) {
  const existing = await Module.findOne({ name: moduleData.name });
  if (existing) {
    return existing;
  }
  return Module.create(moduleData);
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

async function ensureAdminHasAllPermissions() {
  const adminRole = await Role.findOne({ name: 'admin' });
  if (!adminRole) {
    return;
  }
  const allPermissions = await Permission.find().select('_id').lean();
  const existingIds = new Set((adminRole.permissions || []).map(id => id.toString()));
  const merged = [
    ...(adminRole.permissions || []),
    ...allPermissions
      .map(p => p._id)
      .filter(id => !existingIds.has(id.toString()))
  ];
  adminRole.permissions = merged;
  await adminRole.save();
}

async function runSeed() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const moduleMap = {};
    for (const moduleData of modulesToEnsure) {
      const moduleDoc = await ensureModule(moduleData);
      moduleMap[moduleData.name] = moduleDoc;
      console.log(`✓ Module ensured: ${moduleData.displayName}`);
    }

    for (const permData of permissionsToEnsure) {
      const moduleDoc = moduleMap[permData.module];
      if (!moduleDoc) {
        continue;
      }
      await ensurePermission(permData, moduleDoc._id);
      console.log(`✓ Permission ensured: ${permData.name}`);
    }

    await ensureAdminHasAllPermissions();
    console.log('✓ Admin role permissions refreshed');

    console.log('\n✓ Products module and permissions seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products permissions:', error);
    process.exit(1);
  }
}

runSeed();
