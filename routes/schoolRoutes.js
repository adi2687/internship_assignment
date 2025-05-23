const express = require('express');
const router = express.Router();
const multer = require('multer');
const { addSchool, listSchools } = require('../controllers/schoolController');

const upload = multer();

router.post('/addSchool', upload.none(), addSchool);

router.get('/listSchools', listSchools);

module.exports = router;
