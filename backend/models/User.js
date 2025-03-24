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
  availability: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *         - phone
 *         - password
 *         - role
 *         - gender
 *         - dateOfBirth
 *       properties:
 *         fullName:
 *           type: string
 *           description: User's full name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         phone:
 *           type: string
 *           description: User's contact phone number
 *         password:
 *           type: string
 *           format: password
 *           description: User's hashed password
 *         role:
 *           type: string
 *           enum:
 *             - admin
 *             - patient
 *             - doctor
 *           description: User's role in the system
 *         gender:
 *           type: string
 *           enum:
 *             - male
 *             - female
 *             - other
 *           description: User's gender
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: User's date of birth
 *         isVerified:
 *           type: boolean
 *           description: Verification status of the user account
 *         profilePic:
 *           type: string
 *           format: uri
 *           description: URL to user's profile picture
 *         qualificationProof:
 *           type: string
 *           description: Proof of qualification for doctors (required when role is doctor)
 *         doctorSpecialty:
 *           type: string
 *           description: Medical specialty of the doctor (required when role is doctor)
 *         availability:
 *           type: array
 *           description: Doctor's availability schedule (only for doctors)
 *           items:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Available date
 *               startTime:
 *                 type: string
 *                 format: time
 *                 description: Start time of availability
 *               endTime:
 *                 type: string
 *                 format: time
 *                 description: End time of availability
 *               isBooked:
 *                 type: boolean
 *                 description: Whether the time slot is booked
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when user was created
 */
