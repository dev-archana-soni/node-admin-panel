const mongoose = require('mongoose');
const { mongoUri } = require('../config/config');

async function connectToDatabase() {
  if (!mongoUri) {
    throw new Error('MONGO_URI is not configured');
  }

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000
  });
}

module.exports = {
  connectToDatabase
};
