import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // If not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If admin only route and user is not admin, redirect to dashboard
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  // If all checks pass, render the children
  return children;
};

export default ProtectedRoute;
