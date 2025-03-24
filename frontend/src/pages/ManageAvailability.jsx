import React from "react";
import DoctorAvailability from "../components/DoctorAvailability";

const ManageAvailability = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Manage Your Availability</h1>
      <div style={styles.availabilityContainer}>
        <DoctorAvailability />
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "20px",
    backgroundColor: "#f7f9fc",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333",
  },
  availabilityContainer: {
    padding: "20px",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
};

export default ManageAvailability;
