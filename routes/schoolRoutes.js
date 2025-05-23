const express = require('express');
const router = express.Router();
const multer = require('multer');
const { addSchool, listSchools } = require('../controllers/schoolController');

// Set up multer for handling multipart/form-data
const upload = multer();

// Add School route - handle both JSON and form data
router.post('/addSchool', upload.none(), addSchool);

// List Schools route
router.get('/listSchools', listSchools);

module.exports = router;
