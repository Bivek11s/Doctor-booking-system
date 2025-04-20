import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    doctorsCount: 0,
    patientsCount: 0,
    pendingDoctors: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const doctorsResponse = await axios.get("/api/users?role=doctor");
        const doctorsCount = doctorsResponse.data.count || 0;

        const patientsResponse = await axios.get("/api/users?role=patient");
        const patientsCount = patientsResponse.data.count || 0;

        let pendingDoctors = 0;
        if (user?.role === "admin") {
          const pendingResponse = await axios.get(
            "/api/users?role=doctor&isVerified=false"
          );
          pendingDoctors = pendingResponse.data.count || 0;
        }

        setStats({ doctorsCount, patientsCount, pendingDoctors });
      } catch (error) {
        console.error("Error fetching stats:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const handleDoctorClick = (specialization) => {
    navigate(`/doctors?specialty=${specialization}`);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>Loading...</div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#F4F7FC",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Main Content */}
      <main
        style={{
          padding: "20px 40px",
          flex: 1,
        }}
      >
        <section
          style={{
            background: "#3E58EF",
            margin: "60px",
            padding: "50px",
            borderRadius: "10px",
            textAlign: "center",
            color: "white",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
            Welcome to <br /> <strong>Appointment Booking</strong>
          </h1>
          <p style={{ fontSize: "18px", marginBottom: "20px" }}>
            Find the right doctor for your needs
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <input
              type="text"
              placeholder="Search for doctors by name or specialization"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "60%",
                padding: "12px",
                border: "2px solid white",
                borderRadius: "5px",
                outline: "none",
                color: "black",
              }}
            />
            <button
              onClick={() =>
                navigate(`/doctors?search=${encodeURIComponent(searchQuery)}`)
              }
              style={{
                padding: "12px 24px",
                backgroundColor: "#3E66FB", // improved blue tone
                color: "#fff",
                fontSize: "18px",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#1A237E")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#2C48EF")}
            >
              Search
            </button>
          </div>
        </section>

        {/* Featured Doctors */}
        <section style={{ marginTop: "40px", textAlign: "center" }}>
          <h2
            style={{
              color: "#1A237E",
              fontSize: "24px",
              marginBottom: "20px",
            }}
          >
            Top Doctors Near You
          </h2>
          <div
            style={{
              display: "flex",
              gap: "20px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {["Cardiologist", "Dermatologist", "Neurologist"].map(
              (specialization, index) => (
                <button
                  key={index}
                  style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "10px",
                    textAlign: "center",
                    width: "200px",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                    border: "none",
                    cursor: "pointer",
                    transition: "transform 0.2s ease, background 0.3s ease",
                  }}
                  onClick={() => handleDoctorClick(specialization)}
                  onMouseOver={(e) => (e.target.style.background = "#E3E7FA")}
                  onMouseOut={(e) => (e.target.style.background = "white")}
                >
                  <span style={{ fontSize: "40px" }}>🧑‍⚕️</span>
                  <p
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#1A237E",
                      margin: 0,
                    }}
                  >
                    Dr.
                  </p>
                  <p style={{ fontSize: "16px", color: "#666666", margin: 0 }}>
                    {specialization}
                  </p>
                </button>
              )
            )}
          </div>
        </section>

        {/* Footer */}
        <footer
          style={{
            textAlign: "center",
            padding: "15px",
            backgroundColor: "#3949AB",
            color: "white",
            width: "100%",
            marginTop: "40px",
          }}
        >
          Book your appointment with ease
        </footer>
      </main>
    </div>
  );
};

const navItemStyle = {
  fontSize: "16px",
  padding: "10px 0",
  borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
  cursor: "pointer",
};

export default Dashboard;
