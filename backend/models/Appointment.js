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

