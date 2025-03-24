import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.errorCode}>404</h1>
      <h2 style={styles.heading}>Page Not Found</h2>
      <p style={styles.text}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" style={styles.button}>
        Go to Home
      </Link>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f7f9fc",
    textAlign: "center",
    padding: "20px",
  },
  errorCode: {
    fontSize: "6rem",
    fontWeight: "bold",
    color: "#ff4d4d", // Red for error
    marginBottom: "10px",
  },
  heading: {
    fontSize: "2rem",
    fontWeight: "600",
    color: "#333",
    marginBottom: "15px",
  },
  text: {
    fontSize: "1rem",
    color: "#666",
    marginBottom: "20px",
    maxWidth: "400px",
  },
  button: {
    display: "inline-block",
    padding: "10px 20px",
    fontSize: "1rem",
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#007bff", // Primary button color
    textDecoration: "none",
    borderRadius: "5px",
    boxShadow: "0 4px 6px rgba(0, 123, 255, 0.2)",
    transition: "background-color 0.3s",
  },
};

export default NotFound;
