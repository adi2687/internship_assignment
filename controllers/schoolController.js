const { School } = require('../config/db');

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

exports.addSchool = async (req, res) => {
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

    const school = await School.create({
      name,
      address,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
    });

    res.status(201).json({
      success: true,
      message: 'School added successfully',
      data: {
        id: school.id,
        name: school.name,
        address: school.address,
        latitude: school.latitude,
        longitude: school.longitude
      }
    });
  } catch (error) {
    console.error('Error adding school:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.listSchools = async (req, res) => {
  try {
    console.log('Query parameters:', req.query);
    
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;
    
    // Validate user coordinates
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

    const schools = await School.findAll();

    const schoolsWithDistance = schools.map(school => {
      const schoolData = school.get({ plain: true });
      const distance = calculateDistance(
        userLat,
        userLon,
        schoolData.latitude,
        schoolData.longitude
      );
      return { ...schoolData, distance };
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
};
