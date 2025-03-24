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
      if (statusFilter !== "all") url += `?status=${statusFilter}`;
      const response = await axios.get(url);
      setAppointments(response.data.appointments);
    } catch (error) {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await axios.put(`/api/appointments/${appointmentId}/status`, { status: newStatus });
      toast.success(`Appointment ${newStatus} successfully`);
      fetchAppointments();
    } catch (error) {
      toast.error("Failed to update appointment status");
    }
  };

  const renderStatusBadge = (status) => {
    const statusColors = {
      scheduled: { background: "#B3B3E6", color: "#4A4A7D" },
      completed: { background: "#E6F2E6", color: "#2D6A2E" },
      cancelled: { background: "#F9B3B3", color: "#8B0000" },
    };

    return (
      <span style={{ 
        padding: "6px 12px", 
        borderRadius: "10px", 
        fontSize: "12px", 
        fontWeight: "bold",
        backgroundColor: statusColors[status].background, 
        color: statusColors[status].color 
      }}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const renderAppointmentCard = (appointment) => {
    const appointmentDate = new Date(appointment.appointmentDate);
    const formattedDate = format(appointmentDate, "MMMM d, yyyy");

    const [hours, minutes] = appointment.appointmentTime.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    const formattedTime = `${hour12}:${minutes} ${ampm}`;

    return (
      <div key={appointment._id} style={{ 
        backgroundColor: "#E6F2E6", 
        padding: "20px", 
        borderRadius: "10px", 
        marginBottom: "20px", 
        boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)" 
      }}>
        <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
          <div style={{ textAlign: "center" }}>
            <img
              src={user.role === "patient" ? appointment.doctor.profilePic : appointment.patient.profilePic}
              alt="Profile"
              style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }}
            />
            <h4 style={{ fontWeight: "bold", marginTop: "10px" }}>
              {user.role === "patient" ? appointment.doctor.email : appointment.patient.email}
            </h4>
            <p style={{ fontSize: "14px", color: "#666" }}>
              {user.role === "patient" ? appointment.doctor.doctorSpecialty : appointment.patient.phone}
            </p>
          </div>

          <div style={{ flexGrow: "1" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <h3 style={{ fontSize: "20px", fontWeight: "bold" }}>Appointment on {formattedDate}</h3>
              {renderStatusBadge(appointment.status)}
            </div>
            <p style={{ marginBottom: "10px" }}>Time: {formattedTime}</p>
            <p style={{ fontWeight: "bold" }}>Reason:</p>
            <p style={{ marginBottom: "10px" }}>{appointment.reason}</p>
            {appointment.notes && (
              <>
                <p style={{ fontWeight: "bold" }}>Notes:</p>
                <p>{appointment.notes}</p>
              </>
            )}

            {appointment.status === "scheduled" && (
              <div style={{ marginTop: "10px" }}>
                {user.role === "patient" && (
                  <button 
                    onClick={() => handleStatusChange(appointment._id, "cancelled")} 
                    style={{ backgroundColor: "#F9B3B3", color: "#fff", padding: "10px 15px", borderRadius: "5px", border: "none", cursor: "pointer" }}>
                    Cancel Appointment
                  </button>
                )}

                {user.role === "doctor" && (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button 
                      onClick={() => handleStatusChange(appointment._id, "completed")} 
                      style={{ backgroundColor: "#B3B3E6", color: "#fff", padding: "10px 15px", borderRadius: "5px", border: "none", cursor: "pointer" }}>
                      Mark as Completed
                    </button>
                    <button 
                      onClick={() => handleStatusChange(appointment._id, "cancelled")} 
                      style={{ backgroundColor: "#F9B3B3", color: "#fff", padding: "10px 15px", borderRadius: "5px", border: "none", cursor: "pointer" }}>
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
    <div style={{ backgroundColor: "#D8E6EC", minHeight: "100vh", padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px", color: "#4A4A7D" }}>My Appointments</h1>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>Filter by Status</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: "10px", width: "100%", borderRadius: "5px", border: "1px solid #B3B3E6" }}>
          <option value="all">All Appointments</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "64px" }}>
          <div style={{ border: "4px solid #B3B3E6", borderRadius: "50%", width: "50px", height: "50px", animation: "spin 1s linear infinite" }}></div>
        </div>
      ) : appointments.length > 0 ? (
        <div>{appointments.map(renderAppointmentCard)}</div>
      ) : (
        <p style={{ textAlign: "center", color: "#666", padding: "10px 0" }}>No appointments found</p>
      )}
    </div>
  );
};

export default Appointments;
