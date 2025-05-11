import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";

const PatientsList = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== "doctor" && user?.role !== "admin") {
      return;
    }
    fetchPatients();
  }, [user]);

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

  const renderPatientCard = (patient) => (
    <div key={patient._id} style={styles.card}>
      <div style={styles.cardContent}>
        <div style={styles.imageWrapper}>
          <img
            src={patient.profilePic}
            alt={patient.email}
            style={styles.image}
          />
        </div>

        <div style={styles.info}>
          <h3 style={styles.name}>{patient.email}</h3>
          <p style={styles.text}>Phone: {patient.phone}</p>

          <div style={styles.detail}>
            <span style={styles.label}>Gender:</span> {patient.gender}
          </div>

          <div style={styles.detail}>
            <span style={styles.label}>Date of Birth:</span>{" "}
            {new Date(patient.dateOfBirth).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={styles.loaderWrapper}>
        <div style={styles.loader}></div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Patients Directory</h1>

      {patients.length > 0 ? (
        <div>
          <p style={styles.count}>Showing {patients.length} patient(s)</p>
          {patients.map(renderPatientCard)}
        </div>
      ) : (
        <div style={styles.noPatients}>
          <p style={styles.noPatientsText}>No patients found</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "40px 20px",
    backgroundColor: "#f9fbfc",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "700",
    marginBottom: "30px",
    color: "#1f3a5f",
    textAlign: "center",
  },
  count: {
    marginBottom: "25px",
    fontSize: "1.1rem",
    color: "#555",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
    maxWidth: "800px",
    marginInline: "auto",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    cursor: "pointer",
  },
  cardContent: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  imageWrapper: {
    flexShrink: 0,
    marginRight: "25px",
  },
  image: {
    width: "85px",
    height: "85px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #007bff",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#007bff",
    marginBottom: "6px",
  },
  text: {
    fontSize: "1rem",
    color: "#555",
    marginBottom: "6px",
  },
  detail: {
    fontSize: "0.95rem",
    color: "#333",
    marginBottom: "4px",
  },
  label: {
    fontWeight: "bold",
    color: "#444",
  },
  loaderWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "64vh",
  },
  loader: {
    width: "50px",
    height: "50px",
    border: "5px solid #ccc",
    borderTop: "5px solid #007bff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  noPatients: {
    textAlign: "center",
    padding: "30px",
  },
  noPatientsText: {
    fontSize: "1.25rem",
    color: "#999",
  },

};

0; // Add keyframes animation for loader
const styleElement = document.createElement("style");
styleElement.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleElement);

export default PatientsList;
