import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { format } from "date-fns";
import PatientHistory from "../pages/PatientHistory";

const BookAppointment = ({ doctorId, onSuccess }) => {
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [appointmentData, setAppointmentData] = useState({
    reason: "",
    notes: "",
  });
  const [showPatientHistory, setShowPatientHistory] = useState(false);

  const handleClose = () => {
    setSelectedDate("");
    setSelectedTime("");
    setAppointmentData({
      reason: "",
      notes: "",
    });
    if (onSuccess) {
      onSuccess(false); // Pass false to indicate this is just a close action
    }
  };

  useEffect(() => {
    if (doctorId) {
      fetchDoctorDetails();
    }
  }, [doctorId]);

  useEffect(() => {
    if (selectedDate) {
      filterAvailableTimeSlots();
    }
  }, [selectedDate]);

  const fetchDoctorDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/users/${doctorId}`);
      setDoctor(response.data.user);

      // Group availability by date
      const slots = response.data.user.availability || [];

      // Filter out past dates and booked slots
      const today = new Date().toISOString().split("T")[0];
      const availableSlots = slots.filter(
        (slot) => slot.date >= today && !slot.isBooked
      );

      setAvailableSlots(availableSlots);

      // Get unique dates
      const uniqueDates = [
        ...new Set(availableSlots.map((slot) => slot.date)),
      ].sort();

      if (uniqueDates.length > 0 && !selectedDate) {
        setSelectedDate(uniqueDates[0]);
      }
    } catch (error) {
      console.error("Error fetching doctor details:", error);
      toast.error("Failed to load doctor details");
    } finally {
      setLoading(false);
    }
  };

  const filterAvailableTimeSlots = () => {
    if (!selectedDate || !availableSlots.length) return [];

    return availableSlots.filter((slot) => slot.date === selectedDate);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime) {
      toast.error("Please select a date and time for your appointment");
      return;
    }

    if (!appointmentData.reason.trim()) {
      toast.error("Please provide a reason for your appointment");
      return;
    }

    try {
      const response = await axios.post("/api/appointments", {
        doctorId,
        patientId: user.id,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        reason: appointmentData.reason,
        notes: appointmentData.notes,
      });

      toast.success("Appointment booked successfully");

      // Reset form
      setSelectedDate("");
      setSelectedTime("");
      setAppointmentData({
        reason: "",
        notes: "",
      });

      if (onSuccess) {
        onSuccess(true); // Pass true to indicate this is a successful booking
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error(
        error.response?.data?.message || "Failed to book appointment"
      );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "MMMM d, yyyy");
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="text-center py-8">
        <p className="text-xl text-gray-600">Doctor not found</p>
      </div>
    );
  }

  const availableDates = [
    ...new Set(availableSlots.map((slot) => slot.date)),
  ].sort();

  const availableTimesForSelectedDate = availableSlots
    .filter((slot) => slot.date === selectedDate)
    .sort((a, b) => (a.startTime > b.startTime ? 1 : -1));

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-auto bg-black bg-opacity-50 pt-16">
      <div className="relative w-full max-w-2xl p-6 mx-4 mt-12 bg-white rounded-lg shadow-lg">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none z-[60]"
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

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">
            Book an Appointment with {doctor.email}
          </h2>

          <div className="mb-6">
            <div className="flex items-center mb-2">
              <img
                src={doctor.profilePic}
                alt={doctor.email}
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <div>
                <h3 className="font-medium">{doctor.email}</h3>
                <p className="text-sm text-gray-600">
                  {doctor.doctorSpecialty}
                </p>
                <p className="text-sm text-gray-600">
                  NMC Number: {doctor.nmcNumber || "Not available"}
                </p>
              </div>
            </div>

            {user.role === "doctor" && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setShowPatientHistory(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  View Patient Medical History
                </button>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Date Selection */}
            <div>
              <label className="block text-gray-700 mb-2">Select Date</label>
              {availableDates.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {availableDates.map((date) => (
                    <button
                      key={date}
                      type="button"
                      className={`p-2 border rounded-md text-center ${
                        selectedDate === date
                          ? "bg-blue-500 text-white"
                          : "bg-white hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedTime(""); // Reset time when date changes
                      }}
                    >
                      {formatDate(date)}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-red-500">
                  No available dates found for this doctor
                </p>
              )}
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div>
                <label className="block text-gray-700 mb-2">Select Time</label>
                {availableTimesForSelectedDate.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {availableTimesForSelectedDate.map((slot) => (
                      <button
                        key={`${slot.date}-${slot.startTime}`}
                        type="button"
                        className={`p-2 border rounded-md text-center ${
                          selectedTime === slot.startTime
                            ? "bg-blue-500 text-white"
                            : "bg-white hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedTime(slot.startTime)}
                      >
                        {formatTime(slot.startTime)}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-red-500">
                    No available time slots for the selected date
                  </p>
                )}
              </div>
            )}

            {/* Appointment Details */}
            <div>
              <label className="block text-gray-700 mb-2">
                Reason for Appointment *
              </label>
              <input
                type="text"
                name="reason"
                value={appointmentData.reason}
                onChange={handleInputChange}
                className="form-input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={appointmentData.notes}
                onChange={handleInputChange}
                className="form-input w-full h-24"
                placeholder="Any additional information you'd like to share with the doctor"
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={
                  !selectedDate || !selectedTime || !appointmentData.reason
                }
              >
                Book Appointment
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Patient History Modal */}
      {showPatientHistory && user.role === "doctor" && (
        <PatientHistory
          patientId={user.id}
          onClose={() => setShowPatientHistory(false)}
        />
      )}
    </div>
  );
};

export default BookAppointment;
