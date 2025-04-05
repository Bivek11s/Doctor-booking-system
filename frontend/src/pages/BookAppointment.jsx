import React, { useState, useEffect } from "react";
import { FaClock } from "react-icons/fa";

const BookAppointment = ({ onClose }) => {
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!doctor.trim() || !date.trim() || !time.trim()) {
      alert("Please fill out all fields before confirming the booking.");
      return;
    }
    alert(`Booking confirmed with ${doctor} on ${date} at ${time}`);
  };

  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    },
    container: {
      width: "90%",
      maxWidth: "800px",
      maxHeight: "80vh",
      overflowY: "auto",
      padding: "30px 30px 20px",
      borderRadius: "12px",
      background:
        'url("https://i.pinimg.com/736x/36/42/29/3642291603d80cbf90ee7421ba227a8b.jpg") no-repeat center center/cover',
      position: "relative",
    },
    closeButton: {
      position: "absolute",
      top: "10px",
      right: "20px",
      fontSize: "26px",
      fontWeight: "bold",
      background: "transparent",
      color: "#000",
      border: "none",
      cursor: "pointer",
      zIndex: 10000,
    },
    heading: {
      fontSize: "28px",
      fontWeight: "bold",
      marginBottom: "10px",
      color: "#111",
    },
    subheading: {
      fontSize: "16px",
      marginBottom: "30px",
      color: "#444",
    },
    form: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px",
    },
    label: {
      fontWeight: "500",
      marginBottom: "6px",
      display: "block",
      color: "#222",
    },
    input: {
      padding: "12px",
      border: "1px solid #ccc",
      borderRadius: "6px",
      width: "100%",
    },
    timeField: {
      gridColumn: "1 / -1",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    timeInputWrapper: {
      position: "relative",
      width: "200px", // fixed width container
    },
timeInput: {
  padding: "12px 40px 12px 12px", // extra right padding for icon space
  border: "1px solid #ccc",
  borderRadius: "10px",
  width: "100%",
  fontSize: "16px",
},
timeIcon: {
  position: "absolute",
  right: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  color: "#555",
  fontSize: "18px",
},
    buttonWrapper: {
      marginTop: "30px",
      gridColumn: "span 2",
      display: "flex",
      justifyContent: "center",
    },
    button: {
      backgroundColor: "#000",
      color: "#fff",
      padding: "12px 24px",
      border: "none",
      borderRadius: "8px",
      fontWeight: "600",
      cursor: "pointer",
    },
    footer: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "30px",
      fontSize: "14px",
      color: "#222",
    },
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <button style={styles.closeButton} onClick={onClose}>
          &times;
        </button>

        <h1 style={styles.heading}>Book an Appointment</h1>
        <p style={styles.subheading}>
          Select a doctor and choose a convenient date and time
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div>
            <label style={styles.label}><b>Doctor</b></label>
            <input
              type="text"
              placeholder="Search for a doctor"
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
              style={styles.input}
            />
          </div>

          <div>
            <label style={styles.label}><b>Date</b></label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              style={styles.input}
            />
          </div>

          <div style={styles.timeField}>
            <label style={styles.label}><b>Time</b></label>
            <div style={styles.timeInputWrapper}>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                style={styles.timeInput}
              />
            </div>
          </div>

          <div style={styles.buttonWrapper}>
            <button type="submit" style={styles.button}>
              Confirm Booking
            </button>
          </div>
        </form>

        <footer style={styles.footer}>
          <p>Contact Us: support@BookDoctorcom</p>
          <p>Follow Us on Social Media</p>
        </footer>
      </div>
    </div>
  );
};

export default BookAppointment;
