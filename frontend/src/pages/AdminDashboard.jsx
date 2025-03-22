import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import ManagePatients from "../components/ManagePatients";
import ManageDoctors from "../components/ManageDoctors";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    doctorsCount: 0,
    patientsCount: 0,
    pendingDoctors: 0,
  });
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    if (user?.role !== "admin") {
      return;
    }

    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Get doctors count
      const doctorsResponse = await axios.get("/api/users?role=doctor");
      const doctorsCount = doctorsResponse.data.count || 0;

      // Get patients count
      const patientsResponse = await axios.get("/api/users?role=patient");
      const patientsCount = patientsResponse.data.count || 0;

      // Get pending doctors
      const pendingResponse = await axios.get(
        "/api/users?role=doctor&isVerified=false"
      );
      const pendingDoctors = pendingResponse.data.users || [];

      setStats({
        doctorsCount,
        patientsCount,
        pendingDoctors: pendingDoctors.length,
      });

      setPendingDoctors(pendingDoctors);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast.error("Failed to load admin dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDoctor = async (doctorId, isApproved) => {
    try {
      await axios.post("/api/auth/verify-doctor", {
        doctorId,
        isApproved,
      });

      toast.success(
        `Doctor ${isApproved ? "approved" : "rejected"} successfully`
      );
      fetchData(); // Refresh the list
    } catch (error) {
      console.error("Error verifying doctor:", error);
      toast.error("Failed to update doctor verification status");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Tab Navigation */}
      <div className="mb-6 border-b">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
          <li className="mr-2">
            <button
              className={`inline-block p-4 rounded-t-lg ${
                activeTab === "dashboard"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              Dashboard
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block p-4 rounded-t-lg ${
                activeTab === "patients"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("patients")}
            >
              Manage Patients
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block p-4 rounded-t-lg ${
                activeTab === "doctors"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("doctors")}
            >
              Manage Doctors
            </button>
          </li>
        </ul>
      </div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card bg-blue-50">
              <h3 className="text-lg font-semibold mb-2">Total Doctors</h3>
              <p className="text-3xl font-bold text-blue-600">
                {stats.doctorsCount}
              </p>
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

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">
              Pending Doctor Approvals
            </h2>

            {pendingDoctors.length > 0 ? (
              <div className="space-y-4">
                {pendingDoctors.map((doctor) => (
                  <div
                    key={doctor._id}
                    className="border-b pb-4 mb-4 last:border-0 last:pb-0 last:mb-0"
                  >
                    <div className="flex flex-col md:flex-row md:items-center">
                      <div className="md:w-1/4 mb-4 md:mb-0">
                        <img
                          src={doctor.profilePic}
                          alt={`Dr. ${doctor.email}`}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      </div>

                      <div className="md:w-2/4">
                        <h3 className="font-semibold">{doctor.email}</h3>
                        <p className="text-sm text-gray-600">
                          Phone: {doctor.phone}
                        </p>
                        <p className="text-sm text-gray-600">
                          Specialty: {doctor.doctorSpecialty || "Not specified"}
                        </p>

                        {doctor.qualificationProof && (
                          <a
                            href={doctor.qualificationProof}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            View Qualification Document
                          </a>
                        )}
                      </div>

                      <div className="md:w-1/4 flex space-x-2 mt-4 md:mt-0 md:justify-end">
                        <button
                          onClick={() => handleVerifyDoctor(doctor._id, true)}
                          className="btn btn-primary"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleVerifyDoctor(doctor._id, false)}
                          className="btn btn-danger"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-gray-600">
                No pending doctor approvals
              </p>
            )}
          </div>

          <div className="mt-6">
            <Link to="/doctors" className="btn btn-secondary">
              View All Doctors
            </Link>
          </div>
        </div>
      )}

      {/* Patients Management Tab */}
      {activeTab === "patients" && <ManagePatients />}

      {/* Doctors Management Tab */}
      {activeTab === "doctors" && <ManageDoctors />}
    </div>
  );
};

export default AdminDashboard;
