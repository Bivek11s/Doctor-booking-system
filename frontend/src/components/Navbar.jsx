import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Doctor Appointment
        </Link>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-blue-200">
                Dashboard
              </Link>

              {/* Show doctors link to all users */}
              <Link to="/doctors" className="hover:text-blue-200">
                Doctors
              </Link>

              {/* Show patients link only to doctors and admins */}
              {(user.role === "doctor" || user.role === "admin") && (
                <Link to="/patients" className="hover:text-blue-200">
                  Patients
                </Link>
              )}

              {/* Show admin dashboard only to admins */}
              {user.role === "admin" && (
                <Link to="/admin" className="hover:text-blue-200">
                  Admin
                </Link>
              )}

              <Link to="/profile" className="hover:text-blue-200">
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md"
              >
                Logout
              </button>

              <div className="flex items-center ml-4">
                <img
                  src={user.profilePic}
                  alt="Profile"
                  className="w-8 h-8 rounded-full mr-2 object-cover"
                />
                <span className="font-medium">{user.fullName}</span>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-blue-600 px-3 py-1 rounded-md hover:bg-blue-100"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
