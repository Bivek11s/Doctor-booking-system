const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  appointmentDate: {
    type: Date,
    required: true,
  },
  appointmentTime: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["scheduled", "completed", "cancelled"],
    default: "scheduled",
  },
  reason: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Virtual for formatting date and time together
appointmentSchema.virtual("appointmentDateTime").get(function () {
  return new Date(
    `${this.appointmentDate.toISOString().split("T")[0]}T${
      this.appointmentTime
    }`
  );
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;

/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       required:
 *         - patient
 *         - doctor
 *         - appointmentDate
 *         - appointmentTime
 *         - reason
 *       properties:
 *         patient:
 *           type: string
 *           description: ID of the patient user
 *         doctor:
 *           type: string
 *           description: ID of the doctor user
 *         appointmentDate:
 *           type: string
 *           format: date
 *           description: Date of the appointment
 *         appointmentTime:
 *           type: string
 *           description: Time of the appointment (HH:MM format)
 *         status:
 *           type: string
 *           enum:
 *             - scheduled
 *             - completed
 *             - cancelled
 *           description: Status of the appointment
 *         reason:
 *           type: string
 *           description: Reason for the appointment
 *         notes:
 *           type: string
 *           description: Additional notes for the appointment
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when appointment was created
 */
