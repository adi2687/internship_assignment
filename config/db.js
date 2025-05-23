const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();
const path = require('path');

// Create a Sequelize instance with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: console.log
});

// Define School model
const School = sequelize.define('School', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// Function to initialize database and create tables
async function initDatabase() {
  try {
    console.log('Attempting to connect to SQLite database...');
    
    // Test the connection
    await sequelize.authenticate();
    console.log('Connection to SQLite database has been established successfully.');
    
    // Sync all models with the database
    console.log('Syncing database models...');
    await sequelize.sync();
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    console.error('Error details:', error.stack);
    throw error;
  }
}

module.exports = {
  sequelize,
  School,
  initDatabase
};
