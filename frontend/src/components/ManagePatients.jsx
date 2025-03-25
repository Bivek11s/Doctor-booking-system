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
      backgroundColor: "#E5EFE5",
      padding: "20px",
      borderRadius: "8px",
    },
    table: {
      width: "100%",
      backgroundColor: "#D8E6EC",
      borderRadius: "8px",
      overflow: "hidden",
    },
    tableHeader: {
      backgroundColor: "#B7B9D1",
      color: "#fff",
    },
    tableRow: {
      borderBottom: "1px solid #ccc",
    },
    tableCell: {
      padding: "12px",
    },
    button: {
      padding: "8px 12px",
      margin: "4px",
      borderRadius: "4px",
      cursor: "pointer",
    },
    buttonEdit: {
      backgroundColor: "#B7B9D1",
      color: "#fff",
      border: "none",
    },
    buttonDelete: {
      backgroundColor: "#F9F9E9",
      color: "#000",
      border: "1px solid #ccc",
    },
    modal: {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    modalContent: {
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "8px",
      maxWidth: "400px",
      width: "100%",
    },
    input: {
      width: "100%",
      padding: "8px",
      margin: "5px 0",
      border: "1px solid #ccc",
      borderRadius: "4px",
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
                      src={patient.profilePic}
                      alt={patient.email}
                      className="w-10 h-10 rounded-full object-cover"
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
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete{" "}
              <strong>{patientToDelete.email}</strong>?
            </p>
            <button
              onClick={() => setShowDeleteModal(false)}
              style={styles.button}
            >
              Cancel
            </button>
            <button onClick={handleDeleteConfirm} style={styles.buttonDelete}>
              Delete
            </button>
          </div>
        </div>
      )}

      {showEditModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3>Edit Patient</h3>
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
              <button type="submit" style={styles.buttonEdit}>
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
