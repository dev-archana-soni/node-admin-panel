const mongoose = require('mongoose');
require('dotenv').config();
const Permission = require('../models/Permission');
const Module = require('../models/Module');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ips-admin';

async function checkPermissions() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB\n');

    const perms = await Permission.find().populate('module');
    console.log('=== ALL PERMISSIONS WITH MODULES ===');
    perms.forEach(p => {
      console.log(`Permission: ${p.name}`);
      console.log(`  Module Name: ${p.module?.name || 'NULL'}`);
      console.log(`  Module ID: ${p.module?._id || 'NULL'}`);
      console.log(`  Description: ${p.description || 'N/A'}`);
      console.log(`  Active: ${p.isActive}`);
      console.log('---');
    });

    const mods = await Module.find();
    console.log('\n=== ALL MODULES ===');
    mods.forEach(m => {
      console.log(`Module: ${m.name}`);
      console.log(`  Display Name: ${m.displayName}`);
      console.log(`  ID: ${m._id}`);
      console.log(`  Active: ${m.isActive}`);
      console.log('---');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkPermissions();
