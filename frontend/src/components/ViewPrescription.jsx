import React from "react";
import { format } from "date-fns";

const ViewPrescription = ({ prescription, onClose }) => {
  if (!prescription) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "MMMM d, yyyy");
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-auto bg-black bg-opacity-50 pt-16">
      <div className="relative w-full max-w-2xl p-6 mx-4 bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
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

        <div className="prescription-details">
          <h2 className="text-xl font-semibold mb-4">Prescription Details</h2>

          <div className="bg-blue-50 p-4 rounded-md mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Doctor</p>
                <p className="font-medium">
                  {prescription.doctor?.fullName || prescription.doctor?.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Issued Date</p>
                <p className="font-medium">
                  {formatDate(prescription.createdAt)}
                </p>
              </div>
              {prescription.appointment && (
                <div>
                  <p className="text-sm text-gray-600">Appointment Date</p>
                  <p className="font-medium">
                    {formatDate(prescription.appointment.appointmentDate)}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Patient</p>
                <p className="font-medium">
                  {prescription.patient?.fullName ||
                    prescription.patient?.email}
                </p>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-medium mb-3">Medications</h3>
          <div className="space-y-4 mb-6">
            {prescription.medications.map((medication, index) => (
              <div key={index} className="p-4 border rounded-md bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-lg">{medication.name}</h4>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {medication.duration}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                  <div>
                    <p className="text-sm text-gray-600">Dosage</p>
                    <p>{medication.dosage}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Frequency</p>
                    <p>{medication.frequency}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p>{medication.duration}</p>
                  </div>
                </div>

                {medication.instructions && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600">
                      Special Instructions
                    </p>
                    <p className="text-gray-800">{medication.instructions}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {prescription.additionalNotes && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Additional Notes</h3>
              <div className="p-4 border rounded-md bg-gray-50">
                <p className="whitespace-pre-line">
                  {prescription.additionalNotes}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPrescription;
