const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
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
  medications: [
    {
      name: {
        type: String,
        required: true,
      },
      dosage: {
        type: String,
        required: true,
      },
      frequency: {
        type: String,
        required: true,
      },
      duration: {
        type: String,
        required: true,
      },
      instructions: {
        type: String,
      },
    },
  ],
  additionalNotes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field on save
prescriptionSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Prescription = mongoose.model("Prescription", prescriptionSchema);
module.exports = Prescription;
