# Doctor Appointment System - Backend

## Overview

This is the backend server for the Doctor Appointment System, built with Node.js, Express.js, and MongoDB. It provides RESTful APIs for user authentication, appointment management, and doctor availability scheduling.

## Features

- **Authentication System**: JWT-based authentication
- **Role-Based Access Control**: Different access levels for patients, doctors, and admins
- **Appointment Management**: CRUD operations for appointments
- **Doctor Availability**: Manage doctor schedules and time slots
- **File Upload**: Support for profile pictures and medical documents
- **API Documentation**: Swagger UI for testing and documentation

## Tech Stack

- Node.js & Express.js
- MongoDB with Mongoose
- JWT for authentication
- Swagger for API documentation
- Multer for file uploads
- Cloudinary for file storage

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Appointments

- `POST /api/appointments` - Create new appointment
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get specific appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Users

- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get specific user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Setup Instructions

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env` file:

   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

3. Start the server:

   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## API Documentation

Access the Swagger documentation at:

```
http://localhost:5000/api-docs
```

## Error Handling

The API uses consistent error responses:

```json
{
  "message": "Error description",
  "error": "Optional error details"
}
```

Common status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Development Guidelines

1. Follow RESTful principles
2. Use async/await for asynchronous operations
3. Implement proper error handling
4. Add appropriate validation
5. Keep controllers thin, use services for business logic
6. Document new endpoints in Swagger

## Testing

To run tests:

```bash
npm test
```

## Deployment

1. Build the application:

   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Contributing

Please read the main project's CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.
