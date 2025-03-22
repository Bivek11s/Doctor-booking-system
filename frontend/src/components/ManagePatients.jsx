import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ManagePatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPatient, setEditPatient] = useState({
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/users?role=patient");
      setPatients(response.data.users);
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast.error("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (patient) => {
    setPatientToDelete(patient);
    setShowDeleteModal(true);
  };

  const handleEditClick = (patient) => {
    // Format date to YYYY-MM-DD for input type="date"
    const formattedDate = patient.dateOfBirth
      ? new Date(patient.dateOfBirth).toISOString().split("T")[0]
      : "";

    setEditPatient({
      ...patient,
      dateOfBirth: formattedDate,
    });
    setShowEditModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/users/${patientToDelete._id}`);
      toast.success("Patient deleted successfully");
      fetchPatients();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting patient:", error);
      toast.error(error.response?.data?.message || "Failed to delete patient");
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditPatient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/users/${editPatient._id}`, editPatient);
      toast.success("Patient updated successfully");
      fetchPatients();
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating patient:", error);
      toast.error(error.response?.data?.message || "Failed to update patient");
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
      <h2 className="text-xl font-semibold mb-4">Manage Patients</h2>

      {patients.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Profile</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Phone</th>
                <th className="py-3 px-6 text-left">Gender</th>
                <th className="py-3 px-6 text-left">Date of Birth</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {patients.map((patient) => (
                <tr
                  key={patient._id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={patient.profilePic}
                        alt={patient.email}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="py-3 px-6 text-left">{patient.email}</td>
                  <td className="py-3 px-6 text-left">{patient.phone}</td>
                  <td className="py-3 px-6 text-left">{patient.gender}</td>
                  <td className="py-3 px-6 text-left">
                    {new Date(patient.dateOfBirth).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center">
                      <button
                        onClick={() => handleEditClick(patient)}
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
                        onClick={() => handleDeleteClick(patient)}
                        className="transform hover:text-red-500 hover:scale-110 transition-all duration-150"
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-4 text-gray-600">No patients found</div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete the patient{" "}
              <span className="font-semibold">{patientToDelete.email}</span>?
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

      {/* Edit Patient Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Edit Patient</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editPatient.email}
                  className="form-input"
                  disabled
                />
                <p className="text-sm text-gray-500 mt-1">
                  Email cannot be changed
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={editPatient.phone}
                  onChange={handleEditChange}
                  className="form-input"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Gender</label>
                <select
                  name="gender"
                  value={editPatient.gender}
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
                  value={editPatient.dateOfBirth}
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

export default ManagePatients;
