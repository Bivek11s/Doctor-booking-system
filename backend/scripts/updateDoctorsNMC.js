/**
 * Migration script to update existing doctor records with a default NMC number
 *
 * This script connects to the MongoDB database and updates all doctor records
 * that don't have an NMC number with a default value.
 *
 * Usage: node updateDoctorsNMC.js
 */
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const User = require("../models/User");

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

// Update doctors without NMC number
const updateDoctors = async () => {
  try {
    // Find all doctors without an NMC number
    const doctors = await User.find({
      role: "doctor",
      $or: [
        { nmcNumber: { $exists: false } },
        { nmcNumber: null },
        { nmcNumber: "" },
      ],
    });

    console.log(`Found ${doctors.length} doctors without NMC number`);

    if (doctors.length === 0) {
      console.log("No doctors need updating");
      return;
    }

    // Update each doctor with a default NMC number
    for (const doctor of doctors) {
      // Generate a random 6-digit number as default NMC
      const defaultNMC = Math.floor(100000 + Math.random() * 900000).toString();

      await User.findByIdAndUpdate(doctor._id, { nmcNumber: defaultNMC });
      console.log(
        `Updated doctor ${doctor.fullName} with NMC number: ${defaultNMC}`
      );
    }

    console.log("All doctors updated successfully");
  } catch (error) {
    console.error("Error updating doctors:", error.message);
  }
};

// Main function
const main = async () => {
  await connectDB();
  await updateDoctors();
  console.log("Migration completed");
  process.exit(0);
};

// Run the script
main();
