import React, { useState } from "react";

const PatientRegistration = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    gender: "",
    dateOfBirth: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    alert("Registration Successful!");
  };

  return (
    <div style={{}}>
      {/* Header */}
      <header style={{}}>
        <h2>BookDoctor</h2>
      </header>

      {/* Registration Form */}
      <div style={{}}>
        <h2>Registration</h2>
        <p>Fill in the details to create an account</p>

        <form onSubmit={handleSubmit} style={{}}>
          {/* Full Name */}
          <div>
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Gender */}
          <div>
            <label>Gender</label>
            <div>
              <input
                type="radio"
                name="gender"
                value="Male"
                onChange={handleChange}
              />{" "}
              Male
              <input
                type="radio"
                name="gender"
                value="Female"
                onChange={handleChange}
              />{" "}
              Female
              <input
                type="radio"
                name="gender"
                value="Other"
                onChange={handleChange}
              />{" "}
              Other
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label>Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
          </div>

          {/* Submit Button */}
          <button type="submit">Submit</button>
        </form>
      </div>

      {/* Footer */}
      <footer style={{}}>
        <p>© 2023 Medical Portal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PatientRegistration;
