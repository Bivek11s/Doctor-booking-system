import React, { useState } from "react";

const AppointmentManagement = () => {
  const [selectedAppointment, setSelectedAppointment] = useState("Doctor Visit");
  const [newDateTime, setNewDateTime] = useState("");

  const handleReschedule = () => {
    alert(`Rescheduled ${selectedAppointment} to ${newDateTime}`);
  };

  const handleCancel = () => {
    alert(`Canceled ${selectedAppointment}`);
  };

  return (
    <div>
      <header>
        <h1>Appointment Management</h1>
        <nav>
          <a href="#">Home</a>
          <a href="#">Appointments</a>
          <a href="#">Profile</a>
        </nav>
      </header>

      <section>
        <h2>Reschedule/Cancel Appointments</h2>
        <p>Manage your appointments easily</p>

        <div>
          <h3>Reschedule Appointment</h3>
          <label>Select Appointment</label>
          <select
            value={selectedAppointment}
            onChange={(e) => setSelectedAppointment(e.target.value)}
          >
            <option>Doctor Visit</option>
            <option>Dental Checkup</option>
          </select>

          <label>New Date & Time</label>
          <input
            type="text"
            placeholder="Enter new date & time"
            value={newDateTime}
            onChange={(e) => setNewDateTime(e.target.value)}
          />
          <button onClick={handleReschedule}>Submit</button>
        </div>

        <div>
          <h3>Upcoming Appointments</h3>
          <button onClick={handleCancel}>Cancel Appointment</button>
          <ul>
            <li>
              <span>Doctor Visit - Dr. Smith</span>
              <span>Monday, 10 AM</span>
            </li>
            <li>
              <span>Dental Checkup - Dr. White</span>
              <span>Friday, 3 PM</span>
            </li>
          </ul>
        </div>
      </section>

      <footer>
        <p>Copyright © 2022 Appointment Manager - All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default AppointmentManagement;
