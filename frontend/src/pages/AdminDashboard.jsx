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
          backgroundColor: "#f4f7fa",
        }}
      >
        <div
          style={{
            borderTop: "4px solid #4A90E2",
            borderRight: "4px solid transparent",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            animation: "spin 1s linear infinite",
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "240px",
          backgroundColor: "#365486",
          color: "#fff",
          padding: "10px 5px",
          minHeight: "100vh",
          boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
          marginTop: "10px",
        }}
      >
        <h2
          style={{
            fontSize: "22px",
            fontWeight: "700",
            marginBottom: "40px",
            textAlign: "center",
          }}
        >
          Admin Panel
        </h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {["dashboard", "doctors", "patients"].map((tab) => (
            <li key={tab} style={{ marginBottom: "20px" }}>
              <button
                onClick={() => setActiveTab(tab)}
                style={{
                  background: activeTab === tab ? "#4A90E2" : "transparent",
                  border: "none",
                  color: "#fff",
                  fontWeight: "600",
                  cursor: "pointer",
                  padding: "10px 15px",
                  borderRadius: "6px",
                  width: "100%",
                  textAlign: "left",
                  transition: "background 0.3s ease",
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          padding: "30px",
          background: "#f9f9f9",
          marginLeft: "10px",
        }}
      >
        {activeTab === "dashboard" && (
          <div style={{ marginTop: "20px" }}>
            <h1
              style={{
                fontSize: "24px",
                marginBottom: "20px",
                fontWeight: "bold",
                color: "#365486",
              }}
            >
              Admin Dashboard Overview
            </h1>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "24px",
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
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    padding: "24px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                    textAlign: "center",
                    transition: "transform 0.2s ease",
                    cursor: "default",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "scale(1.02)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <h3
                    style={{ fontSize: "15px", marginBottom: "12px", color: "#888" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "26px",
                      fontWeight: "700",
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
                backgroundColor: "#ffffff",
                padding: "24px",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  marginBottom: "16px",
                  color: "#365486",
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
                      padding: "14px 0",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <div>
                      <h3 style={{ fontWeight: "600", marginBottom: "4px" }}>
                        {doctor.email}
                      </h3>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#666",
                          marginBottom: "2px",
                        }}
                      >
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
                          borderRadius: "6px",
                          border: "none",
                          fontWeight: "600",
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
                          borderRadius: "6px",
                          border: "none",
                          fontWeight: "600",
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
                    color: "#999",
                    padding: "20px 0",
                    fontStyle: "italic",
                  }}
                >
                  No pending approvals
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === "patients" && <ManagePatients />}
        {activeTab === "doctors" && <ManageDoctors />}
      </div>
    </div>
  );
};

// Inject keyframes for spinner animation
const styleElement = document.createElement("style");
styleElement.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleElement);

export default AdminDashboard;


