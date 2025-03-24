import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Define inline styles
  const styles = {
    navbar: {
      backgroundColor: "#4A90E2", // Primary Blue
      color: "white",
      padding: "15px 0",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    logo: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      textDecoration: "none",
      color: "white",
    },
    navLinks: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
    },
    navItem: {
      color: "white",
      textDecoration: "none",
      transition: "color 0.3s",
      fontWeight: "500",
    },
    navItemHover: {
      color: "#357ABD", // Darker Blue
    },
    logoutBtn: {
      backgroundColor: "#D0021B", // Red
      color: "white",
      border: "none",
      padding: "8px 15px",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background 0.3s",
    },
    logoutBtnHover: {
      backgroundColor: "#b8323e",
    },
    registerBtn: {
      backgroundColor: "white",
      color: "#4A90E2",
      padding: "8px 15px",
      borderRadius: "5px",
      textDecoration: "none",
      transition: "background 0.3s",
      fontWeight: "500",
    },
    registerBtnHover: {
      backgroundColor: "#e6e6e6", // Light Gray
    },
    profile: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    profilePic: {
      width: "35px",
      height: "35px",
      borderRadius: "50%",
      objectFit: "cover",
      border: "2px solid white",
    },
    username: {
      fontWeight: "500",
      color: "white",
    },
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          Doctor Appointment
        </Link>

        <div style={styles.navLinks}>
          {user ? (
            <>
              <Link to="/dashboard" style={styles.navItem}>
                Dashboard
              </Link>
              <Link to="/doctors" style={styles.navItem}>
                Doctors
              </Link>

              {(user.role === "doctor" || user.role === "admin") && (
                <Link to="/patients" style={styles.navItem}>
                  Patients
                </Link>
              )}

              {user.role === "admin" && (
                <Link to="/admin" style={styles.navItem}>
                  Admin
                </Link>
              )}

              <Link to="/profile" style={styles.navItem}>
                Profile
              </Link>

              <button
                onClick={handleLogout}
                style={styles.logoutBtn}
                onMouseOver={(e) => (e.target.style.backgroundColor = styles.logoutBtnHover.backgroundColor)}
                onMouseOut={(e) => (e.target.style.backgroundColor = styles.logoutBtn.backgroundColor)}
              >
                Logout
              </button>

              <div style={styles.profile}>
                <img src={user.profilePic} alt="Profile" style={styles.profilePic} />
                <span style={styles.username}>{user.fullName}</span>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.navItem}>
                Login
              </Link>
              <Link
                to="/register"
                style={styles.registerBtn}
                onMouseOver={(e) => (e.target.style.backgroundColor = styles.registerBtnHover.backgroundColor)}
                onMouseOut={(e) => (e.target.style.backgroundColor = styles.registerBtn.backgroundColor)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
