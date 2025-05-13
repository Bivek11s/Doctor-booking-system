const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "patient", "doctor"],
    default: "patient",
  },
  isVerified: {
    type: Boolean,
    default: function () {
      return this.role === "patient";
    },
  },
  profilePic: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  },
  qualificationProof: {
    type: String,
    required: function () {
      return this.role === "doctor";
    },
  },
  doctorSpecialty: {
    type: String,
    required: function () {
      return this.role === "doctor";
    },
  },
  nmcNumber: {
    type: String,
    required: function () {
      return this.role === "doctor";
    },
  },
  availability: {
    type: [
      {
        date: {
          type: String,
          required: true,
        },
        startTime: {
          type: String,
          required: true,
        },
        endTime: {
          type: String,
          required: true,
        },
        isBooked: {
          type: Boolean,
          default: false,
        },
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          auto: true,
        },
      },
    ],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;

