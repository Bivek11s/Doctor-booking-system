import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, updateUserData } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    doctorSpecialty: "",
    profilePic: null,
    qualificationProof: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewProfilePic, setPreviewProfilePic] = useState("");

  useEffect(() => {
    if (user) {
      const formattedDate = user.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().split("T")[0]
        : "";

      setFormData({
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender || "",
        dateOfBirth: formattedDate,
        doctorSpecialty: user.doctorSpecialty || "",
      });

      setPreviewProfilePic(user.profilePic);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));

    if (name === "profilePic" && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewProfilePic(reader.result);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const submitData = new FormData();
      for (const key in formData) {
        if (formData[key] !== null && formData[key] !== undefined) {
          if (key === "profilePic" || key === "qualificationProof") {
            if (formData[key] instanceof File) {
              submitData.append(key, formData[key]);
            }
          } else {
            submitData.append(key, formData[key]);
          }
        }
      }

      const response = await axios.put(`/api/users/${user.id}`, submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      updateUserData(response.data.user);
      toast.success("Profile updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={styles.noUser}>
        <p style={styles.noUserText}>Please login to view your profile</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Your Profile</h1>

      <div style={styles.card}>
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <div style={styles.profileSection}>
              <img
                src={
                  previewProfilePic ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="Profile"
                style={styles.profilePic}
              />

              <label style={styles.label}>Profile Picture</label>
              <input
                type="file"
                name="profilePic"
                onChange={handleFileChange}
                accept="image/*"
              />

              {user.role === "doctor" && (
                <>
                  <label style={styles.label}>Qualification Proof</label>
                  <input
                    type="file"
                    name="qualificationProof"
                    onChange={handleFileChange}
                    accept="image/*, application/pdf"
                  />
                  {user.qualificationProof && (
                    <a
                      href={user.qualificationProof}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.link}
                    >
                      View Current Document
                    </a>
                  )}
                </>
              )}
            </div>

            <div style={styles.detailsSection}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter your full name"
                required
              />

              <label style={styles.label}>Email</label>
              <input type="email" value={formData.email} disabled style={styles.input} />
              <p style={styles.note}>Email cannot be changed</p>

              <label style={styles.label}>Phone</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} style={styles.input} />

              <label style={styles.label}>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} style={styles.input}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              <label style={styles.label}>Date of Birth</label>
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} style={styles.input} />
            </div>
          </div>

          <div style={styles.buttonWrapper}>
            <button
              type="submit"
              style={styles.button}
              disabled={loading}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#1f2e99")}
              onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f1f5f9",
    padding: "40px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: "30px",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
    padding: "30px",
    width: "100%",
    maxWidth: "800px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "row",
    gap: "40px",
    flexWrap: "wrap",
  },
  profileSection: {
    flex: "1",
    textAlign: "center",
  },
  profilePic: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #3b82f6",
    marginBottom: "15px",
  },
  detailsSection: {
    flex: "2",
  },
  label: {
    display: "centre",
    fontWeight: "600",
    fontSize: "14px",
    color: "#1e293b",
    marginBottom: "6px",
    marginTop: "10px",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    marginBottom: "12px",
  },
  note: {
    fontSize: "12px",
    color: "#64748b",
    marginTop: "-8px",
    marginBottom: "12px",
  },
  buttonWrapper: {
    textAlign: "right",
    marginTop: "20px",
  },
  button: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    padding: "10px 20px",
    borderRadius: "6px",
    border: "none",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
  link: {
    display: "block",
    marginTop: "10px",
    color: "#2563eb",
    textDecoration: "underline",
    fontSize: "14px",
  },
  error: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    padding: "10px 14px",
    borderRadius: "6px",
    marginBottom: "20px",
    fontWeight: "500",
  },
  noUser: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  noUserText: {
    fontSize: "18px",
    color: "#475569",
    fontWeight: "500",
  },
};


export default Profile;
