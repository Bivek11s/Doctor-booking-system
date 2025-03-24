import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "",
    dateOfBirth: "",
    role: "patient",
    doctorSpecialty: "",
    profilePic: null,
    qualificationProof: null,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.gender ||
      !formData.dateOfBirth
    ) {
      return setError("Please fill in all required fields");
    }

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    if (
      formData.role === "doctor" &&
      (!formData.doctorSpecialty || !formData.qualificationProof)
    ) {
      return setError(
        "Doctor specialty and qualification proof are required for doctors"
      );
    }

    try {
      setLoading(true);

      // Create FormData object for file upload
      const submitData = new FormData();
      for (const key in formData) {
        if (key !== "confirmPassword" && formData[key] !== null) {
          submitData.append(key, formData[key]);
        }
      }

      await register(submitData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
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
            <label className="block text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-input"
              placeholder="Confirm your password"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          {formData.role === "doctor" && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Specialty <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="doctorSpecialty"
                value={formData.doctorSpecialty}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your medical specialty"
                required={formData.role === "doctor"}
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Profile Picture</label>
            <input
              type="file"
              name="profilePic"
              onChange={handleFileChange}
              className="form-input"
              accept="image/*"
            />
          </div>

          {formData.role === "doctor" && (
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">
                Qualification Proof <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                name="qualificationProof"
                onChange={handleFileChange}
                className="form-input"
                accept="image/*, application/pdf"
                required={formData.role === "doctor"}
              />
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
