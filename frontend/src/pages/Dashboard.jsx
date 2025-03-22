import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    doctorsCount: 0,
    patientsCount: 0,
    pendingDoctors: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get doctors count
        const doctorsResponse = await axios.get("/api/users?role=doctor");
        const doctorsCount = doctorsResponse.data.count || 0;

        // Get patients count
        const patientsResponse = await axios.get("/api/users?role=patient");
        const patientsCount = patientsResponse.data.count || 0;

        // Get pending doctors count (only for admin)
        let pendingDoctors = 0;
        if (user.role === "admin") {
          const pendingResponse = await axios.get(
            "/api/users?role=doctor&isVerified=false"
          );
          pendingDoctors = pendingResponse.data.count || 0;
        }

        setStats({
          doctorsCount,
          patientsCount,
          pendingDoctors,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const renderAdminDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="card bg-blue-50">
        <h3 className="text-lg font-semibold mb-2">Total Doctors</h3>
        <p className="text-3xl font-bold text-blue-600">{stats.doctorsCount}</p>
        <p className="mt-2 text-sm text-gray-600">
          Registered doctors in the system
        </p>
      </div>

      <div className="card bg-green-50">
        <h3 className="text-lg font-semibold mb-2">Total Patients</h3>
        <p className="text-3xl font-bold text-green-600">
          {stats.patientsCount}
        </p>
        <p className="mt-2 text-sm text-gray-600">
          Registered patients in the system
        </p>
      </div>

      <div className="card bg-yellow-50">
        <h3 className="text-lg font-semibold mb-2">Pending Approvals</h3>
        <p className="text-3xl font-bold text-yellow-600">
          {stats.pendingDoctors}
        </p>
        <p className="mt-2 text-sm text-gray-600">
          Doctors waiting for verification
        </p>
      </div>
    </div>
  );

  const renderDoctorDashboard = () => (
    <div className="space-y-6">
      <div className="card bg-blue-50">
        <h3 className="text-lg font-semibold mb-2">Your Status</h3>
        <div className="flex items-center mt-2">
          <span
            className={`badge ${
              user.isVerified ? "badge-success" : "badge-warning"
            } mr-2`}
          >
            {user.isVerified ? "Verified" : "Pending Verification"}
          </span>
          <p className="text-sm text-gray-600">
            {user.isVerified
              ? "You are verified and can now manage appointments"
              : "Your account is pending verification by an admin"}
          </p>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/manage-availability" className="btn btn-primary">
            Manage Availability
          </a>
          <a href="/appointments" className="btn btn-secondary">
            View Appointments
          </a>
        </div>
      </div>
    </div>
  );

  const renderPatientDashboard = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/doctors" className="btn btn-primary">
            Find a Doctor
          </a>
          <a href="/appointments" className="btn btn-secondary">
            My Appointments
          </a>
        </div>
      </div>

      <div className="card bg-blue-50">
        <h3 className="text-lg font-semibold mb-2">Available Doctors</h3>
        <p className="text-3xl font-bold text-blue-600">{stats.doctorsCount}</p>
        <p className="mt-2 text-sm text-gray-600">
          Doctors available for appointments
        </p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Welcome, {user?.email}</h1>

      {user?.role === "admin" && renderAdminDashboard()}
      {user?.role === "doctor" && renderDoctorDashboard()}
      {user?.role === "patient" && renderPatientDashboard()}
    </div>
  );
};

export default Dashboard;
