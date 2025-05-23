# School Management API

A Node.js API for School Management using Express.js and MySQL.

## Features

- Add new schools with name, address, and geographical coordinates
- List schools sorted by proximity to a user-specified location

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file in the root directory based on the provided `.env` file
   - Update the database credentials as needed

## Database Setup

The application will automatically create the required database and tables when started. Make sure your MySQL server is running and the credentials in the `.env` file are correct.

## Running the Application

```
npm start
```

The server will start on the port specified in the `.env` file (default: 3000).

## API Endpoints

### Add School

- **Endpoint**: `/api/addSchool`
- **Method**: POST
- **Payload**:
  ```json
  {
    "name": "School Name",
    "address": "School Address",
    "latitude": 12.345678,
    "longitude": 98.765432
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "School added successfully",
    "data": {
      "id": 1,
      "name": "School Name",
      "address": "School Address",
      "latitude": 12.345678,
      "longitude": 98.765432
    }
  }
  ```

### List Schools

- **Endpoint**: `/api/listSchools?latitude=12.345678&longitude=98.765432`
- **Method**: GET
- **Parameters**:
  - `latitude`: User's latitude
  - `longitude`: User's longitude
- **Response**:
  ```json
  {
    "success": true,
    "message": "Schools retrieved successfully",
    "data": [
      {
        "id": 1,
        "name": "School Name",
        "address": "School Address",
        "latitude": 12.345678,
        "longitude": 98.765432,
        "distance": 0.5
      },
      // More schools sorted by distance
    ]
  }
  ```

## Postman Collection

A Postman collection is included in the `postman` directory. Import this collection into Postman to test the API endpoints.

## Deployment

This API can be deployed to any Node.js hosting service such as:
- Heroku
- AWS Elastic Beanstalk
- DigitalOcean
- Vercel

Make sure to configure the environment variables on the hosting platform.
