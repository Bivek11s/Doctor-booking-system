import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.emailOrPhone || !formData.password) {
      return setError("Please fill in all fields");
    }

    try {
      setLoading(true);
      await login(formData.emailOrPhone, formData.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    // style for whole page 
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
      // for the box
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
          Login
        </h2>

        {error && (
          <div style={errorStyle}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email or Phone */}
          <label style={labelStyle}>Email or Phone</label>
          <input type="text" name="emailOrPhone" value={formData.emailOrPhone} onChange={handleChange} placeholder="Enter your email or phone" required style={inputStyle} />

          {/* Password */}
          <label style={labelStyle}>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" required style={inputStyle} />

          {/* Submit Button */}
          <button type="submit" style={buttonStyle} onMouseOver={(e) => (e.target.style.opacity = "0.8")} onMouseOut={(e) => (e.target.style.opacity = "1")} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register Link */}
        <div style={{ textAlign: "center", marginTop: "15px", fontSize: "14px" }}>
          <p>
            Don't have an account?{" "}
            <Link to="/register" style={{ textDecoration: "underline" }}>
              Register here
            </Link>
          </p>
        </div>
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
const errorStyle = {
  background: "rgba(255, 0, 0, 0.1)",
  padding: "10px",
  borderRadius: "5px",
  marginBottom: "15px",
  fontSize: "14px",
  textAlign: "center",
};

export default Login;
