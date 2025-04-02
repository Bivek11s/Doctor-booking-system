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
    <div
      style={{
        backgroundColor: "#D8E6EC",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h1
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          marginBottom: "20px",
          color: "#4A4A7D",
        }}
      >
        Admin Dashboard
      </h1>

      {/* Tab Navigation */}
      <div style={{ marginBottom: "20px", borderBottom: "2px solid #B3B3E6" }}>
        <ul style={{ display: "flex", listStyle: "none", padding: 0 }}>
          {["dashboard", "patients", "doctors"].map((tab) => (
            <li key={tab} style={{ marginRight: "10px" }}>
              <button
                style={{
                  padding: "10px 15px",
                  borderBottom:
                    activeTab === tab ? "3px solid #4A4A7D" : "none",
                  color: activeTab === tab ? "#4A4A7D" : "#888",
                  fontWeight: "bold",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Dashboard Section */}
      {activeTab === "dashboard" && (
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
              marginBottom: "30px",
            }}
          >
            {[
              {
                title: "Total Doctors",
                count: stats.doctorsCount,
                color: "#B3B3E6",
              },
              {
                title: "Total Patients",
                count: stats.patientsCount,
                color: "#E6F2E6",
              },
              {
                title: "Pending Approvals",
                count: stats.pendingDoctors,
                color: "#F9F9E6",
              },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: item.color,
                  padding: "20px",
                  borderRadius: "10px",
                  textAlign: "center",
                }}
              >
                <h3 style={{ fontSize: "18px", fontWeight: "bold" }}>
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#4A4A7D",
                  }}
                >
                  {item.count}
                </p>
              </div>
            ))}
          </div>

          <div
            style={{
              backgroundColor: "#F9F9E6",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
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
                        backgroundColor: "#B3B3E6",
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
                        backgroundColor: "#F9B3B3",
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

      {/* Patients Management Tab */}
      {activeTab === "patients" && <ManagePatients />}

      {/* Doctors Management Tab */}
      {activeTab === "doctors" && <ManageDoctors />}
    </div>
  );
};

export default AdminDashboard;
