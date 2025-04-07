import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import HomePage from "./components/HomePage";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientRegistration from "./pages/patientRegistration";
import Dashboard from "./pages/Dashboard";
import DoctorsList from "./pages/DoctorsList";
import PatientsList from "./pages/PatientsList";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Appointments from "./pages/Appointments";
import ManageAvailability from "./pages/ManageAvailability";
import BookAppointment from "./pages/BookAppointment";
import DoctorDashboard from "./pages/DoctorDashboard";
import AppointmentNotifications from "./pages/AppointmentNotifications";

// New Import
import AppointmentManagement from "./pages/appointment_management"; // Import Appointment Management Page

// Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Routes>
          {/* HomePage Route */}
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" /> : <HomePage />}
          />

          {/* Login Route */}
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" /> : <Login />}
          />

          {/* Register Route */}
          <Route
            path="/register"
            element={user ? <Navigate to="/dashboard" /> : <Register />}
          />

          {/* Patient Registration Route */}
          <Route
            path="/patient-register"
            element={
              user ? <Navigate to="/dashboard" /> : <PatientRegistration />
            }
          />

          {/* Dashboard (Protected) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                {user?.role === "doctor" ? <DoctorDashboard /> : <Dashboard />}
              </ProtectedRoute>
            }
          />

          {/* Doctors List (Protected) */}
          <Route
            path="/doctors"
            element={
              <ProtectedRoute>
                <DoctorsList />
              </ProtectedRoute>
            }
          />

          {/* Patients List (Protected) */}
          <Route
            path="/patients"
            element={
              <ProtectedRoute>
                <PatientsList />
              </ProtectedRoute>
            }
          />

          {/* Profile (Protected) */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Admin Dashboard (Protected, Admin Only) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Appointments (Protected) */}
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            }
          />

          {/* Manage Availability (Protected) */}
          <Route
            path="/manage-availability"
            element={
              <ProtectedRoute>
                <ManageAvailability />
              </ProtectedRoute>
            }
          />

          {/* Book Appointment Page (Protected) */}
          <Route
            path="/book-appointment"
            element={
              <ProtectedRoute>
                <BookAppointment />
              </ProtectedRoute>
            }
          />
          {/* Doctor Dashboard (Protected) */}
          <Route
            path="/doctor-dashboard"
            element={
              <ProtectedRoute>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />

          {/* Appointment Notifications (Protected) */}
          <Route
            path="/appointment-notifications"
            element={
              <ProtectedRoute>
                <AppointmentNotifications />
              </ProtectedRoute>
            }
          />

          {/* New Appointment Management Page (Protected) */}
          <Route
            path="/manage-appointments"
            element={
              <ProtectedRoute>
                <AppointmentManagement />
              </ProtectedRoute>
            }
          />

          {/* 404 - Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
