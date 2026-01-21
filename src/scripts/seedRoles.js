const { connectToDatabase } = require('../db/connection');
const Role = require('../models/Role');

async function seedRoles() {
  try {
    await connectToDatabase();
    console.log('Connected to database');

    // Check existing roles
    const existingRoles = await Role.find();
    console.log('Existing roles:', existingRoles);

    if (existingRoles.length === 0) {
      // Create default roles
      const defaultRoles = [
        {
          name: 'admin',
          description: 'Administrator with full system access',
          isActive: true
        },
        {
          name: 'moderator',
          description: 'Moderator with limited administrative access',
          isActive: true
        },
        {
          name: 'user',
          description: 'Regular user with standard access',
          isActive: true
        },
        {
          name: 'guest',
          description: 'Guest user with read-only access',
          isActive: true
        }
      ];

      await Role.insertMany(defaultRoles);
      console.log('✓ Default roles created successfully:');
      defaultRoles.forEach(role => {
        console.log(`  - ${role.name}: ${role.description}`);
      });
    } else {
      console.log(`Roles already exist (${existingRoles.length} roles found):`);
      existingRoles.forEach(role => {
        console.log(`  - ${role.name} (Active: ${role.isActive})`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding roles:', error);
    process.exit(1);
  }
}

seedRoles();
