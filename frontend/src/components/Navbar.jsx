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

  const styles = {
    navbar: {
      position: "fixed",
      top: 0,
      right: 0,
      width: "100%",
      backgroundColor: "#4A90E2",
      padding: "10px 10px",
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      zIndex: 1000,
    },
    container: {
      display: "flex",
      alignItems: "center",
      gap: "20px",
      height: "20px",
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
    logoutBtn: {
      backgroundColor: "#D0021B",
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
        {user ? (
          <>
            <div style={styles.navLinks}>
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
            </div>

            <button
              onClick={handleLogout}
              style={styles.logoutBtn}
              onMouseOver={(e) =>
                (e.target.style.backgroundColor =
                  styles.logoutBtnHover.backgroundColor)
              }
              onMouseOut={(e) =>
                (e.target.style.backgroundColor =
                  styles.logoutBtn.backgroundColor)
              }
            >
              Logout
            </button>

            <div style={styles.profile}>
              <img
                src={
                  user.profilePic ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="Profile"
                style={styles.profilePic}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                }}
              />
              <span style={styles.username}>{user.fullName}</span>
            </div>
          </>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;
