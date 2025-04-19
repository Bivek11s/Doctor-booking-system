import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import ManagePatients from "../components/ManagePatients";
import ManageDoctors from "../components/ManageDoctors";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    doctorsCount: 0,
    patientsCount: 0,
    pendingDoctors: 0,
  });
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    if (user?.role !== "admin") return;
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const doctorsResponse = await axios.get("/api/users?role=doctor");
      const patientsResponse = await axios.get("/api/users?role=patient");
      const pendingResponse = await axios.get(
        "/api/users?role=doctor&isVerified=false"
      );

      setStats({
        doctorsCount: doctorsResponse.data.count || 0,
        patientsCount: patientsResponse.data.count || 0,
        pendingDoctors: pendingResponse.data.users?.length || 0,
      });

      setPendingDoctors(pendingResponse.data.users || []);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast.error("Failed to load admin dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDoctor = async (doctorId, isApproved) => {
    try {
      await axios.post("/api/auth/verify-doctor", { doctorId, isApproved });
      toast.success(
        `Doctor ${isApproved ? "approved" : "rejected"} successfully`
      );
      fetchData();
    } catch (error) {
      toast.error("Failed to update doctor verification status");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div
          style={{
            borderTop: "4px solid #B3B3E6",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            animation: "spin 1s linear infinite",
          }}
        ></div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          backgroundColor: "#7D9DDE",
          color: "#fff",
          padding: "20px",
        }}
      >
        <h2
          style={{ fontWeight: "bold", fontSize: "20px", marginBottom: "30px" }}
        >
          Admin Panel
        </h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {["dashboard", "doctors", "patients", "appointments"].map((tab) => (
            <li key={tab} style={{ marginBottom: "15px" }}>
              <button
                onClick={() => setActiveTab(tab)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#fff",
                  fontWeight: activeTab === tab ? "bold" : "normal",
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px" }}>
        {/* Top Navbar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#7D9DDE",
            padding: "15px 20px",
            borderRadius: "10px",
            marginBottom: "30px",
          }}
        >
          <h1 style={{ color: "#fff", fontSize: "20px", fontWeight: "bold" }}>
            📊 Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#e63946",
              color: "#fff",
              border: "none",
              padding: "10px 15px",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            🔒 Logout
          </button>
        </div>

        {/* Dashboard Section */}
        {activeTab === "dashboard" && (
          <div>
            {/* Stats Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "20px",
                marginBottom: "30px",
              }}
            >
              {[
                { title: "Total Doctors", count: stats.doctorsCount },
                { title: "Appointments Today", count: 16 },
                { title: "Registered Patients", count: stats.patientsCount },
                { title: "Pending Approvals", count: stats.pendingDoctors },
              ].map((item, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: "#dcf2ff",
                    borderRadius: "10px",
                    padding: "20px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  }}
                >
                  <h3 style={{ fontSize: "16px", marginBottom: "10px" }}>
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "22px",
                      fontWeight: "bold",
                      color: "#365486",
                    }}
                  >
                    {item.count}
                  </p>
                </div>
              ))}
            </div>

            {/* Pending Doctor Approvals */}
            <div
              style={{
                backgroundColor: "#dcf2ff",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                Pending Doctor Approvals
              </h2>
              {pendingDoctors.length > 0 ? (
                pendingDoctors.map((doctor) => (
                  <div
                    key={doctor._id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 0",
                      borderBottom: "1px solid #ccc",
                    }}
                  >
                    <div>
                      <h3 style={{ fontWeight: "bold" }}>{doctor.email}</h3>
                      <p style={{ fontSize: "14px", color: "#666" }}>
                        Phone: {doctor.phone}
                      </p>
                      <p style={{ fontSize: "14px", color: "#666" }}>
                        Specialty: {doctor.doctorSpecialty || "Not specified"}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        onClick={() => handleVerifyDoctor(doctor._id, true)}
                        style={{
                          backgroundColor: "#38b000",
                          color: "#fff",
                          padding: "8px 15px",
                          borderRadius: "5px",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleVerifyDoctor(doctor._id, false)}
                        style={{
                          backgroundColor: "#d62828",
                          color: "#fff",
                          padding: "8px 15px",
                          borderRadius: "5px",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p
                  style={{
                    textAlign: "center",
                    color: "#666",
                    padding: "10px 0",
                  }}
                >
                  No pending approvals
                </p>
              )}
            </div>
          </div>
        )}

        {/* Patients Tab */}
        {activeTab === "patients" && <ManagePatients />}

        {/* Doctors Tab */}
        {activeTab === "doctors" && <ManageDoctors />}
      </div>
    </div>
  );
};

export default AdminDashboard;
