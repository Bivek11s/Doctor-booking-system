import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    doctorsCount: 0,
    patientsCount: 0,
    pendingDoctors: 0,
  });
  const [loading, setLoading] = useState(true);

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
      <main
        style={{
          padding: "20px 40px",
          flex: 1,
        }}
      >
        {/* Welcome Card with Image on Left */}
        <section
          style={{
            background: "#3E58EF",
            margin: "15px",
            padding: "40px",
            borderRadius: "10px",
            color: "white",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "30px",
          }}
        >
          <img
            src="https://i.pinimg.com/736x/1c/a7/5f/1ca75f8380c1c3f98299b4feeac11aa5.jpg"
            alt="Doctor Illustration"
            style={{
              width: "200px",
              height: "200px",
              objectFit: "cover", 
              borderRadius: "12px",
              backgroundColor: "white",
              padding: "10px",
            }}
          />
          <div style={{ flex: 1, minWidth: "260px" }}>
            <h1
              style={{
                fontSize: "36px",
                fontWeight: "700",
                marginBottom: "15px",
              }}
            >
              Welcome to <br /> Doctor Appointment Booking
            </h1>
            <p style={{ fontSize: "18px", lineHeight: "1.6" }}>
              Find the right doctor for your needs.<br />
              Easily book appointments with trusted doctors near you.
            </p>
          </div>
        </section>


        {/* Image Slider Animation */}
        <div
          style={{
            width: "80%",  
            margin: "0 auto",
            marginTop: "20px",
            maxWidth: "960px", 
          }}
        >
          <Slider
            dots={true}
            infinite={true}
            speed={500}
            slidesToShow={1}
            autoplay={true}
            autoplaySpeed={1500}
            arrows={false}
          >
            {[
              "https://i.pinimg.com/736x/c9/04/dd/c904dd82eacd7cf059e03da50c250137.jpg",
              "https://i.pinimg.com/736x/c9/4d/2a/c94d2a94760946b1d50a3cbeba5c348a.jpg",
              "https://i.pinimg.com/736x/15/31/87/1531874b831c429e221be4e48c58fd3d.jpg",
            ].map((url, idx) => (
              <div key={idx}>
                <img
                  src={url}
                  alt={`Slide ${idx + 1}`}
                  style={{
                    width: "100%",
                    height: "300px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </div>
            ))}
          </Slider>

        </div>


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
            {[
              {
                specialization: "Cardiologist",
                image: "https://i.pinimg.com/736x/0a/69/7d/0a697d07b7573f221ecef33b7ad36ada.jpg",
              },
              {
                specialization: "Dermatologist",
                image: "https://i.pinimg.com/736x/a6/4d/7d/a64d7dedc2aa4e0ae852a4b8b8083888.jpg",
              },
              {
                specialization: "Neurologist",
                image: "https://i.pinimg.com/736x/e7/d3/e4/e7d3e4bb785c59035c8a7ffab09670d3.jpg",
              },
            ].map((doctor, index) => (
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
                onClick={() => handleDoctorClick(doctor.specialization)}
                onMouseOver={(e) => (e.target.style.background = "#E3E7FA")}
                onMouseOut={(e) => (e.target.style.background = "white")}
              >
                <img
                  src={doctor.image}
                  alt={`${doctor.specialization} icon`}
                  style={{
                    width: "60px",
                    height: "60px",
                    margin: "0 auto 8px auto",
                    display: "block",
                  }}
                />
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
                  {doctor.specialization}
                </p>
              </button>
            ))}
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

