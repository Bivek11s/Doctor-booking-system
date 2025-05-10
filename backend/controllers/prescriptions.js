const Prescription = require("../models/Prescription");
const Appointment = require("../models/Appointment");
const User = require("../models/User");

// Create a new prescription
const createPrescription = async (req, res) => {
  const { appointmentId, medications, additionalNotes } = req.body;
  const { userId, userRole } = req.body;

  try {
    // Verify the user is a doctor
    if (userRole !== "doctor") {
      return res
        .status(403)
        .json({ message: "Only doctors can create prescriptions" });
    }

    // Find the appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Verify the doctor is the one who had the appointment
    if (appointment.doctor.toString() !== userId) {
      return res
        .status(403)
        .json({
          message: "Unauthorized to create prescription for this appointment",
        });
    }

    // Verify the appointment is completed
    if (appointment.status !== "completed") {
      return res
        .status(400)
        .json({
          message: "Can only create prescriptions for completed appointments",
        });
    }

    // Check if a prescription already exists for this appointment
    const existingPrescription = await Prescription.findOne({
      appointment: appointmentId,
    });
    if (existingPrescription) {
      return res
        .status(400)
        .json({
          message: "A prescription already exists for this appointment",
        });
    }

    // Create the prescription
    const prescription = new Prescription({
      appointment: appointmentId,
      patient: appointment.patient,
      doctor: appointment.doctor,
      medications,
      additionalNotes,
    });

    await prescription.save();

    // Populate doctor and patient details
    const populatedPrescription = await Prescription.findById(prescription._id)
      .populate("doctor", "fullName email phone profilePic doctorSpecialty")
      .populate("patient", "fullName email phone profilePic")
      .populate("appointment");

    res.status(201).json({
      prescription: populatedPrescription,
      message: "Prescription created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get prescriptions for a patient
const getPatientPrescriptions = async (req, res) => {
  const { patientId } = req.params;
  const { userId, userRole } = req.query;

  try {
    // Verify the user has permission to view these prescriptions
    if (userRole === "patient" && userId !== patientId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to view these prescriptions" });
    }

    // Find prescriptions for the patient
    const prescriptions = await Prescription.find({ patient: patientId })
      .populate("doctor", "fullName email phone profilePic doctorSpecialty")
      .populate("patient", "fullName email phone profilePic")
      .populate("appointment")
      .sort({ createdAt: -1 });

    res.status(200).json({
      prescriptions,
      count: prescriptions.length,
      message: "Prescriptions retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get prescription by ID
const getPrescriptionById = async (req, res) => {
  const { prescriptionId } = req.params;
  const { userId, userRole } = req.query;

  try {
    const prescription = await Prescription.findById(prescriptionId)
      .populate("doctor", "fullName email phone profilePic doctorSpecialty")
      .populate("patient", "fullName email phone profilePic")
      .populate("appointment");

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    // Check if user has permission to view this prescription
    if (
      userRole !== "admin" &&
      prescription.patient._id.toString() !== userId &&
      prescription.doctor._id.toString() !== userId
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized to view this prescription" });
    }

    res.status(200).json({
      prescription,
      message: "Prescription retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get prescriptions for an appointment
const getAppointmentPrescription = async (req, res) => {
  const { appointmentId } = req.params;
  const { userId, userRole } = req.query;

  try {
    // Find the appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check if user has permission to view this appointment's prescription
    if (
      userRole !== "admin" &&
      appointment.patient.toString() !== userId &&
      appointment.doctor.toString() !== userId
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized to view this prescription" });
    }

    // Find prescription for the appointment
    const prescription = await Prescription.findOne({
      appointment: appointmentId,
    })
      .populate("doctor", "fullName email phone profilePic doctorSpecialty")
      .populate("patient", "fullName email phone profilePic")
      .populate("appointment");

    if (!prescription) {
      return res
        .status(404)
        .json({ message: "No prescription found for this appointment" });
    }

    res.status(200).json({
      prescription,
      message: "Prescription retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a prescription
const updatePrescription = async (req, res) => {
  const { prescriptionId } = req.params;
  const { medications, additionalNotes, userId, userRole } = req.body;

  try {
    // Verify the user is a doctor
    if (userRole !== "doctor") {
      return res
        .status(403)
        .json({ message: "Only doctors can update prescriptions" });
    }

    // Find the prescription
    const prescription = await Prescription.findById(prescriptionId);
    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    // Verify the doctor is the one who created the prescription
    if (prescription.doctor.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this prescription" });
    }

    // Update the prescription
    prescription.medications = medications || prescription.medications;
    prescription.additionalNotes =
      additionalNotes || prescription.additionalNotes;
    prescription.updatedAt = Date.now();

    await prescription.save();

    // Populate doctor and patient details
    const populatedPrescription = await Prescription.findById(prescription._id)
      .populate("doctor", "fullName email phone profilePic doctorSpecialty")
      .populate("patient", "fullName email phone profilePic")
      .populate("appointment");

    res.status(200).json({
      prescription: populatedPrescription,
      message: "Prescription updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get patient history (appointments and prescriptions)
const getPatientHistory = async (req, res) => {
  const { patientId } = req.params;
  const { userId, userRole } = req.query;

  try {
    // Verify the user has permission to view this patient's history
    if (userRole === "patient" && userId !== patientId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to view this patient's history" });
    }

    // Find all appointments for the patient
    const appointments = await Appointment.find({ patient: patientId })
      .populate("doctor", "fullName email phone profilePic doctorSpecialty")
      .sort({ appointmentDate: -1, appointmentTime: -1 });

    // Find all prescriptions for the patient
    const prescriptions = await Prescription.find({ patient: patientId })
      .populate("doctor", "fullName email phone profilePic doctorSpecialty")
      .populate("appointment")
      .sort({ createdAt: -1 });

    res.status(200).json({
      appointments,
      prescriptions,
      message: "Patient history retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createPrescription,
  getPatientPrescriptions,
  getPrescriptionById,
  getAppointmentPrescription,
  updatePrescription,
  getPatientHistory,
};
