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

  const styles = {
    card: {
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#FFFFFF",
      textAlign: "center",
    },
    cardBlue: {
      backgroundColor: "#E3F2FD", // Light Blue
      color: "#1565C0", // Dark Blue
    },
    cardGreen: {
      backgroundColor: "#E8F5E9", // Light Green
      color: "#2E7D32", // Dark Green
    },
    cardYellow: {
      backgroundColor: "#FFFDE7", // Light Yellow
      color: "#F9A825", // Dark Yellow
    },
    btn: {
      padding: "10px 15px",
      borderRadius: "5px",
      textDecoration: "none",
      textAlign: "center",
      display: "inline-block",
      margin: "5px",
    },
    btnPrimary: {
      backgroundColor: "#1565C0", // Dark Blue
      color: "#FFFFFF",
    },
    btnSecondary: {
      backgroundColor: "#2E7D32", // Dark Green
      color: "#FFFFFF",
    },
    btnDanger: {
      backgroundColor: "#C62828", // Dark Red
      color: "#FFFFFF",
    },
  };

  const renderAdminDashboard = () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
      <div style={{ ...styles.card, ...styles.cardBlue }}>
        <h3>Total Doctors</h3>
        <p style={{ fontSize: "24px", fontWeight: "bold" }}>{stats.doctorsCount}</p>
        <p>Registered doctors in the system</p>
      </div>

      <div style={{ ...styles.card, ...styles.cardGreen }}>
        <h3>Total Patients</h3>
        <p style={{ fontSize: "24px", fontWeight: "bold" }}>{stats.patientsCount}</p>
        <p>Registered patients in the system</p>
      </div>

      <div style={{ ...styles.card, ...styles.cardYellow }}>
        <h3>Pending Approvals</h3>
        <p style={{ fontSize: "24px", fontWeight: "bold" }}>{stats.pendingDoctors}</p>
        <p>Doctors waiting for verification</p>
      </div>
    </div>
  );

  const renderDoctorDashboard = () => (
    <div>
      <div style={{ ...styles.card, ...styles.cardBlue }}>
        <h3>Your Status</h3>
        <p style={{ fontSize: "18px", fontWeight: "bold" }}>
          {user.isVerified ? "Verified" : "Pending Verification"}
        </p>
        <p>{user.isVerified ? "You can now manage appointments" : "Your account is pending admin verification"}</p>
      </div>

      <div style={styles.card}>
        <h3>Quick Actions</h3>
        <a href="/manage-availability" style={{ ...styles.btn, ...styles.btnPrimary }}>Manage Availability</a>
        <a href="/appointments" style={{ ...styles.btn, ...styles.btnSecondary }}>View Appointments</a>
      </div>
    </div>
  );

  const renderPatientDashboard = () => (
    <div>
      <div style={styles.card}>
        <h3>Quick Actions</h3>
        <a href="/doctors" style={{ ...styles.btn, ...styles.btnPrimary }}>Find a Doctor</a>
        <a href="/appointments" style={{ ...styles.btn, ...styles.btnSecondary }}>My Appointments</a>
      </div>

      <div style={{ ...styles.card, ...styles.cardBlue }}>
        <h3>Available Doctors</h3>
        <p style={{ fontSize: "24px", fontWeight: "bold" }}>{stats.doctorsCount}</p>
        <p>Doctors available for appointments</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div style={{ width: "50px", height: "50px", border: "4px solid #1565C0", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>Welcome, {user?.email}</h1>

      {user?.role === "admin" && renderAdminDashboard()}
      {user?.role === "doctor" && renderDoctorDashboard()}
      {user?.role === "patient" && renderPatientDashboard()}
    </div>
  );
};

export default Dashboard;
