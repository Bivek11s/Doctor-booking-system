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

  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      await axios.delete(`/api/users/${doctorToDelete._id}`);
      toast.success("Doctor deleted successfully");
      fetchDoctors();
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Failed to delete doctor");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    // Convert isVerified string value to boolean
    if (name === "isVerified") {
      setEditDoctor((prev) => ({
        ...prev,
        [name]: value === "true",
      }));
    } else {
      setEditDoctor((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsUpdating(true);

      // First, handle verification status separately if it has changed
      const originalDoctor = doctors.find((doc) => doc._id === editDoctor._id);
      const verificationChanged =
        originalDoctor && originalDoctor.isVerified !== editDoctor.isVerified;

      // If verification status changed, use the dedicated endpoint
      if (verificationChanged) {
        await axios.patch(`/api/users/${editDoctor._id}/verify`, {
          isVerified: editDoctor.isVerified,
        });
      }

      // For other fields, use the regular update endpoint
      const doctorData = { ...editDoctor };

      // Remove fields that shouldn't be updated via the regular endpoint
      delete doctorData.isVerified; // Already handled by the verify endpoint if changed
      delete doctorData._id; // Remove _id as it's not needed for update

      await axios.put(`/api/users/${editDoctor._id}`, doctorData);
      toast.success("Doctor updated successfully");
      fetchDoctors();
      setShowEditModal(false);
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update doctor");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleVerifyDoctor = async (doctorId, isVerified) => {
    try {
      await axios.patch(`/api/users/${doctorId}/verify`, { isVerified });
      toast.success(
        `Doctor ${isVerified ? "verified" : "unverified"} successfully`
      );
      fetchDoctors();
    } catch (error) {
      toast.error("Failed to update doctor verification status");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "64vh",
        }}
      >
        <div
          style={{
            borderTop: "4px solid #4A90E2",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            animation: "spin 1s linear infinite",
          }}
        ></div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          marginBottom: "20px",
          color: "#1E3A8A",
        }}
      >
        Manage Doctors
      </h2>

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div>
          <label style={{ color: "#4A90E2", fontWeight: "bold" }}>
            Filter by Specialty
          </label>
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #4A90E2",
            }}
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
          <label style={{ color: "#4A90E2", fontWeight: "bold" }}>
            Filter by Status
          </label>
          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #4A90E2",
            }}
          >
            <option value="all">All Doctors</option>
            <option value="verified">Verified Only</option>
            <option value="pending">Pending Verification</option>
          </select>
        </div>
      </div>

      {doctors.length > 0 ? (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "#ffffff",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#E5E7EB",
                color: "#374151",
                textAlign: "left",
              }}
            >
              <th style={{ padding: "12px" }}>Profile</th>
              <th style={{ padding: "12px" }}>Name</th>
              <th style={{ padding: "12px" }}>Email</th>
              <th style={{ padding: "12px" }}>Phone</th>
              <th style={{ padding: "12px" }}>Specialty</th>
              <th style={{ padding: "12px" }}>Status</th>
              <th style={{ padding: "12px", textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr
                key={doctor._id}
                style={{
                  borderBottom: "1px solid #E5E7EB",
                  backgroundColor: "#F9FAFB",
                }}
              >
                <td style={{ padding: "12px" }}>
                  <img
                    src={
                      doctor.profilePic
                        ? doctor.profilePic
                            .replace(
                              "drive.google.com/file/d/",
                              "drive.google.com/uc?id="
                            )
                            .replace("/view", "")
                        : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt="Doctor"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                    }}
                  />
                </td>
                <td style={{ padding: "12px" }}>
                  {doctor.fullName || "Not specified"}
                </td>
                <td style={{ padding: "12px" }}>{doctor.email}</td>
                <td style={{ padding: "12px" }}>{doctor.phone}</td>
                <td style={{ padding: "12px" }}>
                  {doctor.doctorSpecialty || "Not specified"}
                </td>
                <td style={{ padding: "12px" }}>
                  <span
                    style={{
                      color: doctor.isVerified ? "#22C55E" : "#F59E0B",
                      fontWeight: "bold",
                    }}
                  >
                    {doctor.isVerified ? "Verified" : "Pending Verification"}
                  </span>
                </td>
                <td style={{ padding: "12px", textAlign: "center" }}>
                  <button
                    onClick={() => handleEditClick(doctor)}
                    style={{ color: "#4A90E2", marginRight: "8px" }}
                    title="Edit doctor"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteClick(doctor)}
                    style={{ color: "#E11D48", marginRight: "8px" }}
                    title="Delete doctor"
                  >
                    🗑️
                  </button>
                  {doctor.isVerified ? (
                    <button
                      onClick={() => handleVerifyDoctor(doctor._id, false)}
                      style={{ color: "#F59E0B", marginRight: "8px" }}
                      title="Unverify doctor"
                    >
                      ⚠️
                    </button>
                  ) : (
                    <button
                      onClick={() => handleVerifyDoctor(doctor._id, true)}
                      style={{ color: "#22C55E", marginRight: "8px" }}
                      title="Verify doctor"
                    >
                      ✔️
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: "center", color: "#9CA3AF" }}>
          No doctors found matching your criteria
        </p>
      )}

      {showDeleteModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "20px",
              borderRadius: "8px",
              maxWidth: "400px",
              width: "100%",
            }}
          >
            <h3 style={{ marginBottom: "16px", color: "#1E3A8A" }}>
              Confirm Delete
            </h3>
            <p style={{ marginBottom: "16px", color: "#4B5563" }}>
              Are you sure you want to delete{" "}
              <strong>{doctorToDelete?.fullName}</strong>?
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
              }}
            >
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "4px",
                  border: "1px solid #D1D5DB",
                  backgroundColor: "#ffffff",
                  color: "#374151",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                style={{
                  padding: "8px 16px",
                  borderRadius: "4px",
                  backgroundColor: "#EF4444",
                  color: "#ffffff",
                  border: "none",
                  opacity: isDeleting ? 0.7 : 1,
                  cursor: isDeleting ? "not-allowed" : "pointer",
                }}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "20px",
              borderRadius: "8px",
              maxWidth: "500px",
              width: "100%",
            }}
          >
            <h3 style={{ marginBottom: "16px", color: "#1E3A8A" }}>
              Edit Doctor
            </h3>
            <form onSubmit={handleEditSubmit}>
              <div style={{ marginBottom: "12px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "4px",
                    color: "#4B5563",
                  }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={editDoctor.fullName}
                  onChange={handleEditChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #D1D5DB",
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "4px",
                    color: "#4B5563",
                  }}
                >
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={editDoctor.phone}
                  onChange={handleEditChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #D1D5DB",
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "4px",
                    color: "#4B5563",
                  }}
                >
                  Specialty
                </label>
                <input
                  type="text"
                  name="doctorSpecialty"
                  value={editDoctor.doctorSpecialty}
                  onChange={handleEditChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #D1D5DB",
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "4px",
                    color: "#4B5563",
                  }}
                >
                  Verification Status
                </label>
                <select
                  name="isVerified"
                  value={editDoctor.isVerified}
                  onChange={handleEditChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #D1D5DB",
                  }}
                >
                  <option value={true}>Verified</option>
                  <option value={false}>Pending Verification</option>
                </select>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "8px",
                  marginTop: "20px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "4px",
                    border: "1px solid #D1D5DB",
                    backgroundColor: "#ffffff",
                    color: "#374151",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "4px",
                    backgroundColor: "#4A90E2",
                    color: "#ffffff",
                    border: "none",
                    opacity: isUpdating ? 0.7 : 1,
                    cursor: isUpdating ? "not-allowed" : "pointer",
                  }}
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDoctors;
