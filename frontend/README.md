# Doctor Appointment System - Frontend

## Overview

This is the frontend application for the Doctor Appointment System, built with React.js and Vite. It provides a modern, responsive user interface for managing doctor appointments, user profiles, and schedules.

## Features

- **User Authentication**: Secure login and registration
- **Role-Based Dashboards**:
  - Patient Dashboard: Book appointments, view history
  - Doctor Dashboard: Manage availability, view appointments
  - Admin Dashboard: System management
- **Appointment Management**: Schedule and manage appointments
- **Profile Management**: Update personal information and preferences
- **Real-time Updates**: Instant notifications for appointment changes
- **Responsive Design**: Mobile-first approach

## Tech Stack

- React.js 18
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- Axios for API requests
- Context API for state management

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start development server:

   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   npm run preview
   ```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React Context providers
├── pages/          # Route components
├── utils/          # Helper functions
├── App.jsx         # Root component
└── main.jsx       # Entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000
```

## Development Guidelines

1. **Component Structure**

   - Use functional components with hooks
   - Keep components small and focused
   - Implement proper prop validation

2. **State Management**

   - Use Context API for global state
   - Keep component state minimal
   - Implement proper error handling

3. **Styling**

   - Follow Tailwind CSS conventions
   - Use utility classes
   - Maintain responsive design

4. **Code Quality**
   - Follow ESLint rules
   - Write meaningful comments
   - Use consistent naming conventions

## Authentication

The application uses JWT tokens for authentication:

- Tokens are stored in localStorage
- Protected routes require authentication
- Role-based access control

## API Integration

- All API calls are centralized in service files
- Axios instances with interceptors
- Proper error handling and loading states

## Contributing

Please read the main project's CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

1. **Development Server Issues**

   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules: `rm -rf node_modules`
   - Reinstall dependencies: `npm install`

2. **Build Issues**
   - Check environment variables
   - Verify all dependencies are installed
   - Clear build cache: `npm run clean`

## Learn More

- [React Documentation](https://reactjs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
