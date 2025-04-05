import React, { useState } from "react";

const PatientRegistration = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    gender: "",
    dob: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: 'url("https://img.freepik.com/free-photo/frame-medical-equipment-desk_23-2148519742.jpg") no-repeat center center/cover',
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
        <h2 style={{ textAlign: "center", fontSize: "24px", marginBottom: "20px" }}>
           Registration
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <label style={labelStyle}>Full Name</label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter your full name" required style={inputStyle} />

          {/* Email */}
          <label style={labelStyle}>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email address" required style={inputStyle} />

          {/* Password */}
          <label style={labelStyle}>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" required style={inputStyle} />

          {/* Gender */}
          <label style={labelStyle}>Gender</label>
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <label style={radioStyle}>
              <input type="radio" name="gender" value="Male" onChange={handleChange} required /> Male
            </label>
            <label style={radioStyle}>
              <input type="radio" name="gender" value="Female" onChange={handleChange} /> Female
            </label>
            <label style={radioStyle}>
              <input type="radio" name="gender" value="Other" onChange={handleChange} /> Other
            </label>
          </div>

          {/* Date of Birth */}
          <label style={labelStyle}>Date of Birth</label>
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} required style={inputStyle} />

          {/* Submit Button */}
          <button type="submit" style={buttonStyle} onMouseOver={(e) => (e.target.style.opacity = "0.8")} onMouseOut={(e) => (e.target.style.opacity = "1")}>
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

export default PatientRegistration;
