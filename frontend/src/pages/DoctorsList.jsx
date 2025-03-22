import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";

const DoctorsList = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const renderDoctorCard = (doctor) => (
    <div key={doctor._id} className="card mb-4">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/4 mb-4 md:mb-0">
          <img
            src={doctor.profilePic}
            alt={`Dr. ${doctor.email}`}
            className="w-32 h-32 rounded-full object-cover mx-auto"
          />
        </div>

        <div className="md:w-3/4">
          <h3 className="text-xl font-semibold">{doctor.email}</h3>
          <p className="text-gray-600 mb-2">Phone: {doctor.phone}</p>

          <div className="mb-2">
            <span className="font-medium">Specialty:</span>{" "}
            {doctor.doctorSpecialty || "Not specified"}
          </div>

          <div className="mb-2">
            <span className="font-medium">Status:</span>
            <span
              className={`ml-2 badge ${
                doctor.isVerified ? "badge-success" : "badge-warning"
              }`}
            >
              {doctor.isVerified ? "Verified" : "Pending Verification"}
            </span>
          </div>

          {doctor.qualificationProof && (
            <div className="mb-4">
              <a
                href={doctor.qualificationProof}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Qualification Document
              </a>
            </div>
          )}

          {/* Admin actions for doctor verification */}
          {user?.role === "admin" && !doctor.isVerified && (
            <div className="flex space-x-2 mt-2">
              <button
                onClick={() => handleVerifyDoctor(doctor._id, true)}
                className="btn btn-primary"
              >
                Approve
              </button>
              <button
                onClick={() => handleVerifyDoctor(doctor._id, false)}
                className="btn btn-danger"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Doctors Directory</h1>

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

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : doctors.length > 0 ? (
        <div>
          <p className="mb-4">Showing {doctors.length} doctor(s)</p>
          {doctors.map(renderDoctorCard)}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-xl text-gray-600">
            No doctors found matching your criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default DoctorsList;
