import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ManagePatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPatient, setEditPatient] = useState({
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    fullName: "",
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/users?role=patient");
      setPatients(response.data.users);
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast.error("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (patient) => {
    setPatientToDelete(patient);
    setShowDeleteModal(true);
  };

  const handleEditClick = (patient) => {
    const formattedDate = patient.dateOfBirth
      ? new Date(patient.dateOfBirth).toISOString().split("T")[0]
      : "";

    setEditPatient({
      ...patient,
      dateOfBirth: formattedDate,
    });
    setShowEditModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/users/${patientToDelete._id}`);
      toast.success("Patient deleted successfully");
      fetchPatients();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting patient:", error);
      toast.error(error.response?.data?.message || "Failed to delete patient");
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditPatient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/users/${editPatient._id}`, editPatient);
      toast.success("Patient updated successfully");
      fetchPatients();
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating patient:", error);
      toast.error(error.response?.data?.message || "Failed to update patient");
    }
  };

  const styles = {
  container: {
    backgroundColor: "#f8fafc",
    padding: "30px",
    borderRadius: "10px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  table: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  tableHeader: {
    backgroundColor: "#E5E7EB", // same gray header as ManageDoctors
    color: "#374151", // dark gray text
    textAlign: "left",
  },
  tableRow: {
    borderBottom: "1px solid #E5E7EB",
    backgroundColor: "#F9FAFB",
    transition: "background 0.2s ease",
  },
  tableCell: {
    padding: "12px 16px",
    fontSize: "0.95rem",
    color: "#334155",
  },
  button: {
    padding: "8px 12px",
    marginRight: "6px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    border: "none",
  },
  buttonEdit: {
    backgroundColor: "#4A90E2", // consistent blue
    color: "#fff",
  },
  buttonDelete: {
    backgroundColor: "#EF4444", // consistent red
    color: "#fff",
  },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "10px",
    width: "90%",
    maxWidth: "400px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "0.95rem",
  },
};



  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 className="text-xl font-semibold mb-4">Manage Patients</h2>

      {patients.length > 0 ? (
        <div style={styles.table}>
          <table>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.tableCell}>Profile</th>
                <th style={styles.tableCell}>Full Name</th>
                <th style={styles.tableCell}>Email</th>
                <th style={styles.tableCell}>Phone</th>
                <th style={styles.tableCell}>Gender</th>
                <th style={styles.tableCell}>Date of Birth</th>
                <th style={styles.tableCell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient._id} style={styles.tableRow}>
                  <td style={styles.tableCell}>
                    <img
                      src={
                        patient.profilePic
                          ? patient.profilePic
                              .replace(
                                "drive.google.com/file/d/",
                                "drive.google.com/uc?id="
                              )
                              .replace("/view", "")
                          : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      }
                      alt={patient.email}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                      }}
                    />
                  </td>
                  <td style={styles.tableCell}>{patient.fullName}</td>
                  <td style={styles.tableCell}>{patient.email}</td>
                  <td style={styles.tableCell}>{patient.phone}</td>
                  <td style={styles.tableCell}>{patient.gender}</td>
                  <td style={styles.tableCell}>
                    {new Date(patient.dateOfBirth).toLocaleDateString()}
                  </td>
                  <td style={styles.tableCell}>
                    <button
                      onClick={() => handleEditClick(patient)}
                      style={{ ...styles.button, ...styles.buttonEdit }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(patient)}
                      style={{ ...styles.button, ...styles.buttonDelete }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-4 text-gray-600">No patients found</div>
      )}

      {showDeleteModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "10px" }}>
              Confirm Delete
            </h3>
            <p style={{ marginBottom: "20px", color: "#374151" }}>
              Are you sure you want to delete {patientToDelete.email}?
            </p>

            <button
              onClick={() => setShowDeleteModal(false)}
              style={styles.button}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              style={{
                ...styles.button,
                backgroundColor: "#e5e7eb", 
                color: "#1f2937",           
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {showEditModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "10px" }}>
              Edit Patient
            </h3>
            <form onSubmit={handleEditSubmit}>
              <input
                type="text"
                name="fullName"
                value={editPatient.fullName}
                onChange={handleEditChange}
                style={styles.input}
              />
              <input
                type="tel"
                name="phone"
                value={editPatient.phone}
                onChange={handleEditChange}
                style={styles.input}
              />
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                style={styles.button}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  ...styles.button,
                  backgroundColor: "#e5e7eb", 
                  color: "#1f2937",           
                }}
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePatients;
