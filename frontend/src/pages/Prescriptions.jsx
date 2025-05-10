import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ViewPrescription from "../components/ViewPrescription";

const Prescriptions = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showPrescriptionDetails, setShowPrescriptionDetails] = useState(false);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      // Check if user object and its properties exist
      if (!user || !user.id || !user.role) {
        console.error("User information is missing:", user);
        toast.error(
          "User information is missing. Please try logging in again."
        );
        return;
      }

      let url;
      if (user.role === "patient") {
        url = `/api/prescriptions/patient/${user.id}?userId=${user.id}&userRole=${user.role}`;
      } else if (user.role === "doctor") {
        // For doctors, we'll show prescriptions they've written
        // This would need a backend endpoint to support this
        toast.info("Please view prescriptions through patient appointments");
        setLoading(false);
        return;
      }

      const response = await axios.get(url);
      setPrescriptions(response.data.prescriptions || []);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      toast.error("Failed to load prescriptions");
      setPrescriptions([]);
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

  const renderPrescriptionCard = (prescription) => {
    const createdDate = formatDate(prescription.createdAt);
    const appointmentDate = prescription.appointment
      ? formatDate(prescription.appointment.appointmentDate)
      : "Unknown date";

    return (
      <div
        key={prescription._id}
        style={{
          backgroundColor: "#E6F2E6",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
          boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
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
          <h3 style={{ fontSize: "18px", fontWeight: "bold" }}>
            Prescription from Dr.{" "}
            {prescription.doctor?.fullName || prescription.doctor?.email}
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
          Issued on {createdDate} for appointment on {appointmentDate}
        </p>
        <div style={{ marginTop: "15px" }}>
          <button
            style={{
              backgroundColor: "#B3B3E6",
              color: "#fff",
              padding: "8px 15px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
            }}
          >
            View Details
          </button>
        </div>
      </div>
    );
  };

  const renderPrescriptionDetails = () => {
    if (!selectedPrescription) return null;

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
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "10px",
            padding: "20px",
            width: "90%",
            maxWidth: "800px",
            maxHeight: "90vh",
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
              Prescription Details
            </h2>
            <button
              onClick={handleClosePrescriptionDetails}
              style={{
                backgroundColor: "transparent",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
              }}
            >
              &times;
            </button>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <p style={{ marginBottom: "5px" }}>
              <strong>Doctor:</strong>{" "}
              {selectedPrescription.doctor?.fullName ||
                selectedPrescription.doctor?.email}
            </p>
            <p style={{ marginBottom: "5px" }}>
              <strong>Issued Date:</strong>{" "}
              {formatDate(selectedPrescription.createdAt)}
            </p>
            {selectedPrescription.appointment && (
              <p style={{ marginBottom: "5px" }}>
                <strong>Appointment Date:</strong>{" "}
                {formatDate(selectedPrescription.appointment.appointmentDate)}
              </p>
            )}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              Medications
            </h3>
            {selectedPrescription.medications.map((medication, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  padding: "15px",
                  marginBottom: "15px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <h4
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    marginBottom: "10px",
                  }}
                >
                  {medication.name}
                </h4>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "10px",
                  }}
                >
                  <div>
                    <p style={{ fontWeight: "bold", marginBottom: "5px" }}>
                      Dosage
                    </p>
                    <p>{medication.dosage}</p>
                  </div>
                  <div>
                    <p style={{ fontWeight: "bold", marginBottom: "5px" }}>
                      Frequency
                    </p>
                    <p>{medication.frequency}</p>
                  </div>
                  <div>
                    <p style={{ fontWeight: "bold", marginBottom: "5px" }}>
                      Duration
                    </p>
                    <p>{medication.duration}</p>
                  </div>
                </div>
                {medication.instructions && (
                  <div style={{ marginTop: "10px" }}>
                    <p style={{ fontWeight: "bold", marginBottom: "5px" }}>
                      Special Instructions
                    </p>
                    <p>{medication.instructions}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {selectedPrescription.additionalNotes && (
            <div style={{ marginBottom: "20px" }}>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                Additional Notes
              </h3>
              <p
                style={{
                  padding: "15px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "5px",
                }}
              >
                {selectedPrescription.additionalNotes}
              </p>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              onClick={handleClosePrescriptionDetails}
              style={{
                backgroundColor: "#B3B3E6",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

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
        My Prescriptions
      </h1>

      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "64px",
          }}
        >
          <div
            style={{
              border: "4px solid #B3B3E6",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              animation: "spin 1s linear infinite",
            }}
          ></div>
        </div>
      ) : prescriptions.length > 0 ? (
        <div>{prescriptions.map(renderPrescriptionCard)}</div>
      ) : (
        <p style={{ textAlign: "center", color: "#666", padding: "10px 0" }}>
          No prescriptions found
        </p>
      )}

      {showPrescriptionDetails && renderPrescriptionDetails()}
    </div>
  );
};

export default Prescriptions;
