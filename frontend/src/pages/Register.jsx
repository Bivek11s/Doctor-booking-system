import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "",
    dateOfBirth: "",
    role: "patient",
    doctorSpecialty: "",
    profilePic: null,
    qualificationProof: null,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.gender ||
      !formData.dateOfBirth
    ) {
      return setError("Please fill in all required fields");
    }

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    if (
      formData.role === "doctor" &&
      (!formData.doctorSpecialty || !formData.qualificationProof)
    ) {
      return setError(
        "Doctor specialty and qualification proof are required for doctors"
      );
    }

    try {
      setLoading(true);
      const submitData = new FormData();
      for (const key in formData) {
        if (key !== "confirmPassword" && formData[key] !== null) {
          submitData.append(key, formData[key]);
        }
      }

      await register(submitData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  // Inline CSS
  const styles = {
    container: {
      maxWidth: "500px",
      margin: "50px auto",
      padding: "20px",
      borderRadius: "8px",
      backgroundColor: "#EEF1DA", // Pale cream
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    heading: {
      fontSize: "24px",
      fontWeight: "bold",
      textAlign: "center",
      color: "#ADB2D4", // Muted lavender
    },
    input: {
      width: "100%",
      padding: "10px",
      marginBottom: "10px",
      borderRadius: "5px",
      border: "1px solid #C7D9DD", // Soft pastel blue
      backgroundColor: "#D5E5D5", // Light pastel green
      color: "#333",
    },
    button: {
      width: "100%",
      padding: "12px",
      backgroundColor: "#ADB2D4", // Muted lavender
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "16px",
    },
    buttonDisabled: {
      backgroundColor: "#C7D9DD", // Softer tone when disabled
      cursor: "not-allowed",
    },
    errorBox: {
      backgroundColor: "#FFC0C0",
      color: "#721c24",
      padding: "10px",
      borderRadius: "5px",
      marginBottom: "10px",
      textAlign: "center",
    },
    link: {
      color: "#ADB2D4",
      textDecoration: "underline",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Register</h2>

      {error && <div style={styles.errorBox}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          style={styles.input}
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          style={styles.input}
          required
        >
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>

        {formData.role === "doctor" && (
          <input
            type="text"
            name="doctorSpecialty"
            placeholder="Specialty"
            value={formData.doctorSpecialty}
            onChange={handleChange}
            style={styles.input}
            required
          />
        )}

        <div style={{ marginBottom: "10px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Profile Picture
          </label>
          <input
            type="file"
            name="profilePic"
            onChange={handleFileChange}
            style={styles.input}
            accept="image/*"
          />
          {formData.profilePic && (
            <div style={{ marginTop: "10px" }}>
              <p style={{ marginBottom: "5px" }}>Preview:</p>
              <img
                src={URL.createObjectURL(formData.profilePic)}
                alt="Profile preview"
                style={{
                  maxWidth: "100px",
                  maxHeight: "100px",
                  border: "1px solid #C7D9DD",
                }}
              />
            </div>
          )}
        </div>

        {formData.role === "doctor" && (
          <div style={{ marginBottom: "10px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Medical Qualification Proof (PDF or Image)
            </label>
            <input
              type="file"
              name="qualificationProof"
              onChange={handleFileChange}
              style={styles.input}
              accept="image/*, application/pdf"
              required
            />
            {formData.qualificationProof && (
              <div style={{ marginTop: "10px" }}>
                <p style={{ marginBottom: "5px" }}>
                  Selected file: {formData.qualificationProof.name}
                </p>
                {formData.qualificationProof.type.startsWith("image/") && (
                  <img
                    src={URL.createObjectURL(formData.qualificationProof)}
                    alt="Qualification preview"
                    style={{
                      maxWidth: "100px",
                      maxHeight: "100px",
                      border: "1px solid #C7D9DD",
                    }}
                  />
                )}
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {}),
          }}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <p>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
