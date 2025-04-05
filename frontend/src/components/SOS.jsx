import React, { useState } from "react";

const SOSFeature = () => {
  const [formData, setFormData] = useState({
    name: "",
    contactNumber: "",
    location: "",
    emergencyType: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
  };

  const handleClear = () => {
    setFormData({
      name: "",
      contactNumber: "",
      location: "",
      emergencyType: "",
    });
  };

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <header className="flex justify-between items-center pb-4 border-b">
        <h1 className="text-xl font-bold">SOS Feature</h1>
        <nav className="flex space-x-4">
          <a href="#" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">Profile</a>
          <a href="#" className="hover:underline">Settings</a>
          <input type="text" placeholder="Search in site" className="border p-2" />
        </nav>
      </header>

      {/* Urgent Medical Assistance Section */}
      <section className="bg-gray-200 p-6 rounded-lg mt-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Urgent Medical Assistance</h2>
          <p>Request help immediately</p>
        </div>
        <div className="space-x-2">
          <button className="border px-4 py-2 rounded">Cancel</button>
          <button className="px-4 py-2 rounded bg-black text-white">Request SOS Assistance</button>
        </div>
      </section>

      {/* Patient Details Section */}
      <div className="grid grid-cols-12 gap-4 mt-10">
        <div className="col-span-4">
          <h2 className="text-2xl font-bold">Patient Details</h2>
          <p>Fill in your information</p>
        </div>

        <div className="col-span-8">
          <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
            <div>
              <label className="block font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="border w-full p-2"
              />
            </div>

            <div>
              <label className="block font-medium">Contact Number</label>
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="Enter your contact number"
                className="border w-full p-2"
              />
            </div>

            <div className="col-span-2">
              <label className="block font-medium">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter your current location"
                className="border w-full p-2"
              />
            </div>

            <div className="col-span-2">
              <label className="block font-medium">Emergency Type</label>
              <div className="flex space-x-2">
                {["Heart Attack", "Accident", "Other"].map((type) => (
                  <label key={type} className="flex items-center space-x-1">
                    <input
                      type="radio"
                      name="emergencyType"
                      value={type}
                      checked={formData.emergencyType === type}
                      onChange={handleChange}
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="col-span-2 flex justify-between mt-4">
              <button type="button" onClick={handleClear} className="border px-4 py-2 rounded">
                Clear
              </button>
              <button type="submit" className="px-4 py-2 rounded bg-black text-white">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SOSFeature;
