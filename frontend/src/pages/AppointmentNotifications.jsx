import React from "react";

const AppointmentNotifications = () => {
  const navbarStyle = {
    width: "1400px",
    height: "50px",
    backgroundColor: "#0288D1",
    color: "white",
    padding: "5px 15px",
    display: "flex",
    justifyContent: "center", 
    alignItems: "center",
    fontSize: "18px",
    fontWeight: "bold",
    borderBottom: "1px solid #025a9b",
    marginBottom: "20px",
    position: "fixed", 
  };
  

  const linkContainerStyle = {
    position: "absolute",
    right: "15px",
    display: "flex",
  };

  const linkStyle = {
    color: "white",
    marginLeft: "15px",
    textDecoration: "none",
    fontSize: "16px",
  };

  const containerStyle = {
    fontFamily: "Arial, sans-serif",
    margin: "0 auto",
    width: "1350px",
    padding: "40px",
    color: "#000",
    background: 'url("https://i.pinimg.com/736x/36/42/29/3642291603d80cbf90ee7421ba227a8b.jpg") no-repeat center center/cover',
    
  };

  const profileStyle = {
    backgroundColor: "#faf8ff",
    padding: "20px",
    borderRadius: "5px",
    marginBottom: "50px", 
    maxWidth: "800px",
    margin: "0 auto",
    color: "#000",
  };
  
  const sectionStyle = {
    backgroundColor: "#faf8ff",
    padding: "20px",
    borderRadius: "5px",
    marginBottom: "50px", 
    maxWidth: "800px",
    margin: "0 auto",
    color: "#000",
  };
  

  const buttonStyle = {
    background: "#0288D1",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
  };

  const toggleOptionStyle = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    color: "#000",
  };

  const appointmentListStyle = {
    listStyleType: "none",
    padding: "0",
    color: "#000",
  };

  return (
    <div>
      {/* Navigation Bar */}
      <div style={navbarStyle}>
        <span>Appointment Notifications</span>
        <div style={linkContainerStyle}>
          <a href="#home" style={linkStyle}>Home</a>
          <a href="#settings" style={linkStyle}>Settings</a>
        </div>
      </div>

      {/* Main Content */}
      <div style={containerStyle}>
        {/* Profile Section */}
        <div style={profileStyle}>
          <h2>Profile</h2>
          <p>Name: [User Name]</p>
          <p>Email: [User Email]</p>
          <button style={buttonStyle}>Edit Profile</button>
          <p>Manage your appointments with ease!</p>
        </div>

        {/* Email Notification Settings */}
        <div style={sectionStyle}>
          <h2>Email Notification Settings</h2>
          <div style={toggleOptionStyle}>
            <span>New Booking Notifications</span>
            <input type="checkbox" defaultChecked />
          </div>
          <div style={toggleOptionStyle}>
            <span>Rescheduled Booking Notifications</span>
            <input type="checkbox" defaultChecked />
          </div>
          <div style={toggleOptionStyle}>
            <span>Cancelled Booking Notifications</span>
            <input type="checkbox" />
          </div>
          <button style={buttonStyle}>Save Changes</button>
        </div>

        {/* Recent Appointments */}
        <div style={sectionStyle}>
          <h2>Recent Appointments</h2>
          <p>Stay up to date with your bookings</p>
          <button style={buttonStyle}>View All Appointments</button>
        </div>

        {/* Upcoming Bookings */}
        <div style={sectionStyle}>
          <h2>Upcoming Bookings</h2>
          <p>Here are your upcoming appointments:</p>
          <ul style={appointmentListStyle}>
            <li>Appointment with Dr. [Name] on Thursday, 3:00 PM</li>
            <li>Counseling Session on Friday, 10:30 AM</li>
          </ul>
          <button style={buttonStyle}>View Details</button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentNotifications;