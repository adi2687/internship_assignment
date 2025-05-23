const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
require('dotenv').config();

const schoolRoutes = require('../routes/schoolRoutes');
const { initialize } = require('../utils/dbInit');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const upload = multer();


app.use((req, res, next) => {
  console.log('Request Method:', req.method);
  console.log('Request URL:', req.url);
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Request Body:', req.body);
  next();
});

app.use('/api', schoolRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to School Management API' });
});

const PORT = process.env.PORT || 3000;

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
    
    server.on('error', (error) => {
      console.error('Server error:', error);
    });
    
    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err);
      console.log('Server will continue running');
    });
    
    process.on('SIGINT', () => {
      console.log('Gracefully shutting down from SIGINT (Ctrl+C)');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
    
    console.log('Setting up keepalive...');
    setInterval(() => { console.log('Server is still running...'); }, 60000);
  } catch (error) {
    console.error('Error starting server:', error);
  }
}).catch(err => {
  console.error('Failed to start server:', err);
  console.error('Error details:', err.stack);
  console.log('Press Ctrl+C to exit');
});
