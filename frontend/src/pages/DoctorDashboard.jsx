import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import DoctorAvailability from "../components/DoctorAvailability";
import Appointments from "./Appointments";

const DoctorDashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("appointments");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
// for Whole background 
  const containerStyle = {
    fontFamily: "Arial, sans-serif",
    margin: "0 auto",
    width: "1250px",
    padding: "40px",
    color: "#000",
    background: "#f4f6f7",
  };
// styling for navbar
  const navbarStyle = {
    width: "100%",
    height: "60px",
    backgroundColor: "#4A90E2",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "18px",
    fontWeight: "bold",
    borderBottom: "1px solid #025a9b",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 1000,
    padding: "0 20px",
  };

  const logoutButtonStyle = {
    position: "absolute",
    right: "20px",
    backgroundColor: "#D0021B",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "500",
  };

  const fixedSidebarStyle = {
    position: "fixed",
    top: "70px",
    left: "20px",
    zIndex: 999,
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  };

  const sidebarItemStyle = {
    backgroundColor: "#80a9d7",
    width: "250px",
    color: "black",
    padding: "20px",
    borderRadius: "10px",
    cursor: "pointer",
    textAlign: "center",
    fontWeight: "bold",
  };

  const mainContentContainerStyle = {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
    marginTop: "10px",
    paddingLeft: "300px",
  };

  const mainContentStyle = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "0px",
  };

  const sectionStyle = {
    width: "100%",
    backgroundColor: "#faf8ff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
  };

  const titleStyle = {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "15px",
    textAlign: "center",
    color: "black",
  };

  const textStyle = {
    color: "black",
  };

  const buttonStyle = {
    padding: "10px",
    backgroundColor: "#0288D1",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  };

  const dateTimeContainerStyle = {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    width: "100%",
  };

  return (
    <div style={containerStyle}>
      {/* Navbar */}
      <div style={navbarStyle}>
        <span>Welcome to Doctor Dashboard</span>
        <button onClick={handleLogout} style={logoutButtonStyle}>
          Logout
        </button>
      </div>

      {/* Fixed Sidebar Items */}
      <div style={fixedSidebarStyle}>
        <div
          style={{
            ...sidebarItemStyle,
            backgroundColor:
              activeSection === "appointments" ? "#025a9b" : "#80a9d7",
            color: activeSection === "appointments" ? "white" : "black",
          }}
          onClick={() => setActiveSection("appointments")}
        >
          Manage Appointments
        </div>
        <div
          style={{
            ...sidebarItemStyle,
            backgroundColor:
              activeSection === "availability" ? "#025a9b" : "#80a9d7",
            color: activeSection === "availability" ? "white" : "black",
          }}
          onClick={() => setActiveSection("availability")}
        >
          Doctor Availability
        </div>
      </div>

      {/* Main Content */}
      <div style={mainContentContainerStyle}>
        <div style={mainContentStyle}>
          {/* Welcome Section */}
          <div style={sectionStyle}>
            <h2 style={titleStyle}>Welcome, Dr. {user?.fullName}</h2>
            <p style={{ textAlign: "center", color: "black" }}>
              Manage your appointments and availability schedule from this
              dashboard.
            </p>
          </div>

          {/* Dynamic Content Section */}
          <div style={{ ...sectionStyle, width: "100%" }}>
            <Appointments />
            <DoctorAvailability />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
