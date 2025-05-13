import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const styles = {
    container: {
      fontFamily: "'Segoe UI', sans-serif",
      background: "#2234A8"
    },      
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "20px 60px",
      background: "#90D5FF",
    },
    logo: {
      fontWeight: "bold",
      fontSize: "20px",
      color: "#1e1e1e",
    },
    navLinks: {
      display: "flex",
      gap: "30px",
      fontSize: "15px",
      fontWeight: 500,
      color: "#333",
      marginLeft: "500px", // 🟢 pushes links to the right
    },
    talkBtn: {
      background: "#007bff",
      border: "none",
      color: "#fff",
      padding: "10px 18px",
      borderRadius: "8px",
      fontWeight: "600",
      cursor: "pointer",
    },
    hero: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "60px",
      background: "#fff",
    },
    left: {
      maxWidth: "50%",
    },
    intro: {
      fontSize: "14px",
      color: "#888",
      marginBottom: "8px",
    },
    headline: {
      fontSize: "44px",
      fontWeight: "700",
      color: "#111",
      lineHeight: "1.2",
    },
    highlight: {
      color: "#007bff",
    },
    desc: {
      fontSize: "15px",
      color: "#555",
      margin: "20px 0",
      maxWidth: "90%",
    },
    heroBtns: {
      display: "flex",
      gap: "16px",
    },
    primaryBtn: {
      background: "#007bff",
      color: "white",
      border: "none",
      padding: "10px 20px",
      borderRadius: "6px",
      fontWeight: "600",
      cursor: "pointer",
    },
    secondaryBtn: {
      background: "white",
      border: "1px solid #ccc",
      color: "#333",
      padding: "10px 20px",
      borderRadius: "6px",
      fontWeight: "600",
      cursor: "pointer",
    },
    image: {
      maxWidth: "45%",
    },
    statsSection: {
      background: "#f1f3f6",
      padding: "50px 20px",
      textAlign: "center",
    },
    statsHeader: {
      fontSize: "22px",
      fontWeight: 600,
      marginBottom: "10px",
    },
    statsSubText: {
      fontSize: "14px",
      color: "#777",
      marginBottom: "40px",
    },
    statsRow: {
      display: "flex",
      justifyContent: "center",
      gap: "50px",
      flexWrap: "wrap",
    },
    statBox: {
      textAlign: "center",
    },
    statNumber: {
      fontSize: "22px",
      fontWeight: "700",
      color: "#000",
    },
    statLabel: {
      fontSize: "14px",
      color: "#555",
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logo}>DocOnCall</div>
        <nav style={styles.navLinks}>
          <span>About Us</span>
          <span>Our Service</span>
          <span>Contact Us</span>
        </nav>
        <button style={styles.talkBtn} onClick={() => navigate("/login")}>Let's Talk</button>
      </header>

      <section style={styles.hero}>
        <div style={styles.left}>
          <p style={styles.intro}>Meet With</p>
          <h1 style={styles.headline}>
            Our Best Doctors Online<br/>
          </h1>
          <p style={styles.desc}>
          Your Health, Just a Click Away!
          </p>
          <div style={styles.heroBtns}>
             <button style={styles.primaryBtn} onClick={() => navigate("/login")}>Schedule Appointment</button>
            <button style={styles.secondaryBtn}>Learn More</button>
          </div>
        </div>
        <img
          src="https://iprospectcheck.com/wp-content/uploads/2022/07/physican-background-check.jpg"
          alt="Doctor"
          style={styles.image}
        />
      </section>

      <section style={styles.statsSection}>
        <div style={styles.statsHeader}>Our Stats show that we’ve Happy Patients</div>
        <div style={styles.statsSubText}>
          And excellence partially estimating terminated day everything.
        </div>
        <div style={styles.statsRow}>
          <div style={styles.statBox}>
            <div style={styles.statNumber}>25,356</div>
            <div style={styles.statLabel}>Patients Served</div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statNumber}>6,050</div>
            <div style={styles.statLabel}>Consultations this week</div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statNumber}>21</div>
            <div style={styles.statLabel}>Locations</div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statNumber}>95%</div>
            <div style={styles.statLabel}>Success Rate</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;