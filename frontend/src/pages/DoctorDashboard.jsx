import React from "react";

const DoctorDashboard = () => {
  const containerStyle = {
    fontFamily: "Arial, sans-serif",
    margin: "0 auto",
    width: "1350px",
    padding: "40px",
    color: "#000",
    background: "#f4f6f7",
    // background: 'url("https://i.pinimg.com/736x/94/36/99/943699ef48b8dcd438693fb0577ad680.jpg") no-repeat center center/cover',
  };

  const navbarStyle = {
    width: "100%",
    height: "60px",
    backgroundColor: "#80a9d7",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "18px",
    fontWeight: "bold",
    borderBottom: "1px solid #025a9b",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 1000,
    margin: 0,
    padding: 0,
  };

  const mainContentContainerStyle = {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
    marginTop: "70px", 
    padding: "0px",
  };

  const sidebarItemStyle = {
    backgroundColor: "#80a9d7",
    width: "250px",
    color: "black",
    padding: "20px",
    borderRadius: "10px",
    cursor: "pointer",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: "20px",
  };

  const mainContentStyle = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "0px",
  };

  const sectionStyle = {
    width: "60%",
    backgroundColor: "#faf8ff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
  };

  const titleStyle = {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "15px",
    textAlign: "center",
    color: "black",
  };

  const textStyle = {
    color: "black",
  };

  const buttonStyle = {
    padding: "10px",
    backgroundColor: "#0288D1",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  };

  const dateTimeContainerStyle = {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    width: "100%",
  };

  return (
    <div style={containerStyle}>
      {/* Navbar */}
      <div style={navbarStyle}>Welcome to Doctor Dashboard</div>

      {/* Main Content Container */}
      <div style={mainContentContainerStyle}>
        {/* Sidebar Items */}
        <div>
          <div style={sidebarItemStyle}>Doctor Availability</div>
          <div style={sidebarItemStyle}>Manage Appointments</div>
          <div style={sidebarItemStyle}>Appointment Approval</div>
        </div>

        {/* Main Content */}
        <div style={mainContentStyle}>
          {/* Welcome Section */}
          <div style={sectionStyle}>
            <h2 style={titleStyle}>Manage Appointments and Availability</h2>
            <p style={{ textAlign: "center", color: "black" }}>
              Use the tools below to manage your schedule and patient requests.
            </p>
          </div>

          {/* Today's Appointments Section */}
          <div style={sectionStyle}>
            <h2 style={titleStyle}>Today's Appointments</h2>
            <div>
              {/* Patient 1 */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <img
                  src="https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Patient 1"
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    marginRight: "10px",
                  }}
                />
                <p style={textStyle}>Patient 1: 10:00 AM</p>
              </div>

              {/* Patient 2 */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src="https://images.pexels.com/photos/678783/pexels-photo-678783.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Patient 2"
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    marginRight: "10px",
                  }}
                />
                <p style={textStyle}>Patient 2: 11:30 AM</p>
              </div>
            </div>
          </div>

          {/* Set Doctor Availability Section */}
          <div style={sectionStyle}>
            <h2 style={titleStyle}>Set Doctor Availability</h2>
            <form>
              <div style={dateTimeContainerStyle}>
                <input
                  type="date"
                  style={{
                    ...buttonStyle,
                    width: "45%",
                    backgroundColor: "#80a9d7",
                    color: "white",
                  }}
                  required
                />
                <input
                  type="time"
                  style={{
                    ...buttonStyle,
                    width: "45%",
                    backgroundColor: "#80a9d7",
                    color: "white",
                  }}
                  required
                />
              </div>
              {/* Buttons with Gap */}
              <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
                <button type="submit" style={buttonStyle}>
                  Add Slot
                </button>
                <button
                  type="submit"
                  style={{
                    ...buttonStyle,
                    backgroundColor: "red",
                  }}
                >
                  Remove Slot
                </button>
              </div>
            </form>
          </div>

          {/* Appointment Requests Section */}
          <div style={sectionStyle}>
            <h2 style={titleStyle}>Appointment Requests</h2>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              {/* Patient Details */}
              <div>
                <p style={textStyle}>Patient Name: John Doe</p>
                <p style={textStyle}>Time: 2:00 PM</p>

                {/* Buttons with Gap */}
                <div style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
                  <button style={buttonStyle}>Accept Request</button>
                  <button
                    style={{
                      ...buttonStyle,
                      backgroundColor: "red",
                    }}
                  >
                    Reject Request
                  </button>
                </div>
              </div>

              {/* Patient Image */}
              <div>
                <img
                  src="	https://images.pexels.com/photos/1278566/pexels-photo-1278566.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Patient Photo"
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    border: "2px solid #ddd",
                    marginLeft: "20px",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;