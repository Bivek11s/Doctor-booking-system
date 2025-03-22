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

      // Add specialty filter if selected
      if (specialty) {
        url += `&specialty=${specialty}`;
      }

      // Add verification filter if selected
      if (verificationFilter !== "all") {
        url += `&isVerified=${verificationFilter === "verified"}`;
      }

      const response = await axios.get(url);
      setDoctors(response.data.users);

      // Extract unique specialties for filter dropdown
      if (!specialty) {
        const uniqueSpecialties = [
          ...new Set(
            response.data.users
              .map((doctor) => doctor.doctorSpecialty)
              .filter((specialty) => specialty)
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

  const handleDeleteClick = (doctor) => {
    setDoctorToDelete(doctor);
    setShowDeleteModal(true);
  };

  const handleEditClick = (doctor) => {
    // Format date to YYYY-MM-DD for input type="date"
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
      console.error("Error deleting doctor:", error);
      toast.error(error.response?.data?.message || "Failed to delete doctor");
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
      console.error("Error updating doctor:", error);
      toast.error(error.response?.data?.message || "Failed to update doctor");
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
      fetchDoctors(); // Refresh the list
    } catch (error) {
      console.error("Error verifying doctor:", error);
      toast.error("Failed to update doctor verification status");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manage Doctors</h2>

      <div className="mb-6 flex flex-col md:flex-row md:items-center md:space-x-4">
        <div className="mb-4 md:mb-0">
          <label className="block text-gray-700 mb-2">
            Filter by Specialty
          </label>
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="form-input"
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
          <label className="block text-gray-700 mb-2">Filter by Status</label>
          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="form-input"
          >
            <option value="all">All Doctors</option>
            <option value="verified">Verified Only</option>
            <option value="pending">Pending Verification</option>
          </select>
        </div>
      </div>

      {doctors.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Profile</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Phone</th>
                <th className="py-3 px-6 text-left">Specialty</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {doctors.map((doctor) => (
                <tr
                  key={doctor._id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={doctor.profilePic}
                        alt={`Dr. ${doctor.email}`}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="py-3 px-6 text-left">{doctor.email}</td>
                  <td className="py-3 px-6 text-left">{doctor.phone}</td>
                  <td className="py-3 px-6 text-left">
                    {doctor.doctorSpecialty || "Not specified"}
                  </td>
                  <td className="py-3 px-6 text-left">
                    <span
                      className={`badge ${
                        doctor.isVerified ? "badge-success" : "badge-warning"
                      }`}
                    >
                      {doctor.isVerified ? "Verified" : "Pending Verification"}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center">
                      <button
                        onClick={() => handleEditClick(doctor)}
                        className="transform hover:text-blue-500 hover:scale-110 transition-all duration-150 mr-3"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(doctor)}
                        className="transform hover:text-red-500 hover:scale-110 transition-all duration-150 mr-3"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                      {!doctor.isVerified && (
                        <>
                          <button
                            onClick={() => handleVerifyDoctor(doctor._id, true)}
                            className="transform hover:text-green-500 hover:scale-110 transition-all duration-150 mr-3"
                            title="Approve Doctor"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() =>
                              handleVerifyDoctor(doctor._id, false)
                            }
                            className="transform hover:text-red-500 hover:scale-110 transition-all duration-150"
                            title="Reject Doctor"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-4 text-gray-600">
          No doctors found matching your criteria
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete the doctor{" "}
              <span className="font-semibold">{doctorToDelete.email}</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button onClick={handleDeleteConfirm} className="btn btn-danger">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Doctor Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Edit Doctor</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={editDoctor.phone}
                  onChange={handleEditChange}
                  className="form-input"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Gender</label>
                <select
                  name="gender"
                  value={editDoctor.gender}
                  onChange={handleEditChange}
                  className="form-input"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={editDoctor.dateOfBirth}
                  onChange={handleEditChange}
                  className="form-input"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Specialty</label>
                <input
                  type="text"
                  name="doctorSpecialty"
                  value={editDoctor.doctorSpecialty}
                  onChange={handleEditChange}
                  className="form-input"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
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
