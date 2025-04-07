import React from "react";

const AppointmentNotifications = () => {
  const styles = {
    navbar: {
      height: "60px",
      width: "1350px",
      backgroundColor: "#ADD8E6", 
      color: "#fff", 
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 40px",
      position: "sticky",
      top: 0,
      zIndex: 1000,
      borderBottom: "1px solid #e5e7eb",
    },
    link: {
      color: "#fff", 
      textDecoration: "none",
      marginLeft: "20px",
      fontWeight: "500",
    },
    container: {
      fontFamily: "Segoe UI, sans-serif",
      padding: "40px",
      backgroundColor: "#f8fafc", 
      minHeight: "100vh",
      maxWidth: "1440px",
      margin: "0 auto",
      backgroundImage: "url('https://www.sonifihealth.com/wp-content/uploads/2021/05/education-hero-1650x600-1.jpg')",
      backgroundPosition: "center", 
      backgroundRepeat: "no-repeat", 
    },
    profileSection: {
      backgroundColor: "#e2e8f0", 
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "30px",
      borderRadius: "10px",
      marginBottom: "40px",
    },
    profileInfo: {
      flexGrow: 1,
      color: "#333", 
    },
    profileName: {
      fontSize: "20px",
      fontWeight: "600",
    },
    profileSubtitle: {
      color: "#555", 
    },
    avatar: {
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      backgroundColor: "#cbd5e1", 
      marginRight: "20px",
    },
    editButton: {
      backgroundColor: "#ADD8E6", 
      color: "#fff",
      padding: "10px 20px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "500",
    },
    section: {
      width: "800px",
      backgroundColor: "#fff", 
      borderRadius: "10px",
      padding: "30px",
      marginBottom: "40px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", 
    },
    sectionTitle: {
      fontSize: "24px",
      fontWeight: "700",
      marginBottom: "10px",
      color: "#333", 
    },
    description: {
      color: "#555", 
      marginBottom: "20px",
    },
    toggleRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "15px",
    },
    toggleLabel: {
      fontWeight: "500",
      color: "#333", 
    },
    saveButton: {
      backgroundColor: "#ADD8E6", 
      color: "#fff",
      padding: "10px 20px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "500",
      marginTop: "15px",
    },
    calendarItem: {
      display: "flex",
      alignItems: "center",
      marginBottom: "15px",
    },
    calendarIcon: {
      width: "50px",
      height: "50px",
      backgroundColor: "#f1f5f9", 
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "700",
      color: "#1e3a8a", 
      marginRight: "20px",
    },
    details: {
      display: "flex",
      flexDirection: "column",
      color: "#333", 
    },
  };

  return (
    <div>
      {/* Navbar */}
      <div style={styles.navbar}>
        <div style={{ fontSize: "20px", fontWeight: "bold" }}>
          Appointment Notifications
        </div>
        <div>
          <a href="#home" style={styles.link}>Home</a>
          <a href="#settings" style={styles.link}>Settings</a>
        </div>
      </div>

      {/* Container */}
      <div style={styles.container}>
        {/* Profile */}
        <div style={styles.profileSection}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={styles.avatar}></div>
            <div style={styles.profileInfo}>
              <div style={styles.profileName}>Name</div>
              <div style={styles.profileSubtitle}>Manage your appointment</div>
            </div>
          </div>
          <button style={styles.editButton}>Edit Profile</button>
        </div>

        {/* Notification Settings */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Email Notification Settings</h2>

          <div style={styles.toggleRow}>
            <span style={styles.toggleLabel}>New Booking Notifications</span>
            <input type="checkbox" defaultChecked />
          </div>
          <p style={styles.description}>Receive alerts for new bookings</p>

          <div style={styles.toggleRow}>
            <span style={styles.toggleLabel}>Rescheduled Booking Notifications</span>
            <input type="checkbox" defaultChecked />
          </div>
          <p style={styles.description}>Receive alerts for rescheduled bookings</p>

          <div style={styles.toggleRow}>
            <span style={styles.toggleLabel}>Canceled Booking Notifications</span>
            <input type="checkbox" />
          </div>
          <p style={styles.description}>Receive alerts for canceled bookings</p>

          <button style={styles.saveButton}>Save Changes</button>
        </div>

        {/* Recent Appointments */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Recent Appointments</h2>
          <p style={styles.description}>Stay up to date with your bookings</p>
          <button style={styles.saveButton}>View All Appointments</button>
        </div>

        {/* Upcoming Appointments */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Upcoming Bookings</h2>
          <p style={styles.description}>Here are your upcoming appointments</p>

          <div style={styles.calendarItem}>
            <div style={styles.calendarIcon}>17</div>
            <div style={styles.details}>
              <strong>Appointment with Dr.John</strong>
              <span>Thursday, 3:00 PM</span>
            </div>
          </div>

          <div style={styles.calendarItem}>
            <div style={styles.calendarIcon}>18</div>
            <div style={styles.details}>
              <strong>Counseling Session</strong>
              <span>Friday, 10:30 AM</span>
            </div>
          </div>

          <button style={styles.saveButton}>View Details</button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentNotifications;