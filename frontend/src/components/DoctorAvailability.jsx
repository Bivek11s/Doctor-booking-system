import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { format } from "date-fns";

const DoctorAvailability = () => {
  const { user } = useAuth();
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSlot, setNewSlot] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    if (user?.role === "doctor") {
      fetchAvailability();
    }
  }, [user]);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/users/me");
      setAvailabilitySlots(response.data.user.availability || []);
    } catch (error) {
      console.error("Error fetching availability:", error);
      toast.error("Failed to load availability slots");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSlot((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!newSlot.date || !newSlot.startTime || !newSlot.endTime) {
      toast.error("Please fill all fields");
      return;
    }

    // Validate time range
    if (newSlot.startTime >= newSlot.endTime) {
      toast.error("End time must be after start time");
      return;
    }

    try {
      const response = await axios.post("/api/appointments/availability", {
        availabilitySlots: [{ ...newSlot, isBooked: false }],
      });

      toast.success("Availability slot added successfully");
      setNewSlot({ date: "", startTime: "", endTime: "" });
      fetchAvailability(); // Refresh the list
    } catch (error) {
      console.error("Error adding availability slot:", error);
      toast.error(
        error.response?.data?.message || "Failed to add availability slot"
      );
    }
  };

  const handleRemoveSlot = async (slotId) => {
    try {
      await axios.delete(`/api/appointments/availability/${slotId}`);
      toast.success("Availability slot removed successfully");
      fetchAvailability(); // Refresh the list
    } catch (error) {
      console.error("Error removing availability slot:", error);
      toast.error("Failed to remove availability slot");
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

  if (user?.role !== "doctor") {
    return (
      <div className="text-center py-8">
        <p className="text-xl text-gray-600">
          Only doctors can manage availability
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Manage Your Availability</h2>

      {/* Add new availability slot form */}
      <div className="card">
        <h3 className="text-lg font-medium mb-4">Add New Availability Slot</h3>
        <form onSubmit={handleAddSlot} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={newSlot.date}
                onChange={handleInputChange}
                className="form-input w-full"
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={newSlot.startTime}
                onChange={handleInputChange}
                className="form-input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">End Time</label>
              <input
                type="time"
                name="endTime"
                value={newSlot.endTime}
                onChange={handleInputChange}
                className="form-input w-full"
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary">
              Add Slot
            </button>
          </div>
        </form>
      </div>

      {/* Current availability slots */}
      <div className="card">
        <h3 className="text-lg font-medium mb-4">Your Current Availability</h3>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : availabilitySlots.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time Slot
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {availabilitySlots.map((slot) => (
                  <tr key={slot._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(slot.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          slot.isBooked
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {slot.isBooked ? "Booked" : "Available"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {!slot.isBooked && (
                        <button
                          onClick={() => handleRemoveSlot(slot._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center py-4 text-gray-500">
            You haven't added any availability slots yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default DoctorAvailability;
