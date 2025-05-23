const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: console.log
});

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

async function initDatabase() {
  try {
    console.log('Attempting to connect to SQLite database...');
    
    await sequelize.authenticate();
    console.log('Connection to SQLite database has been established successfully.');
    
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
