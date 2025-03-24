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
      // Format date to YYYY-MM-DD for input type="date"
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

    // Create preview for profile picture
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

      // Create FormData object for file upload
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

      // Update user data in context
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
      <div className="text-center py-8">
        <p className="text-xl text-gray-600">
          Please login to view your profile
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

      <div className="card">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="md:w-1/3 mb-6 md:mb-0">
              <div className="flex flex-col items-center">
                <img
                  src={
                    previewProfilePic ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="Profile"
                  className="w-40 h-40 rounded-full object-cover mb-4"
                />

                <div className="w-full">
                  <label className="block text-gray-700 mb-2">
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    name="profilePic"
                    onChange={handleFileChange}
                    className="form-input"
                    accept="image/*"
                  />
                </div>

                {user.role === "doctor" && (
                  <div className="w-full mt-4">
                    <label className="block text-gray-700 mb-2">
                      Qualification Proof
                    </label>
                    <input
                      type="file"
                      name="qualificationProof"
                      onChange={handleFileChange}
                      className="form-input"
                      accept="image/*, application/pdf"
                    />

                    {user.qualificationProof && (
                      <a
                        href={user.qualificationProof}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm block mt-2"
                      >
                        View Current Document
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="md:w-2/3">
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  disabled
                />
                <p className="text-sm text-gray-500 mt-1">
                  Email cannot be changed
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              {user.role === "doctor" && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Specialty</label>
                  <input
                    type="text"
                    name="doctorSpecialty"
                    value={formData.doctorSpecialty}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              )}

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Role</label>
                <input
                  type="text"
                  value={user.role}
                  className="form-input"
                  disabled
                />
                <p className="text-sm text-gray-500 mt-1">
                  Role cannot be changed
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Verification Status
                </label>
                <div
                  className={`badge ${
                    user.isVerified ? "badge-success" : "badge-warning"
                  } inline-block`}
                >
                  {user.isVerified ? "Verified" : "Pending Verification"}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-right">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
