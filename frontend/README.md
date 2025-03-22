# Doctor Appointment Frontend

This is the frontend application for the Doctor Appointment System. It provides a user interface to interact with the backend API for managing doctor appointments, user registration, and doctor verification.

## Features

- User authentication (login/register)
- Role-based access control (admin, doctor, patient)
- Doctor verification workflow
- User profile management
- Doctors and patients directory
- Responsive design with Tailwind CSS

## Tech Stack

- React.js
- React Router for navigation
- Axios for API requests
- React Context API for state management
- Tailwind CSS for styling
- Vite as build tool

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Backend API running on http://localhost:5000

### Installation

1. Clone the repository
2. Navigate to the frontend directory
3. Install dependencies:

```bash
npm install
# or
yarn
```

### Development

Start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at http://localhost:3000

### Building for Production

```bash
npm run build
# or
yarn build
```

## API Integration

The frontend communicates with the backend API through the following endpoints:

- Authentication: `/api/auth/login`, `/api/auth/register`
- Users: `/api/users`, `/api/users/:userId`
- Doctor verification: `/api/auth/verify-doctor`

## Project Structure

```
src/
├── components/       # Reusable UI components
├── contexts/         # React Context providers
├── pages/            # Application pages
├── App.jsx           # Main application component
├── main.jsx          # Application entry point
└── index.css         # Global styles
```
