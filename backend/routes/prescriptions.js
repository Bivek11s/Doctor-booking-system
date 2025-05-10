const express = require("express");
const router = express.Router();

// Import controller functions for prescription handling
const {
  createPrescription,
  getPatientPrescriptions,
  getPrescriptionById,
  getAppointmentPrescription,
  updatePrescription,
  getPatientHistory,
} = require("../controllers/prescriptions");

// Create a new prescription
router.post("/", createPrescription);

// Get prescriptions for a patient
router.get("/patient/:patientId", getPatientPrescriptions);

// Get prescription by ID
router.get("/:prescriptionId", getPrescriptionById);

// Get prescription for an appointment
router.get("/appointment/:appointmentId", getAppointmentPrescription);

// Update a prescription
router.put("/:prescriptionId", updatePrescription);

// Get patient history (appointments and prescriptions)
router.get("/history/:patientId", getPatientHistory);

module.exports = router;
