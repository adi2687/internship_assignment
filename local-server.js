// Local development server
const app = require('./api/server');

// Set port and start server
const PORT = process.env.PORT || 3000;

console.log('Starting local development server...');
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
