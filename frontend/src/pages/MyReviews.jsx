import React from "react";
import PatientReviews from "../components/PatientReviews";
import { useAuth } from "../contexts/AuthContext";

const MyReviews = () => {
  const { user } = useAuth();

  if (!user || user.role !== "patient") {
    return (
      <div style={styles.container}>
        <p style={styles.message}>Only patients can access this page.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>My Doctor Reviews</h1>
      <p style={styles.subheader}>
        View and manage all the reviews you've submitted for doctors
      </p>
      <PatientReviews />
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  header: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "10px",
  },
  subheader: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "20px",
  },
  message: {
    textAlign: "center",
    fontSize: "18px",
    color: "#666",
    padding: "40px 0",
  },
};

export default MyReviews;
