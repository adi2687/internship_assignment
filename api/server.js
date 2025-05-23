const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const upload = multer();

let schools = [];
let lastId = 0;

function calculateDistance(lat1, lon1, lat2, lon2) {
  const radLat1 = Math.PI * lat1 / 180;
  const radLat2 = Math.PI * lat2 / 180;
  const radDelta1 = Math.PI * (lat2 - lat1) / 180;
  const radDelta2 = Math.PI * (lon2 - lon1) / 180;

  const a = Math.sin(radDelta1 / 2) * Math.sin(radDelta1 / 2) +
            Math.cos(radLat1) * Math.cos(radLat2) *
            Math.sin(radDelta2 / 2) * Math.sin(radDelta2 / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  const R = 6371; 
  return R * c;
}

function validateSchoolData(data) {
  const { name, address, latitude, longitude } = data;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push('Name is required and must be a non-empty string');
  }

  if (!address || typeof address !== 'string' || address.trim() === '') {
    errors.push('Address is required and must be a non-empty string');
  }

  if (latitude === undefined || isNaN(parseFloat(latitude))) {
    errors.push('Latitude is required and must be a valid number');
  } else {
    const lat = parseFloat(latitude);
    if (lat < -90 || lat > 90) {
      errors.push('Latitude must be between -90 and 90 degrees');
    }
  }

  if (longitude === undefined || isNaN(parseFloat(longitude))) {
    errors.push('Longitude is required and must be a valid number');
  } else {
    const lon = parseFloat(longitude);
    if (lon < -180 || lon > 180) {
      errors.push('Longitude must be between -180 and 180 degrees');
    }
  }

  return errors;
}

app.use((req, res, next) => {
  console.log('Request Method:', req.method);
  console.log('Request URL:', req.url);
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Request Body:', req.body);
  next();
});

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to School Management API' });
});
app.post('/api/addSchool', upload.none(), async (req, res) => {
  try {
    console.log('Full request body:', req.body);
    
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: 'Request body is missing. Please provide the required data.'
      });
    }
    
    const name = req.body.name;
    const address = req.body.address;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    
    console.log('Extracted data:', { name, address, latitude, longitude });
    
    if (!name || !address || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, address, latitude, and longitude are all required.'
      });
    }
    
    const validationErrors = validateSchoolData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ success: false, errors: validationErrors });
    }

    lastId++;
    const newSchool = {
      id: lastId,
      name,
      address,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      created_at: new Date().toISOString()
    };
    
    schools.push(newSchool);

    res.status(201).json({
      success: true,
      message: 'School added successfully',
      data: newSchool
    });
  } catch (error) {
    console.error('Error adding school:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/api/listSchools', async (req, res) => {
  try {
    console.log('Query parameters:', req.query);
    
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;
    
    if (!latitude || !longitude || isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
      return res.status(400).json({
        success: false,
        message: 'Valid latitude and longitude parameters are required'
      });
    }

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    if (userLat < -90 || userLat > 90 || userLon < -180 || userLon > 180) {
      return res.status(400).json({
        success: false,
        message: 'Latitude must be between -90 and 90, and longitude must be between -180 and 180'
      });
    }

    const schoolsWithDistance = schools.map(school => {
      const distance = calculateDistance(
        userLat,
        userLon,
        school.latitude,
        school.longitude
      );
      return { ...school, distance };
    });

    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.status(200).json({
      success: true,
      message: 'Schools retrieved successfully',
      data: schoolsWithDistance
    });
  } catch (error) {
    console.error('Error listing schools:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = app;
