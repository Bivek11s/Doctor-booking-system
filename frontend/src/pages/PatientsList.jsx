import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";

const PatientsList = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only doctors and admins should access this page
    if (user?.role !== "doctor" && user?.role !== "admin") {
      return;
    }

    fetchPatients();
  }, [user]);

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

  const renderPatientCard = (patient) => (
    <div key={patient._id} className="card mb-4">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/4 mb-4 md:mb-0">
          <img
            src={patient.profilePic}
            alt={patient.email}
            className="w-24 h-24 rounded-full object-cover mx-auto"
          />
        </div>

        <div className="md:w-3/4">
          <h3 className="text-xl font-semibold">{patient.email}</h3>
          <p className="text-gray-600 mb-2">Phone: {patient.phone}</p>

          <div className="mb-2">
            <span className="font-medium">Gender:</span> {patient.gender}
          </div>

          <div className="mb-2">
            <span className="font-medium">Date of Birth:</span>{" "}
            {new Date(patient.dateOfBirth).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Patients Directory</h1>

      {patients.length > 0 ? (
        <div>
          <p className="mb-4">Showing {patients.length} patient(s)</p>
          {patients.map(renderPatientCard)}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-xl text-gray-600">No patients found</p>
        </div>
      )}
    </div>
  );
};

export default PatientsList;
