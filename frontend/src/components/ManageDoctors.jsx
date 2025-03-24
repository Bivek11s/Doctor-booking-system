import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDoctor, setEditDoctor] = useState({
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    doctorSpecialty: "",
    isVerified: false,
    fullName: "",
  });
  const [specialty, setSpecialty] = useState("");
  const [specialties, setSpecialties] = useState([]);
  const [verificationFilter, setVerificationFilter] = useState("all");

  useEffect(() => {
    fetchDoctors();
  }, [specialty, verificationFilter]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      let url = "/api/users?role=doctor";

      if (specialty) {
        url += `&specialty=${specialty}`;
      }

      if (verificationFilter !== "all") {
        url += `&isVerified=${verificationFilter === "verified"}`;
      }

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
      toast.error("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (doctor) => {
    setDoctorToDelete(doctor);
    setShowDeleteModal(true);
  };

  const handleEditClick = (doctor) => {
    const formattedDate = doctor.dateOfBirth
      ? new Date(doctor.dateOfBirth).toISOString().split("T")[0]
      : "";

    setEditDoctor({
      ...doctor,
      dateOfBirth: formattedDate,
    });
    setShowEditModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/users/${doctorToDelete._id}`);
      toast.success("Doctor deleted successfully");
      fetchDoctors();
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Failed to delete doctor");
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditDoctor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/users/${editDoctor._id}`, editDoctor);
      toast.success("Doctor updated successfully");
      fetchDoctors();
      setShowEditModal(false);
    } catch (error) {
      toast.error("Failed to update doctor");
    }
  };

  const handleVerifyDoctor = async (doctorId, isApproved) => {
    try {
      await axios.post("/api/auth/verify-doctor", { doctorId, isApproved });
      toast.success(`Doctor ${isApproved ? "approved" : "rejected"} successfully`);
      fetchDoctors();
    } catch (error) {
      toast.error("Failed to update doctor verification status");
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "64vh" }}>
        <div style={{ borderTop: "4px solid #4A90E2", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite" }}></div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px", color: "#1E3A8A" }}>Manage Doctors</h2>

      <div style={{ marginBottom: "20px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <label style={{ color: "#4A90E2", fontWeight: "bold" }}>Filter by Specialty</label>
          <select value={specialty} onChange={(e) => setSpecialty(e.target.value)} style={{ padding: "8px", borderRadius: "4px", border: "1px solid #4A90E2" }}>
            <option value="">All Specialties</option>
            {specialties.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ color: "#4A90E2", fontWeight: "bold" }}>Filter by Status</label>
          <select value={verificationFilter} onChange={(e) => setVerificationFilter(e.target.value)} style={{ padding: "8px", borderRadius: "4px", border: "1px solid #4A90E2" }}>
            <option value="all">All Doctors</option>
            <option value="verified">Verified Only</option>
            <option value="pending">Pending Verification</option>
          </select>
        </div>
      </div>

      {doctors.length > 0 ? (
        <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#ffffff" }}>
          <thead>
            <tr style={{ backgroundColor: "#E5E7EB", color: "#374151", textAlign: "left" }}>
              <th style={{ padding: "12px" }}>Profile</th>
              <th style={{ padding: "12px" }}>Email</th>
              <th style={{ padding: "12px" }}>Phone</th>
              <th style={{ padding: "12px" }}>Specialty</th>
              <th style={{ padding: "12px" }}>Status</th>
              <th style={{ padding: "12px", textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor._id} style={{ borderBottom: "1px solid #E5E7EB", backgroundColor: "#F9FAFB" }}>
                <td style={{ padding: "12px" }}>
                  <img src={doctor.profilePic} alt="Doctor" style={{ width: "40px", height: "40px", borderRadius: "50%" }} />
                </td>
                <td style={{ padding: "12px" }}>{doctor.fullName}</td>
                <td style={{ padding: "12px" }}>{doctor.phone}</td>
                <td style={{ padding: "12px" }}>{doctor.doctorSpecialty || "Not specified"}</td>
                <td style={{ padding: "12px" }}>
                  <span style={{ color: doctor.isVerified ? "#22C55E" : "#F59E0B", fontWeight: "bold" }}>
                    {doctor.isVerified ? "Verified" : "Pending Verification"}
                  </span>
                </td>
                <td style={{ padding: "12px", textAlign: "center" }}>
                  <button onClick={() => handleEditClick(doctor)} style={{ color: "#4A90E2", marginRight: "8px" }}>✏️</button>
                  <button onClick={() => handleDeleteClick(doctor)} style={{ color: "#E11D48", marginRight: "8px" }}>🗑️</button>
                  {!doctor.isVerified && (
                    <>
                      <button onClick={() => handleVerifyDoctor(doctor._id, true)} style={{ color: "#22C55E", marginRight: "8px" }}>✔️</button>
                      <button onClick={() => handleVerifyDoctor(doctor._id, false)} style={{ color: "#E11D48" }}>❌</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: "center", color: "#9CA3AF" }}>No doctors found matching your criteria</p>
      )}
    </div>
  );
};

export default ManageDoctors;
