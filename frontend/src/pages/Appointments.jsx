import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { format } from "date-fns";
import WritePrescription from "../components/WritePrescription";
import ViewPrescription from "../components/ViewPrescription";
import PatientHistory from "./PatientHistory";

const Appointments = ({ onViewPatientHistory, onManagePrescription }) => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showViewPrescriptionModal, setShowViewPrescriptionModal] =
    useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [prescriptionData, setPrescriptionData] = useState({
    medications: [
      { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
    ],
    additionalNotes: "",
  });

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter]);

  const fetchAppointments = async () => {
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

      let url = `/api/appointments?userId=${user.id}&userRole=${user.role}`;
      if (statusFilter !== "all") url += `&status=${statusFilter}`;

      console.log("Fetching appointments from URL:", url);
      const response = await axios.get(url);
      console.log("Appointments data received:", response.data);
      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to load appointments");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const [showPatientHistoryModal, setShowPatientHistoryModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [pendingStatusChange, setPendingStatusChange] = useState(null);

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      // If a doctor is marking an appointment as completed, show patient history first
      if (user.role === "doctor" && newStatus === "completed") {
        const appointment = appointments.find(
          (app) => app._id === appointmentId
        );
        setCurrentAppointment(appointment);
        setSelectedPatientId(appointment.patient._id);
        setPendingStatusChange({ appointmentId, newStatus });
        setShowPatientHistoryModal(true);
      } else {
        // For other status changes, proceed normally
        await axios.put(`/api/appointments/${appointmentId}/status`, {
          status: newStatus,
          userId: user.id,
          userRole: user.role,
        });
        toast.success(`Appointment ${newStatus} successfully`);
        fetchAppointments();
      }
    } catch (error) {
      toast.error("Failed to update appointment status");
    }
  };

  const handlePatientHistoryClose = async (proceed = false) => {
    setShowPatientHistoryModal(false);

    if (proceed && pendingStatusChange) {
      try {
        await axios.put(
          `/api/appointments/${pendingStatusChange.appointmentId}/status`,
          {
            status: pendingStatusChange.newStatus,
            userId: user.id,
            userRole: user.role,
          }
        );
        toast.success(
          `Appointment ${pendingStatusChange.newStatus} successfully`
        );

        // Show prescription modal after marking as completed
        setShowPrescriptionModal(true);
      } catch (error) {
        toast.error("Failed to update appointment status");
        fetchAppointments();
      }
    } else if (!proceed) {
      // If doctor decides not to proceed, reset states
      setCurrentAppointment(null);
      setPendingStatusChange(null);
    }
  };

  const handleAddMedication = () => {
    setPrescriptionData((prev) => ({
      ...prev,
      medications: [
        ...prev.medications,
        { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
      ],
    }));
  };

  const handleRemoveMedication = (index) => {
    setPrescriptionData((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }));
  };

  const handleMedicationChange = (index, field, value) => {
    setPrescriptionData((prev) => {
      const updatedMedications = [...prev.medications];
      updatedMedications[index] = {
        ...updatedMedications[index],
        [field]: value,
      };
      return { ...prev, medications: updatedMedications };
    });
  };

  const handleNotesChange = (e) => {
    setPrescriptionData((prev) => ({
      ...prev,
      additionalNotes: e.target.value,
    }));
  };

  const handleSubmitPrescription = async () => {
    try {
      // Validate prescription data
      const isValid = prescriptionData.medications.every(
        (med) => med.name && med.dosage && med.frequency && med.duration
      );

      if (!isValid) {
        toast.error("Please fill in all required medication fields");
        return;
      }

      // Submit prescription
      await axios.post("/api/prescriptions", {
        appointmentId: currentAppointment._id,
        medications: prescriptionData.medications,
        additionalNotes: prescriptionData.additionalNotes,
        userId: user.id,
        userRole: user.role,
      });

      toast.success("Prescription created successfully");
      setShowPrescriptionModal(false);
      setPrescriptionData({
        medications: [
          {
            name: "",
            dosage: "",
            frequency: "",
            duration: "",
            instructions: "",
          },
        ],
        additionalNotes: "",
      });
      fetchAppointments();
    } catch (error) {
      console.error("Error creating prescription:", error);
      toast.error(
        error.response?.data?.message || "Failed to create prescription"
      );
    }
  };

  const handleClosePrescriptionModal = () => {
    setShowPrescriptionModal(false);
    setPrescriptionData({
      medications: [
        { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
      ],
      additionalNotes: "",
    });
    fetchAppointments();
  };

  const handlePrescriptionCreated = () => {
    setShowPrescriptionModal(false);
    setPrescriptionData({
      medications: [
        { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
      ],
      additionalNotes: "",
    });
    toast.success("Prescription created successfully");
    fetchAppointments();
  };

  const handleViewPrescription = async (appointmentId) => {
    try {
      const response = await axios.get(
        `/api/prescriptions/appointment/${appointmentId}?userId=${user.id}&userRole=${user.role}`
      );
      if (response.data.prescription) {
        setSelectedPrescription(response.data.prescription);
        setShowViewPrescriptionModal(true);
      } else {
        toast.info("No prescription found for this appointment");
      }
    } catch (error) {
      console.error("Error fetching prescription:", error);
      if (error.response?.status === 404) {
        toast.info("No prescription found for this appointment");
      } else {
        toast.error("Failed to load prescription");
      }
    }
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

  const renderAppointmentCard = (appointment) => {
    const appointmentDate = new Date(appointment.appointmentDate);
    const formattedDate = format(appointmentDate, "MMMM d, yyyy");

    const [hours, minutes] = appointment.appointmentTime.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    const formattedTime = `${hour12}:${minutes} ${ampm}`;

    return (
      <div
        key={appointment._id}
        style={{
          backgroundColor: "#E6F2E6",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
          boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
          <div style={{ textAlign: "center" }}>
            <img
              src={
                user.role === "patient"
                  ? appointment.doctor?.profilePic || "/default-profile.png"
                  : appointment.patient?.profilePic || "/default-profile.png"
              }
              alt="Profile"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <h4 style={{ fontWeight: "bold", marginTop: "10px" }}>
              {user.role === "patient"
                ? appointment.doctor?.email || "Doctor information unavailable"
                : appointment.patient?.email ||
                  "Patient information unavailable"}
            </h4>
            <p style={{ fontSize: "14px", color: "#666" }}>
              {user.role === "patient"
                ? appointment.doctor?.doctorSpecialty ||
                  "Specialty not specified"
                : appointment.patient?.phone || "Phone not available"}
            </p>
          </div>

          <div style={{ flexGrow: "1" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <h3 style={{ fontSize: "20px", fontWeight: "bold" }}>
                Appointment on {formattedDate}
              </h3>
              {renderStatusBadge(appointment.status)}
            </div>
            <p style={{ marginBottom: "10px" }}>Time: {formattedTime}</p>
            <p style={{ fontWeight: "bold" }}>Reason:</p>
            <p style={{ marginBottom: "10px" }}>{appointment.reason}</p>
            {appointment.notes && (
              <>
                <p style={{ fontWeight: "bold" }}>Notes:</p>
                <p>{appointment.notes}</p>
              </>
            )}

            {appointment.status === "scheduled" && (
              <div style={{ marginTop: "10px" }}>
                {user.role === "patient" && (
                  <button
                    onClick={() =>
                      handleStatusChange(appointment._id, "cancelled")
                    }
                    style={{
                      backgroundColor: "#F9B3B3",
                      color: "#8B0000",
                      padding: "8px 15px",
                      borderRadius: "5px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Cancel Appointment
                  </button>
                )}

                {user.role === "doctor" && (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() =>
                        handleStatusChange(appointment._id, "completed")
                      }
                      style={{
                        backgroundColor: "#E6F2E6",
                        color: "#2D6A2E",
                        padding: "8px 15px",
                        borderRadius: "5px",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Mark as Completed
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPatientId(appointment.patient._id);
                        setShowPatientHistoryModal(true);
                      }}
                      style={{
                        backgroundColor: "#F2E6E6",
                        color: "#6A2D2D",
                        padding: "8px 15px",
                        borderRadius: "5px",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Patient History
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(appointment._id, "cancelled")
                      }
                      style={{
                        backgroundColor: "#F9B3B3",
                        color: "#8B0000",
                        padding: "8px 15px",
                        borderRadius: "5px",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Cancel Appointment
                    </button>
                  </div>
                )}
              </div>
            )}

            {appointment.status === "completed" && user.role === "doctor" && (
              <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                <button
                  onClick={() => handleViewPrescription(appointment._id)}
                  style={{
                    backgroundColor: "#B3B3E6",
                    color: "#4A4A7D",
                    padding: "8px 15px",
                    borderRadius: "5px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  View Prescription
                </button>
                <button
                  onClick={() => {
                    if (onManagePrescription) {
                      onManagePrescription(appointment._id);
                    }
                  }}
                  style={{
                    backgroundColor: "#E6F2E6",
                    color: "#2D6A2E",
                    padding: "8px 15px",
                    borderRadius: "5px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Manage Prescription
                </button>
                <button
                  onClick={() => {
                    if (onViewPatientHistory) {
                      onViewPatientHistory(appointment.patient._id);
                    }
                  }}
                  style={{
                    backgroundColor: "#F2E6E6",
                    color: "#6A2D2D",
                    padding: "8px 15px",
                    borderRadius: "5px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Patient History
                </button>
              </div>
            )}

            {appointment.status === "completed" && user.role === "patient" && (
              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={() => handleViewPrescription(appointment._id)}
                  style={{
                    backgroundColor: "#B3B3E6",
                    color: "#4A4A7D",
                    padding: "8px 15px",
                    borderRadius: "5px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  View Prescription
                </button>
              </div>
            )}
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
        My Appointments
      </h1>

      <div style={{ marginBottom: "20px" }}>
        <label
          style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}
        >
          Filter by Status
        </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: "10px",
            width: "100%",
            borderRadius: "5px",
            border: "1px solid #B3B3E6",
          }}
        >
          <option value="all">All Appointments</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

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
      ) : appointments.length > 0 ? (
        <div>{appointments.map(renderAppointmentCard)}</div>
      ) : (
        <p style={{ textAlign: "center", color: "#666", padding: "10px 0" }}>
          No appointments found
        </p>
      )}

      {/* Prescription Modal */}
      {showPrescriptionModal && currentAppointment && (
        <WritePrescription
          appointment={currentAppointment}
          onSuccess={handlePrescriptionCreated}
          onClose={handleClosePrescriptionModal}
        />
      )}

      {/* View Prescription Modal */}
      {showViewPrescriptionModal && selectedPrescription && (
        <ViewPrescription
          prescription={selectedPrescription}
          onClose={() => setShowViewPrescriptionModal(false)}
        />
      )}

      {/* Patient History Modal */}
      {showPatientHistoryModal && selectedPatientId && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-auto bg-black bg-opacity-50">
          <div className="relative w-full max-w-4xl p-6 mx-4 mt-16 bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Patient History</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePatientHistoryClose(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Proceed with Completion
                </button>
                <button
                  onClick={() => handlePatientHistoryClose(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
            <div className="border-t pt-4">
              <p className="mb-4 text-gray-700">
                Please review the patient's history before marking the
                appointment as complete.
              </p>
              <div className="h-[60vh] overflow-y-auto">
                <PatientHistory
                  patientId={selectedPatientId}
                  onClose={() => {}}
                  embedded={true}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
