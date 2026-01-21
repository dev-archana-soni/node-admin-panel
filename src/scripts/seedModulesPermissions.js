const mongoose = require('mongoose');
require('dotenv').config();

const Module = require('../models/Module');
const Permission = require('../models/Permission');
const Role = require('../models/Role');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ips-admin';

const modules = [
  {
    name: 'users',
    displayName: 'Users',
    description: 'User management module',
    icon: 'mdi-account-multiple',
    isActive: true
  },
  {
    name: 'roles',
    displayName: 'Roles',
    description: 'Role management module',
    icon: 'mdi-security',
    isActive: true
  },
  {
    name: 'permissions',
    displayName: 'Permissions',
    description: 'Permission management module',
    icon: 'mdi-lock-multiple',
    isActive: true
  },
  {
    name: 'dashboard',
    displayName: 'Dashboard',
    description: 'Dashboard module',
    icon: 'mdi-home-dashboard',
    isActive: true
  },
  {
    name: 'profile',
    displayName: 'Profile',
    description: 'User profile module',
    icon: 'mdi-account',
    isActive: true
  }
];

const permissionsConfig = {
  users: [
    { name: 'users.view', description: 'View users' },
    { name: 'users.create', description: 'Create users' },
    { name: 'users.update', description: 'Update users' },
    { name: 'users.delete', description: 'Delete users' }
  ],
  roles: [
    { name: 'roles.view', description: 'View roles' },
    { name: 'roles.create', description: 'Create roles' },
    { name: 'roles.update', description: 'Update roles' },
    { name: 'roles.delete', description: 'Delete roles' }
  ],
  permissions: [
    { name: 'permissions.view', description: 'View permissions' },
    { name: 'permissions.create', description: 'Create permissions' },
    { name: 'permissions.update', description: 'Update permissions' },
    { name: 'permissions.delete', description: 'Delete permissions' }
  ],
  dashboard: [
    { name: 'dashboard.view', description: 'View dashboard' }
  ],
  profile: [
    { name: 'profile.view', description: 'View own profile' },
    { name: 'profile.update', description: 'Update own profile' },
    { name: 'profile.updatePassword', description: 'Update own password' }
  ]
};

async function seedData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Module.deleteMany({});
    await Permission.deleteMany({});
    console.log('Cleared existing modules and permissions');

    // Seed modules
    const createdModules = {};
    for (const moduleData of modules) {
      const newModule = await Module.create(moduleData);
      createdModules[moduleData.name] = newModule;
      console.log(`✓ Created module: ${moduleData.displayName}`);
    }

    // Seed permissions
    const createdPermissions = {};
    for (const [moduleName, perms] of Object.entries(permissionsConfig)) {
      const module = createdModules[moduleName];
      for (const perm of perms) {
        const newPermission = await Permission.create({
          name: perm.name,
          module: module._id,
          description: perm.description,
          isActive: true
        });
        createdPermissions[perm.name] = newPermission;
        console.log(`✓ Created permission: ${perm.name}`);
      }
    }

    // Update roles with permissions
    const adminRole = await Role.findOne({ name: 'admin' });
    const userRole = await Role.findOne({ name: 'user' });
    const moderatorRole = await Role.findOne({ name: 'moderator' });

    if (adminRole) {
      adminRole.permissions = Object.values(createdPermissions).map(p => p._id);
      await adminRole.save();
      console.log('✓ Updated admin role with all permissions');
    }

    if (userRole) {
      userRole.permissions = [
        createdPermissions['users.view'],
        createdPermissions['roles.view'],
        createdPermissions['permissions.view'],
        createdPermissions['dashboard.view'],
        createdPermissions['profile.view'],
        createdPermissions['profile.update'],
        createdPermissions['profile.updatePassword']
      ].map(p => p._id).filter(Boolean);
      await userRole.save();
      console.log('✓ Updated user role with view permissions');
    }

    if (moderatorRole) {
      moderatorRole.permissions = [
        createdPermissions['users.view'],
        createdPermissions['users.update'],
        createdPermissions['roles.view'],
        createdPermissions['permissions.view'],
        createdPermissions['dashboard.view'],
        createdPermissions['profile.view'],
        createdPermissions['profile.update'],
        createdPermissions['profile.updatePassword']
      ].map(p => p._id).filter(Boolean);
      await moderatorRole.save();
      console.log('✓ Updated moderator role with moderate permissions');
    }

    console.log('\n✓ Modules and permissions seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
