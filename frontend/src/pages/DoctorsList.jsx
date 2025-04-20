import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import BookAppointment from "../components/BookAppointment";
import { useSearchParams } from "react-router-dom";

const DoctorsList = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [specialty, setSpecialty] = useState("");
  const [specialties, setSpecialties] = useState([]);
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const specialtyFromUrl = searchParams.get("specialty");
    const searchFromUrl = searchParams.get("search");
    if (specialtyFromUrl) setSpecialty(specialtyFromUrl);
    if (searchFromUrl) setSearchQuery(searchFromUrl);
    fetchDoctors(specialtyFromUrl, searchFromUrl);
  }, [searchParams]);

  useEffect(() => {
    if (!searchParams.get("specialty") && !searchParams.get("search")) {
      fetchDoctors(specialty, searchQuery);
    }
  }, [specialty, verificationFilter]);

  const fetchDoctors = async (
    specialtyParam = specialty,
    searchParam = searchQuery
  ) => {
    try {
      setLoading(true);
      let url = "/api/users?role=doctor";

      if (specialtyParam) url += `&specialty=${specialtyParam}`;
      if (searchParam) url += `&search=${searchParam}`;
      if (verificationFilter !== "all")
        url += `&isVerified=${verificationFilter === "verified"}`;

      const response = await axios.get(url);
      setDoctors(response.data.users);

      if (!specialty) {
        const uniqueSpecialties = [
          ...new Set(
            response.data.users
              .map((doctor) => doctor.doctorSpecialty)
              .filter((spec) => spec)
          ),
        ];
        setSpecialties(uniqueSpecialties);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDoctor = async (doctorId, isApproved) => {
    try {
      await axios.post("/api/auth/verify-doctor", {
        doctorId,
        isApproved,
      });

      toast.success(
        `Doctor ${isApproved ? "approved" : "rejected"} successfully`
      );
      fetchDoctors();
    } catch (error) {
      console.error("Error verifying doctor:", error);
      toast.error("Failed to update doctor verification status");
    }
  };

  const handleBookAppointment = (doctorId) => {
    setSelectedDoctorId(doctorId);
    setShowBookingModal(true);
  };

  const handleBookingSuccess = (isSuccess) => {
    setShowBookingModal(false);
    setSelectedDoctorId(null);
    if (isSuccess) {
      toast.success("Appointment booked successfully!");
    }
  };

  const renderDoctorCard = (doctor) => (
    <div key={doctor._id} style={styles.card}>
      <div style={styles.cardContent}>
        <img
          src={doctor.profilePic}
          alt={`Dr. ${doctor.email}`}
          style={styles.profilePic}
        />
        <div>
          <h3 style={styles.name}>{doctor.fullName}</h3>
          <p style={styles.text}>Email: {doctor.email}</p>
          <p style={styles.text}>Phone: {doctor.phone}</p>
          <p style={styles.text}>
            <span style={styles.label}>Specialty:</span>{" "}
            {doctor.doctorSpecialty || "Not specified"}
          </p>
          <p style={styles.text}>
            <span style={styles.label}>Status:</span>{" "}
            <span
              style={{
                ...styles.badge,
                backgroundColor: doctor.isVerified ? "#1e824c" : "#f4d03f",
                color: doctor.isVerified ? "#fff" : "#000",
              }}
            >
              {doctor.isVerified ? "Verified" : "Pending"}
            </span>
          </p>

          {/* Wrapped this block in a div for spacing */}
          {doctor.qualificationProof && (
            <div style={{ marginBottom: "10px" }}>
              <a
                href={doctor.qualificationProof}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.link}
              >
                View Qualification Document
              </a>
            </div>
          )}

          {user?.role === "admin" && !doctor.isVerified && (
            <div style={styles.buttonContainer}>
              <button
                onClick={() => handleVerifyDoctor(doctor._id, true)}
                style={styles.approveBtn}
              >
                Approve
              </button>
              <button
                onClick={() => handleVerifyDoctor(doctor._id, false)}
                style={styles.rejectBtn}
              >
                Reject
              </button>
            </div>
          )}

          {user?.role === "patient" && doctor.isVerified && (
            <button
              onClick={() => handleBookAppointment(doctor._id)}
              style={styles.bookBtn}
            >
              Book Appointment
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <h1 style={styles.header}>Doctors Directory</h1>

      <div style={styles.filterContainer}>
        <div>
          <label style={styles.label}>Filter by Specialty</label>
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            style={styles.select}
          >
            <option value="">All Specialties</option>
            {specialties.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={styles.label}>Filter by Status</label>
          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            style={styles.select}
          >
            <option value="all">All Doctors</option>
            <option value="verified">Verified Only</option>
            <option value="pending">Pending Verification</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
        </div>
      ) : doctors.length > 0 ? (
        doctors.map(renderDoctorCard)
      ) : (
        <p style={styles.noDoctors}>No doctors found</p>
      )}

      {showBookingModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <button
              style={styles.closeButton}
              onClick={() => setShowBookingModal(false)}
            >
              &times;
            </button>
            <BookAppointment
              doctorId={selectedDoctorId}
              onSuccess={handleBookingSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  header: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    marginTop: "30px",
  },
  filterContainer: { display: "flex", gap: "20px", marginBottom: "20px" },
  label: { fontWeight: "bold", color: "#333" },
  select: { padding: "8px", borderRadius: "5px", border: "1px solid #ccc" },
  card: {
    backgroundColor: "#f7f9fc",
    padding: "16px",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  cardContent: { display: "flex", alignItems: "center", gap: "20px" },
  profilePic: { width: "80px", height: "80px", borderRadius: "50%" },
  name: { fontSize: "18px", fontWeight: "bold" },
  text: { color: "#555", margin: "5px 0" },
  link: {
    color: "#007bff",
    textDecoration: "underline",
    fontSize: "14px",
    display: "inline-block",
  },
  badge: { padding: "5px 10px", borderRadius: "5px", fontWeight: "bold" },
  buttonContainer: { display: "flex", gap: "10px", marginTop: "10px" },
  approveBtn: {
    backgroundColor: "#1e824c",
    color: "#fff",
    padding: "8px 12px",
    border: "none",
    borderRadius: "5px",
  },
  rejectBtn: {
    backgroundColor: "#d9534f",
    color: "#fff",
    padding: "8px 12px",
    border: "none",
    borderRadius: "5px",
  },
  bookBtn: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "8px 12px",
    border: "none",
    borderRadius: "5px",
    marginTop: "10px",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "200px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #007bff",
    borderTopColor: "transparent",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  noDoctors: { textAlign: "center", fontSize: "16px", color: "#777" },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    fontSize: "24px",
    cursor: "pointer",
  },
};

export default DoctorsList;
