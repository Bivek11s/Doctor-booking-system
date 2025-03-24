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
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email or Phone</label>
            <input
              type="text"
              name="emailOrPhone"
              value={formData.emailOrPhone}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter your email or phone"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div style={styles.registerLink}>
          <p>
            Don't have an account?{" "}
            <Link to="/register" style={styles.link}>
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#f7f9fc",
    padding: "24px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "100%",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333",
  },
  error: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "15px",
    fontSize: "14px",
  },
  formGroup: {
    marginBottom: "15px",
    textAlign: "left",
  },
  label: {
    fontWeight: "bold",
    color: "#333",
    marginBottom: "5px",
    display: "block",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
  registerLink: {
    marginTop: "15px",
    fontSize: "14px",
  },
  link: {
    color: "#007bff",
    textDecoration: "underline",
    cursor: "pointer",
  },
};

export default Login;
