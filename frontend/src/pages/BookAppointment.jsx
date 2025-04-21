import React, { useState, useEffect } from "react";
import { FaClock } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const BookAppointment = ({ onClose }) => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    fetchDoctors();
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get("/api/users?role=doctor");
      setDoctors(response.data.users);
    } catch (error) {
      toast.error("Failed to load doctors");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !date || !time || !reason.trim()) {
      toast.error("Please fill out all fields before confirming the booking.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/appointments", {
        doctorId: selectedDoctor,
        patientId: user.id,
        appointmentDate: date,
        appointmentTime: time,
        reason: reason.trim(),
      });

      toast.success("Appointment booked successfully");
      onClose?.();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to book appointment"
      );
    } finally {
      setLoading(false);
    }
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
    // styling for backgorund 
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
    // for buttons
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
      width: "200px",
    },
    timeInput: {
      padding: "12px 40px 12px 12px",
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
        <button style={styles.closeButton} onClick={() => onClose?.()}>
          &times;
        </button>

        <h1 style={styles.heading}>Book an Appointment</h1>
        <p style={styles.subheading}>
          Select a doctor and choose a convenient date and time
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div>
            <label style={styles.label}>
              <b>Doctor</b>
            </label>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              style={styles.input}
              required
            >
              <option value="">Select a doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  Dr. {doctor.fullName} - {doctor.doctorSpecialty}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={styles.label}>
              <b>Date</b>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              style={styles.input}
            />
          </div>

          <div style={styles.timeField}>
            <label style={styles.label}>
              <b>Time</b>
            </label>
            <div style={styles.timeInputWrapper}>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                style={styles.timeInput}
              />
              <FaClock style={styles.timeIcon} />
            </div>
          </div>

          <div style={styles.timeField}>
            <label style={styles.label}>
              <b>Reason for Visit</b>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please describe your reason for visit"
              style={{ ...styles.input, height: "100px", resize: "vertical" }}
              required
            />
          </div>

          <div style={styles.buttonWrapper}>
            <button
              type="submit"
              style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
              disabled={loading}
            >
              {loading ? "Booking..." : "Confirm Booking"}
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
