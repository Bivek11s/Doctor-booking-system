# Doctor Appointment Backend

Backend server for the Doctor Appointment application with authentication and role-based access control.

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)

### Setup Steps

1. **Clone and Install Dependencies**

   ```bash
   git clone <repository-url>
   cd backend
   npm install
   ```

2. **Start the Server**

   ```bash
   # Development mode with nodemon
   npm run dev
   ```

   Server will run on http://localhost:5000

## 📚 API Documentation

- Swagger documentation available at: http://localhost:5000/api-docs
- Test APIs directly from the Swagger UI

### Available Endpoints

#### Authentication

- POST `/api/auth/register` - Register new user
  - Supports multipart/form-data for profile picture
- POST `/api/auth/login` - Login with email/phone

## 🔗 Testing Guide

### 1. Start the Server

```bash
# Make sure MongoDB is running first
# Then start the server
npm run dev

# You should see:
# Server running on port 5000
# MongoDB connected successfully
```

### 2. Register a New User

#### Using Postman:

1. Open Postman
2. Create a new POST request to `http://localhost:5000/api/auth/register`
3. In the request body:
   - Select `form-data`
   - Add the following fields:
     ```
     email: test@example.com
     password: password123
     phone: 1234567890
     role: patient
     profilePic: [select a file] (optional)
     ```
4. Click Send

#### Using Swagger UI:

1. Open http://localhost:5000/api-docs in your browser
2. Find the `/api/auth/register` endpoint
3. Click "Try it out"
4. Fill in the request body:
   ```json
   {
     "email": "test@example.com",
     "password": "password123",
     "phone": "1234567890",
     "role": "patient"
   }
   ```
5. Click "Execute"

### 3. Login

#### Using Postman:

1. Create a new POST request to `http://localhost:5000/api/auth/login`
2. Set body to raw JSON:
   ```json
   {
     "emailOrPhone": "test@example.com",
     "password": "password123"
   }
   ```
3. Click Send

#### Using Swagger UI:

1. Go to `/api/auth/login` endpoint
2. Click "Try it out"
3. Enter credentials:
   ```json
   {
     "emailOrPhone": "test@example.com",
     "password": "password123"
   }
   ```
4. Click "Execute"

### 4. Expected Responses

#### Successful Registration:

```json
{
  "user": {
    "id": "user_id",
    "email": "test@example.com",
    "phone": "1234567890",
    "role": "patient",
    "isVerified": true,
    "profilePic": "profile_pic_url"
  },
  "message": "User registered successfully"
}
```

#### Successful Login:

```json
{
  "user": {
    "id": "user_id",
    "email": "test@example.com",
    "phone": "1234567890",
    "role": "patient",
    "isVerified": true,
    "profilePic": "profile_pic_url"
  },
  "message": "Login successful"
}
```

## 🔗 Frontend Integration

1. **Example API Calls**

   ```javascript
   // Example using axios
   import axios from "axios";

   // Register user
   const registerUser = async (formData) => {
     try {
       const response = await axios.post(
         `http://localhost:5000/api/auth/register`,
         formData,
         {
           headers: {
             "Content-Type": "multipart/form-data",
           },
         }
       );
       return response.data;
     } catch (error) {
       console.error("Registration failed:", error.response?.data);
       throw error;
     }
   };

   // Login user
   const loginUser = async (credentials) => {
     try {
       const response = await axios.post(
         `http://localhost:5000/api/auth/login`,
         credentials
       );
       return response.data;
     } catch (error) {
       console.error("Login failed:", error.response?.data);
       throw error;
     }
   };
   ```

## 🔒 Error Handling

The API returns consistent error responses:

```javascript
{
  "message": "Error message here"
}
```

Common status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 500: Server Error

## 🧪 Testing the API

1. Use Swagger UI at http://localhost:5000/api-docs
2. Use Postman or similar tools
3. Test user credentials:
   ```json
   {
     "email": "test@example.com",
     "password": "password123",
     "role": "patient"
   }
   ```

## 💡 Tips

- Always handle API errors on the frontend
- Implement loading states for API calls
- Use environment variables for configuration
- Check the Swagger documentation for detailed request/response schemas
