import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    role: "patient",
    profilePic: null,
    qualificationProof: null,
    doctorSpecialty: "",
  });

  const [previewProfilePic, setPreviewProfilePic] = useState("");

  const [showDoctorFields, setShowDoctorFields] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === "role") {
      setShowDoctorFields(e.target.value === "doctor");
    }
    if (e.target.type === "file") {
      const file = e.target.files[0];
      setFormData({ ...formData, [e.target.name]: file });

      if (e.target.name === "profilePic" && file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewProfilePic(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      for (const key in formData) {
        if (formData[key] !== null && formData[key] !== undefined) {
          submitData.append(key, formData[key]);
        }
      }

      const response = await axios.post("/api/auth/register", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          'url("https://img.freepik.com/free-photo/frame-medical-equipment-desk_23-2148519742.jpg") no-repeat center center/cover',
      }}
    >
      <div
        style={{
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "400px",
          background: "rgba(255, 255, 255, 0.85)", // Light transparent background for readability
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "24px",
            marginBottom: "20px",
          }}
        >
          Registration
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <label style={labelStyle}>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
            style={inputStyle}
          />

          {/* Email */}
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            required
            style={inputStyle}
          />

          {/* Password */}
          <label style={labelStyle}>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            style={inputStyle}
          />

          {/* Phone Number */}
          <label style={labelStyle}>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            required
            style={inputStyle}
          />

          {/* Gender */}
          <label style={labelStyle}>Gender</label>
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <label style={radioStyle}>
              <input
                type="radio"
                name="gender"
                value="male"
                onChange={handleChange}
                required
              />{" "}
              Male
            </label>
            <label style={radioStyle}>
              <input
                type="radio"
                name="gender"
                value="female"
                onChange={handleChange}
              />{" "}
              Female
            </label>
            <label style={radioStyle}>
              <input
                type="radio"
                name="gender"
                value="other"
                onChange={handleChange}
              />{" "}
              Other
            </label>
          </div>

          {/* Date of Birth */}
          <label style={labelStyle}>Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          {/* Role Selection */}
          <label style={labelStyle}>Register as</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>

          {/* Profile Picture Field */}
          <div>
            {previewProfilePic && (
              <div style={{ marginBottom: "10px", textAlign: "center" }}>
                <img
                  src={previewProfilePic}
                  alt="Profile Preview"
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid rgba(0, 0, 0, 0.1)",
                  }}
                />
              </div>
            )}
            <label style={labelStyle}>Profile Picture</label>
            <input
              type="file"
              name="profilePic"
              accept="image/*"
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {/* Doctor Specific Fields */}
          {showDoctorFields && (
            <div>
              <label style={labelStyle}>Specialty</label>
              <input
                type="text"
                name="doctorSpecialty"
                value={formData.doctorSpecialty}
                onChange={handleChange}
                placeholder="Enter your medical specialty"
                style={inputStyle}
                required={formData.role === "doctor"}
              />
              <label style={labelStyle}>Qualification Document</label>
              <input
                type="file"
                name="qualificationProof"
                accept=".pdf,.doc,.docx"
                onChange={handleChange}
                style={inputStyle}
                required={formData.role === "doctor"}
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            style={buttonStyle}
            onMouseOver={(e) => (e.target.style.opacity = "0.8")}
            onMouseOut={(e) => (e.target.style.opacity = "1")}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

// Reusable Styles
const labelStyle = { fontWeight: "bold", fontSize: "14px" };
const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  border: "1px solid rgba(0, 0, 0, 0.3)",
  borderRadius: "5px",
  outline: "none",
};
const radioStyle = { display: "flex", alignItems: "center", gap: "5px" };
const buttonStyle = {
  width: "100%",
  padding: "12px",
  fontSize: "16px",
  fontWeight: "bold",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  transition: "opacity 0.3s",
  background: "rgba(0, 0, 0, 0.7)", // Dark button with opacity effect
  color: "white",
};

export default Register;
