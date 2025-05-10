import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const WritePrescription = ({ appointment, onSuccess, onClose }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState({
    medications: [
      { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
    ],
    additionalNotes: "",
  });

  const handleAddMedication = () => {
    setPrescriptionData((prev) => ({
      ...prev,
      medications: [
        ...prev.medications,
        { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
      ],
    }));
  };

  const handleRemoveMedication = (index) => {
    setPrescriptionData((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }));
  };

  const handleMedicationChange = (index, field, value) => {
    setPrescriptionData((prev) => {
      const updatedMedications = [...prev.medications];
      updatedMedications[index] = {
        ...updatedMedications[index],
        [field]: value,
      };
      return { ...prev, medications: updatedMedications };
    });
  };

  const handleNotesChange = (e) => {
    setPrescriptionData((prev) => ({
      ...prev,
      additionalNotes: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate prescription data
      const isValid = prescriptionData.medications.every(
        (med) => med.name && med.dosage && med.frequency && med.duration
      );

      if (!isValid) {
        toast.error("Please fill in all required medication fields");
        return;
      }

      setLoading(true);
      // Submit prescription
      await axios.post("/api/prescriptions", {
        appointmentId: appointment._id,
        medications: prescriptionData.medications,
        additionalNotes: prescriptionData.additionalNotes,
        userId: user.id,
        userRole: user.role,
      });

      toast.success("Prescription created successfully");
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating prescription:", error);
      toast.error(
        error.response?.data?.message || "Failed to create prescription"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-auto bg-black bg-opacity-50 pt-16">
      <div className="relative w-full max-w-2xl p-6 mx-4 bg-white rounded-lg shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-xl font-semibold mb-4">
          Write Prescription for{" "}
          {appointment.patient?.fullName || appointment.patient?.email}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Medications</h3>
            <div className="space-y-4">
              {prescriptionData.medications.map((medication, index) => (
                <div key={index} className="p-4 border rounded-md bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Medication Name*
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        value={medication.name}
                        onChange={(e) =>
                          handleMedicationChange(index, "name", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dosage*
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        placeholder="e.g., 500mg"
                        value={medication.dosage}
                        onChange={(e) =>
                          handleMedicationChange(
                            index,
                            "dosage",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Frequency*
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        placeholder="e.g., Twice daily"
                        value={medication.frequency}
                        onChange={(e) =>
                          handleMedicationChange(
                            index,
                            "frequency",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration*
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        placeholder="e.g., 7 days"
                        value={medication.duration}
                        onChange={(e) =>
                          handleMedicationChange(
                            index,
                            "duration",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Special Instructions
                      </label>
                      <textarea
                        className="w-full p-2 border rounded-md"
                        placeholder="e.g., Take with food"
                        value={medication.instructions}
                        onChange={(e) =>
                          handleMedicationChange(
                            index,
                            "instructions",
                            e.target.value
                          )
                        }
                        rows="2"
                      ></textarea>
                    </div>
                  </div>

                  {prescriptionData.medications.length > 1 && (
                    <button
                      type="button"
                      className="mt-3 text-red-600 hover:text-red-800"
                      onClick={() => handleRemoveMedication(index)}
                    >
                      Remove Medication
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 font-medium"
                onClick={handleAddMedication}
              >
                + Add Another Medication
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              className="w-full p-2 border rounded-md"
              rows="4"
              placeholder="Any additional instructions or notes for the patient"
              value={prescriptionData.additionalNotes}
              onChange={handleNotesChange}
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Prescription"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WritePrescription;
