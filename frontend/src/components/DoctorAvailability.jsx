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
      if (!user || !user.id) {
        toast.error("User information not available");
        setLoading(false);
        return;
      }

      const response = await axios.get(`/api/users/${user.id}`);
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
    if (!newSlot.date || !newSlot.startTime || !newSlot.endTime) {
      toast.error("Please fill all fields");
      return;
    }

    if (newSlot.startTime >= newSlot.endTime) {
      toast.error("End time must be after start time");
      return;
    }

    try {
      // Format date to YYYY-MM-DD
      const formattedSlot = {
        ...newSlot,
        date: new Date(newSlot.date).toISOString().split("T")[0],
        isBooked: false,
      };

      await axios.post("/api/appointments/availability", {
        doctorId: user.id,
        availabilitySlots: [formattedSlot],
      });

      toast.success("Availability slot added successfully");
      setNewSlot({ date: "", startTime: "", endTime: "" });
      fetchAvailability();
    } catch (error) {
      console.error("Error adding availability slot:", error);
      toast.error(
        error.response?.data?.message || "Failed to add availability slot"
      );
    }
  };

  const handleRemoveSlot = async (slotId) => {
    try {
      await axios.delete(`/api/appointments/availability/${slotId}`, {
        data: { doctorId: user.id },
      });
      toast.success("Availability slot removed successfully");
      fetchAvailability();
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
    <div className="availability-container">
      <h2>Manage Your Availability</h2>

      <div className="card">
        <h3>Add New Availability Slot</h3>
        <form onSubmit={handleAddSlot} className="availability-form">
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={newSlot.date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Start Time</label>
            <input
              type="time"
              name="startTime"
              value={newSlot.startTime}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>End Time</label>
            <input
              type="time"
              name="endTime"
              value={newSlot.endTime}
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit" className="btn">
            Add Slot
          </button>
        </form>
      </div>

      <div className="card">
        <h3>Your Current Availability</h3>
        {loading ? (
          <p>Loading...</p>
        ) : availabilitySlots.length > 0 ? (
          <table className="availability-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {availabilitySlots.map((slot) => (
                <tr key={slot._id}>
                  <td>{formatDate(slot.date)}</td>
                  <td>
                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                  </td>
                  <td>
                    <span
                      className={
                        slot.isBooked ? "status booked" : "status available"
                      }
                    >
                      {slot.isBooked ? "Booked" : "Available"}
                    </span>
                  </td>
                  <td>
                    {!slot.isBooked && (
                      <button
                        onClick={() => handleRemoveSlot(slot._id)}
                        className="remove-btn"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No availability slots added.</p>
        )}
      </div>

      {/* Inline CSS to merge styling in the same file */}
      <style>{`
        .availability-container {
          background-color: #eff1dc;
          padding: 20px;
          border-radius: 10px;
        }

        .card {
          background-color: #d2dedc;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 20px;
        }

        h2, h3 {
          color: #333;
        }

        .availability-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        input {
          background-color: #d9dfcf;
          border: none;
          padding: 8px;
          border-radius: 5px;
        }

        .btn {
          background-color: #4A90E2;
          color: white;
          padding: 10px 15px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.3s ease;
        }

        .btn:hover {
          background-color: #3A7BC8;
        }

        .availability-table {
          width: 100%;
          border-collapse: collapse;
        }

        .availability-table th, .availability-table td {
          padding: 10px;
          border-bottom: 1px solid #ccc;
        }

        .status {
          padding: 5px;
          border-radius: 5px;
          font-weight: bold;
        }

        .status.available {
          background-color: #b6e2a1;
        }

        .status.booked {
          background-color: #f8a5a5;
        }

        .remove-btn {
          background-color: red;
          color: white;
          border: none;
          padding: 5px;
          border-radius: 5px;
          cursor: pointer;
        }

        .remove-btn:hover {
          background-color: darkred;
        }
      `}</style>
    </div>
  );
};

export default DoctorAvailability;
