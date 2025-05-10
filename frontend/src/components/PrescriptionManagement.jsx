import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ViewPrescription from "./ViewPrescription";
import WritePrescription from "./WritePrescription";

const PrescriptionManagement = ({ appointmentId, patientId, onClose }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showViewPrescription, setShowViewPrescription] = useState(false);
  const [showWritePrescription, setShowWritePrescription] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);

  useEffect(() => {
    if (patientId) {
      fetchPatientPrescriptions();
    } else if (appointmentId) {
      fetchAppointmentDetails();
    }
  }, [patientId, appointmentId, user.id, user.role]);

  const fetchPatientPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/prescriptions/patient/${patientId}?userId=${user.id}&userRole=${user.role}`
      );
      setPrescriptions(response.data.prescriptions || []);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      toast.error("Failed to load prescriptions");
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointmentDetails = async () => {
    try {
      setLoading(true);
      // Fetch appointment details
      const appointmentResponse = await axios.get(
        `/api/appointments/${appointmentId}?userId=${user.id}&userRole=${user.role}`
      );
      setCurrentAppointment(appointmentResponse.data.appointment);

      // Check if there's a prescription for this appointment
      try {
        const prescriptionResponse = await axios.get(
          `/api/prescriptions/appointment/${appointmentId}?userId=${user.id}&userRole=${user.role}`
        );
        if (prescriptionResponse.data.prescription) {
          setPrescriptions([prescriptionResponse.data.prescription]);
        }
      } catch (error) {
        // If no prescription exists, that's okay
        if (error.response?.status !== 404) {
          throw error;
        }
      }
    } catch (error) {
      console.error("Error fetching appointment details:", error);
      toast.error("Failed to load appointment details");
    } finally {
      setLoading(false);
    }
  };

  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setShowViewPrescription(true);
  };

  const handleWritePrescription = () => {
    setShowWritePrescription(true);
  };

  const handlePrescriptionCreated = () => {
    setShowWritePrescription(false);
    toast.success("Prescription created successfully");
    if (appointmentId) {
      fetchAppointmentDetails();
    } else if (patientId) {
      fetchPatientPrescriptions();
    }
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
        className="bg-white p-4 rounded-lg shadow-md mb-4 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => handleViewPrescription(prescription)}
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">
            Prescription from {formatDate(prescription.createdAt)}
          </h3>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {prescription.medications.length} medication(s)
          </span>
        </div>
        <p className="text-gray-600 text-sm">
          Doctor: {prescription.doctor?.fullName || prescription.doctor?.email}
        </p>
        <p className="text-gray-600 text-sm">
          For appointment on {appointmentDate}
        </p>
        <button
          className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
          onClick={(e) => {
            e.stopPropagation();
            handleViewPrescription(prescription);
          }}
        >
          View Details
        </button>
      </div>
    );
  };

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
        paddingTop: "60px", // Add padding to prevent overlap with navbar
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
            {patientId ? "Patient Prescriptions" : "Appointment Prescription"}
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
            &times;
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
          <div>
            {user.role === "doctor" && currentAppointment && (
              <div
                style={{
                  marginBottom: "20px",
                  backgroundColor: "#f9f9f9",
                  padding: "15px",
                  borderRadius: "8px",
                }}
              >
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    marginBottom: "10px",
                  }}
                >
                  Appointment with{" "}
                  {currentAppointment.patient?.fullName ||
                    currentAppointment.patient?.email}
                </h3>
                <p style={{ marginBottom: "5px" }}>
                  <strong>Date:</strong>{" "}
                  {formatDate(currentAppointment.appointmentDate)}
                </p>
                <p style={{ marginBottom: "15px" }}>
                  <strong>Reason:</strong> {currentAppointment.reason}
                </p>

                {prescriptions.length === 0 &&
                  currentAppointment.status === "completed" && (
                    <button
                      onClick={handleWritePrescription}
                      style={{
                        backgroundColor: "#B3B3E6",
                        color: "#fff",
                        padding: "8px 15px",
                        borderRadius: "5px",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Write Prescription
                    </button>
                  )}
              </div>
            )}

            {prescriptions.length > 0 ? (
              <div>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    marginBottom: "15px",
                  }}
                >
                  {prescriptions.length > 1 ? "Prescriptions" : "Prescription"}
                </h3>
                {prescriptions.map((prescription) => (
                  <div
                    key={prescription._id}
                    style={{
                      backgroundColor: "#E6F2E6",
                      padding: "15px",
                      borderRadius: "8px",
                      marginBottom: "15px",
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
                      <h4 style={{ fontSize: "16px", fontWeight: "bold" }}>
                        Prescription from {formatDate(prescription.createdAt)}
                      </h4>
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
                      Doctor:{" "}
                      {prescription.doctor?.fullName ||
                        prescription.doctor?.email}
                    </p>
                    <p style={{ marginTop: "5px", color: "#666" }}>
                      For appointment on{" "}
                      {prescription.appointment
                        ? formatDate(prescription.appointment.appointmentDate)
                        : "Unknown date"}
                    </p>
                    <button
                      style={{
                        marginTop: "10px",
                        backgroundColor: "#B3B3E6",
                        color: "#fff",
                        padding: "6px 12px",
                        borderRadius: "5px",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "12px",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewPrescription(prescription);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <p style={{ color: "#666" }}>
                  {patientId
                    ? "No prescriptions found for this patient"
                    : appointmentId
                    ? "No prescription has been created for this appointment yet"
                    : "No prescriptions found"}
                </p>
              </div>
            )}
          </div>
        )}

        {showViewPrescription && selectedPrescription && (
          <ViewPrescription
            prescription={selectedPrescription}
            onClose={() => setShowViewPrescription(false)}
          />
        )}

        {showWritePrescription && currentAppointment && (
          <WritePrescription
            appointment={currentAppointment}
            onSuccess={handlePrescriptionCreated}
            onClose={() => setShowWritePrescription(false)}
          />
        )}
      </div>
    </div>
  );
};

export default PrescriptionManagement;
