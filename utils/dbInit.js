const { initDatabase } = require('../config/db');

// Function to initialize the database
async function initialize() {
  try {
    await initDatabase();
    console.log('Database initialization complete');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

module.exports = { initialize };
