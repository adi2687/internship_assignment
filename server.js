const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
require('dotenv').config();

// Import routes and database utilities
const schoolRoutes = require('./routes/schoolRoutes');
const { initialize } = require('./utils/dbInit');

// Initialize express app
const app = express();

// Middleware
app.use(cors());

// Body parsing middleware - ensure this comes before routes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Set up multer for handling multipart/form-data
const upload = multer();


// Debug middleware to log request body
app.use((req, res, next) => {
  console.log('Request Method:', req.method);
  console.log('Request URL:', req.url);
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Request Body:', req.body);
  next();
});

// Routes
app.use('/api', schoolRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to School Management API' });
});

// Set port and start server
const PORT = process.env.PORT || 3000;

// Initialize database and start server
console.log('Starting server initialization...');
initialize().then(() => {
  console.log('Database initialized, starting HTTP server...');
  
  try {
    const server = app.listen(PORT, () => {
      console.log(`=================================================`);
      console.log(`Server is running on port ${PORT}`);
      console.log(`=================================================`);
      console.log('API endpoints available at:');
      console.log(`- Add School: http://localhost:${PORT}/api/addSchool`);
      console.log(`- List Schools: http://localhost:${PORT}/api/listSchools?latitude=12.345678&longitude=98.765432`);
      console.log(`=================================================`);
      console.log('Server is ready to accept requests');
    });
    
    // Keep the server running
    server.on('error', (error) => {
      console.error('Server error:', error);
    });
    
    // Prevent the Node.js application from crashing
    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err);
      console.log('Server will continue running');
    });
    
    // Handle process termination
    process.on('SIGINT', () => {
      console.log('Gracefully shutting down from SIGINT (Ctrl+C)');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
    
    // Keep the process alive
    console.log('Setting up keepalive...');
    setInterval(() => { console.log('Server is still running...'); }, 60000);
  } catch (error) {
    console.error('Error starting server:', error);
  }
}).catch(err => {
  console.error('Failed to start server:', err);
  console.error('Error details:', err.stack);
  // Keep the process running to see the error
  console.log('Press Ctrl+C to exit');
});
