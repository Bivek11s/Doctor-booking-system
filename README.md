# Doctor Appointment System

A comprehensive web application for managing doctor appointments, built with React.js for the frontend and Node.js/Express.js for the backend.

## Features

- **User Authentication**: Secure login and registration system for patients, doctors, and administrators
- **Role-Based Access**: Different dashboards and functionalities for patients, doctors, and administrators
- **Appointment Management**: Schedule, view, and manage appointments
- **Doctor Availability**: Doctors can set and manage their availability schedules
- **Real-time Notifications**: Get notified about appointment updates and changes
- **Profile Management**: Users can manage their profiles and personal information
- **Admin Dashboard**: Comprehensive admin panel for system management

## Project Structure

```
├── frontend/          # React.js frontend application
├── backend/           # Node.js/Express.js backend API
├── README.md         # Main project documentation
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- MongoDB database

## Getting Started

1. Clone the repository:

   ```bash
   git clone [repository-url]
   cd Doctor-Appointment-System
   ```

2. Set up the backend:

   ```bash
   cd backend
   npm install
   # Configure environment variables in .env file
   npm run dev
   ```

3. Set up the frontend:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## Available Scripts

In both frontend and backend directories:

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Start production server (backend only)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
