import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { format } from "date-fns";

const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      let url = "/api/appointments";

      // Add status filter if selected
      if (statusFilter !== "all") {
        url += `?status=${statusFilter}`;
      }

      const response = await axios.get(url);
      setAppointments(response.data.appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await axios.put(`/api/appointments/${appointmentId}/status`, {
        status: newStatus,
      });

      toast.success(`Appointment ${newStatus} successfully`);
      fetchAppointments(); // Refresh the list
    } catch (error) {
      console.error("Error updating appointment status:", error);
      toast.error("Failed to update appointment status");
    }
  };

  const renderStatusBadge = (status) => {
    const statusClasses = {
      scheduled: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const renderAppointmentCard = (appointment) => {
    const appointmentDate = new Date(appointment.appointmentDate);
    const formattedDate = format(appointmentDate, "MMMM d, yyyy");

    // Format time (convert 24h to 12h format)
    const [hours, minutes] = appointment.appointmentTime.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    const formattedTime = `${hour12}:${minutes} ${ampm}`;

    return (
      <div key={appointment._id} className="card mb-4">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/4 mb-4 md:mb-0">
            {user.role === "patient" ? (
              // Show doctor info for patients
              <div className="text-center">
                <img
                  src={appointment.doctor.profilePic}
                  alt={`Dr. ${appointment.doctor.email}`}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-2"
                />
                <h4 className="font-medium">{appointment.doctor.email}</h4>
                <p className="text-sm text-gray-600">
                  {appointment.doctor.doctorSpecialty}
                </p>
              </div>
            ) : (
              // Show patient info for doctors
              <div className="text-center">
                <img
                  src={appointment.patient.profilePic}
                  alt={appointment.patient.email}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-2"
                />
                <h4 className="font-medium">{appointment.patient.email}</h4>
                <p className="text-sm text-gray-600">
                  {appointment.patient.phone}
                </p>
              </div>
            )}
          </div>

          <div className="md:w-3/4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-xl font-semibold">
                  Appointment on {formattedDate}
                </h3>
                <p className="text-gray-600">Time: {formattedTime}</p>
              </div>
              <div>{renderStatusBadge(appointment.status)}</div>
            </div>

            <div className="mb-3">
              <h4 className="font-medium">Reason:</h4>
              <p>{appointment.reason}</p>
            </div>

            {appointment.notes && (
              <div className="mb-3">
                <h4 className="font-medium">Notes:</h4>
                <p>{appointment.notes}</p>
              </div>
            )}

            {/* Actions based on role and appointment status */}
            {appointment.status === "scheduled" && (
              <div className="mt-4">
                {user.role === "patient" && (
                  <button
                    onClick={() =>
                      handleStatusChange(appointment._id, "cancelled")
                    }
                    className="btn btn-danger"
                  >
                    Cancel Appointment
                  </button>
                )}

                {user.role === "doctor" && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        handleStatusChange(appointment._id, "completed")
                      }
                      className="btn btn-success"
                    >
                      Mark as Completed
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(appointment._id, "cancelled")
                      }
                      className="btn btn-danger"
                    >
                      Cancel Appointment
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Appointments</h1>

      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Filter by Status</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="form-input"
        >
          <option value="all">All Appointments</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : appointments.length > 0 ? (
        <div>
          <p className="mb-4">Showing {appointments.length} appointment(s)</p>
          {appointments.map(renderAppointmentCard)}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-xl text-gray-600">
            No appointments found matching your criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default Appointments;
