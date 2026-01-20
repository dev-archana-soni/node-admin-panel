const app = require('./app');
const { port } = require('./config/config');
const { connectToDatabase } = require('./db/connection');

(async () => {
  try {
    await connectToDatabase();
    app.listen(port, () => {
      console.log(`Auth API listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
})();
