import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import DoctorAvailability from "../components/DoctorAvailability";
import Appointments from "./Appointments";
import PatientHistory from "./PatientHistory";
import PrescriptionManagement from "../components/PrescriptionManagement";

const DoctorDashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("appointments");
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [showPatientHistory, setShowPatientHistory] = useState(false);
  const [showPrescriptionManagement, setShowPrescriptionManagement] =
    useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

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
    width: "250px",
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
        <div
          style={{
            ...sidebarItemStyle,
            backgroundColor:
              activeSection === "prescriptions" ? "#025a9b" : "#80a9d7",
            color: activeSection === "prescriptions" ? "white" : "black",
          }}
          onClick={() => setActiveSection("prescriptions")}
        >
          Prescriptions
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
            {activeSection === "appointments" && (
              <div>
                <div
                  style={{
                    marginBottom: "15px",
                    padding: "10px",
                    backgroundColor: "#e6f7ff",
                    borderRadius: "5px",
                    border: "1px solid #91d5ff",
                  }}
                >
                  <p style={{ color: "#1890ff", fontWeight: "500" }}>
                    <span style={{ marginRight: "8px", fontSize: "16px" }}>
                      ℹ️
                    </span>
                    You can view a patient's medical history before completing
                    an appointment. This helps ensure proper diagnosis and
                    treatment planning.
                  </p>
                </div>
                <Appointments
                  onViewPatientHistory={(patientId) => {
                    setSelectedPatientId(patientId);
                    setShowPatientHistory(true);
                  }}
                  onManagePrescription={(appointmentId) => {
                    setSelectedAppointmentId(appointmentId);
                    setShowPrescriptionManagement(true);
                  }}
                />
              </div>
            )}

            {/* Quick Access Section */}
            <div
              style={{
                ...sectionStyle,
                marginTop: "20px",
                backgroundColor: "#f0f4f8",
                borderTop: "3px solid #025a9b",
              }}
            >
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "15px",
                }}
              >
                Quick Actions
              </h3>
              <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                <button
                  onClick={() => navigate("/profile")}
                  style={{
                    backgroundColor: "#80a9d7",
                    color: "white",
                    padding: "10px 15px",
                    borderRadius: "5px",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span>👤</span> Update Profile
                </button>
              </div>
            </div>

            {activeSection === "availability" && <DoctorAvailability />}

            {activeSection === "prescriptions" && (
              <div>
                <h2 style={titleStyle}>Prescription Management</h2>
                <p
                  style={{
                    textAlign: "center",
                    color: "black",
                    marginBottom: "20px",
                  }}
                >
                  View and manage patient prescriptions. You can create new
                  prescriptions for completed appointments.
                </p>
                <p style={{ textAlign: "center", color: "black" }}>
                  Please select a patient from the appointments section to view
                  their prescription history or create a new prescription.
                </p>
              </div>
            )}
          </div>

          {/* Patient History Modal */}
          {showPatientHistory && selectedPatientId && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 2000, // Higher z-index to appear above navbar
                paddingTop: "70px", // Add padding to prevent overlap with navbar
              }}
            >
              <div
                style={{ width: "90%", maxWidth: "1000px", maxHeight: "90vh" }}
              >
                <PatientHistory
                  patientId={selectedPatientId}
                  onClose={() => {
                    setShowPatientHistory(false);
                    setSelectedPatientId(null);
                  }}
                  embedded={true} // Use embedded mode to avoid nested modals
                />
              </div>
            </div>
          )}

          {/* Prescription Management Modal */}
          {showPrescriptionManagement && selectedAppointmentId && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 2000, // Higher z-index to appear above navbar
                paddingTop: "70px", // Add padding to prevent overlap with navbar
              }}
            >
              <div
                style={{ width: "90%", maxWidth: "1000px", maxHeight: "90vh" }}
              >
                <PrescriptionManagement
                  appointmentId={selectedAppointmentId}
                  onClose={() => {
                    setShowPrescriptionManagement(false);
                    setSelectedAppointmentId(null);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
