const { connectToDatabase } = require('../db/connection');
const Role = require('../models/Role');

async function activateRoles() {
  try {
    await connectToDatabase();
    console.log('Connected to database');

    // Activate all roles
    const result = await Role.updateMany({}, { isActive: true });
    console.log(`✓ Activated ${result.modifiedCount} roles`);

    // Show all roles
    const roles = await Role.find();
    console.log('\nCurrent roles:');
    roles.forEach(role => {
      console.log(`  - ${role.name} (Active: ${role.isActive})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error activating roles:', error);
    process.exit(1);
  }
}

activateRoles();
