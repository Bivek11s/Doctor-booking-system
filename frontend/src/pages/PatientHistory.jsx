import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ViewPrescription from "../components/ViewPrescription";

const PatientHistory = ({ patientId, onClose, embedded = false }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [activeTab, setActiveTab] = useState("appointments");
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showPrescriptionDetails, setShowPrescriptionDetails] = useState(false);

  useEffect(() => {
    if (patientId && user?.role === "doctor") {
      fetchPatientHistory();
    }
  }, [patientId, user?.id, user?.role]);

  const fetchPatientHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/prescriptions/history/${patientId}?userId=${user.id}&userRole=${user.role}`
      );
      const patientResponse = await axios.get(`/api/users/${patientId}`);
      setPatientData(patientResponse.data.user || {});
      setAppointments(response.data.appointments || []);
      setPrescriptions(response.data.prescriptions || []);
    } catch (error) {
      console.error("Error fetching patient history:", error);
      const message =
        error.response?.status === 404
          ? "Patient not found"
          : "Failed to load patient history. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setShowPrescriptionDetails(true);
  };

  const handleClosePrescriptionDetails = () => {
    setShowPrescriptionDetails(false);
    setSelectedPrescription(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "MMMM d, yyyy");
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const renderStatusBadge = (status) => {
    const statusColors = {
      scheduled: { background: "#B3B3E6", color: "#4A4A7D" },
      completed: { background: "#E6F2E6", color: "#2D6A2E" },
      cancelled: { background: "#F9B3B3", color: "#8B0000" },
    };

    return (
      <span
        style={{
          padding: "6px 12px",
          borderRadius: "10px",
          fontSize: "12px",
          fontWeight: "bold",
          backgroundColor: statusColors[status].background,
          color: statusColors[status].color,
        }}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const renderAppointmentsList = () => {
    if (appointments.length === 0) {
      return (
        <p style={{ textAlign: "center", color: "#666", padding: "20px 0" }}>
          No appointment history found for this patient
        </p>
      );
    }

    return appointments.map((appointment) => {
      const appointmentDate = new Date(appointment.appointmentDate);
      const formattedDate = format(appointmentDate, "MMMM d, yyyy");
      const formattedTime = formatTime(appointment.appointmentTime);

      return (
        <div
          key={appointment._id}
          style={{
            backgroundColor: "#f9f9f9",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "15px",
            boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <h3 style={{ fontSize: "16px", fontWeight: "bold" }}>
              Appointment on {formattedDate}
            </h3>
            {renderStatusBadge(appointment.status)}
          </div>
          <p style={{ marginBottom: "5px" }}>
            <strong>Time:</strong> {formattedTime}
          </p>
          <p style={{ marginBottom: "5px" }}>
            <strong>Reason:</strong> {appointment.reason}
          </p>
          {appointment.notes && (
            <p style={{ marginBottom: "5px" }}>
              <strong>Notes:</strong> {appointment.notes}
            </p>
          )}
        </div>
      );
    });
  };

  const renderPrescriptionsList = () => {
    if (prescriptions.length === 0) {
      return (
        <p style={{ textAlign: "center", color: "#666", padding: "20px 0" }}>
          No prescription history found for this patient
        </p>
      );
    }

    return prescriptions.map((prescription) => {
      const createdDate = formatDate(prescription.createdAt);
      const appointmentDate = prescription.appointment
        ? formatDate(prescription.appointment.appointmentDate)
        : "Unknown date";

      return (
        <div
          key={prescription._id}
          style={{
            backgroundColor: "#f9f9f9",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "15px",
            boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.05)",
            cursor: "pointer",
          }}
          onClick={() => handleViewPrescription(prescription)}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ fontSize: "16px", fontWeight: "bold" }}>
              Prescription from {formatDate(prescription.createdAt)}
            </h3>
            <span
              style={{
                padding: "6px 12px",
                borderRadius: "10px",
                fontSize: "12px",
                fontWeight: "bold",
                backgroundColor: "#B3B3E6",
                color: "#4A4A7D",
              }}
            >
              {prescription.medications.length} medication(s)
            </span>
          </div>
          <p style={{ marginTop: "10px", color: "#666" }}>
            For appointment on {appointmentDate}
          </p>
          <div style={{ marginTop: "10px" }}>
            <button
              style={{
                backgroundColor: "#B3B3E6",
                color: "#fff",
                padding: "6px 12px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              View Details
            </button>
          </div>
        </div>
      );
    });
  };

  const renderPrescriptionDetails = () => {
    if (!selectedPrescription) return null;
    return (
      <ViewPrescription
        prescription={selectedPrescription}
        onClose={handleClosePrescriptionDetails}
      />
    );
  };

  if (!patientId) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <p>No patient selected</p>
      </div>
    );
  }

  if (user?.role !== "doctor") {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <p>Only doctors can view patient history</p>
      </div>
    );
  }

  const renderContent = () => (
    <>
      <div
        style={{
          backgroundColor: "white",
          borderRadius: embedded ? "0" : "10px",
          padding: embedded ? "0" : "20px",
          width: embedded ? "100%" : "90%",
          maxWidth: embedded ? "100%" : "800px",
          maxHeight: embedded ? "100%" : "90vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ fontSize: "22px", fontWeight: "bold" }}>
            Patient History
            {patientData && `: ${patientData.fullName || patientData.email}`}
          </h2>
          <button
            onClick={onClose}
            style={{
              backgroundColor: "transparent",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100px",
            }}
          >
            <div
              style={{
                border: "4px solid #B3B3E6",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                animation: "spin 1s linear infinite",
              }}
            ></div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  display: "flex",
                  borderBottom: "1px solid #ddd",
                  marginBottom: "15px",
                }}
              >
                <button
                  onClick={() => setActiveTab("appointments")}
                  style={{
                    padding: "10px 15px",
                    backgroundColor:
                      activeTab === "appointments" ? "#B3B3E6" : "transparent",
                    color: activeTab === "appointments" ? "white" : "#4A4A7D",
                    border: "none",
                    borderBottom:
                      activeTab === "appointments"
                        ? "2px solid #4A4A7D"
                        : "none",
                    borderRadius: "5px 5px 0 0",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Appointments History
                </button>
                <button
                  onClick={() => setActiveTab("prescriptions")}
                  style={{
                    padding: "10px 15px",
                    backgroundColor:
                      activeTab === "prescriptions" ? "#B3B3E6" : "transparent",
                    color: activeTab === "prescriptions" ? "white" : "#4A4A7D",
                    border: "none",
                    borderBottom:
                      activeTab === "prescriptions"
                        ? "2px solid #4A4A7D"
                        : "none",
                    borderRadius: "5px 5px 0 0",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Prescriptions History
                </button>
              </div>

              <div style={{ padding: "10px 0" }}>
                {activeTab === "appointments" && renderAppointmentsList()}
                {activeTab === "prescriptions" && renderPrescriptionsList()}
              </div>
            </div>
          </>
        )}
      </div>
      {showPrescriptionDetails && renderPrescriptionDetails()}
    </>
  );

  if (embedded) {
    return renderContent();
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        paddingTop: "60px",
      }}
    >
      {renderContent()}
    </div>
  );
};

export default PatientHistory;
