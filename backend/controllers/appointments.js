const Appointment = require("../models/Appointment");
const User = require("../models/User");

// Create a new appointment
const createAppointment = async (req, res) => {
  const { doctorId, appointmentDate, appointmentTime, reason, notes } =
    req.body;
  const patientId = req.user.id; // Get patient ID from authenticated user

  try {
    // Validate doctor exists and is verified
    const doctor = await User.findOne({
      _id: doctorId,
      role: "doctor",
      isVerified: true,
    });
    if (!doctor) {
      return res
        .status(404)
        .json({ message: "Doctor not found or not verified" });
    }

    // Check if the doctor has availability for the requested time
    const availabilityExists = doctor.availability.some((slot) => {
      const slotDate = new Date(slot.date).toISOString().split("T")[0];
      const requestedDate = new Date(appointmentDate)
        .toISOString()
        .split("T")[0];

      return (
        slotDate === requestedDate &&
        slot.startTime <= appointmentTime &&
        slot.endTime > appointmentTime &&
        !slot.isBooked
      );
    });

    if (!availabilityExists) {
      return res
        .status(400)
        .json({ message: "Doctor is not available at the requested time" });
    }

    // Check if patient already has an appointment at the same time
    const existingAppointment = await Appointment.findOne({
      patient: patientId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      status: "scheduled",
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: "You already have an appointment scheduled at this time",
      });
    }

    // Create the appointment
    const appointment = new Appointment({
      patient: patientId,
      doctor: doctorId,
      appointmentDate,
      appointmentTime,
      reason,
      notes,
    });

    await appointment.save();

    // Update doctor's availability
    await User.updateOne(
      {
        _id: doctorId,
        "availability.date": new Date(appointmentDate)
          .toISOString()
          .split("T")[0],
        "availability.startTime": { $lte: appointmentTime },
        "availability.endTime": { $gt: appointmentTime },
      },
      { $set: { "availability.$.isBooked": true } }
    );

    // Populate doctor and patient details
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate("doctor", "email phone profilePic doctorSpecialty")
      .populate("patient", "email phone profilePic");

    res.status(201).json({
      appointment: populatedAppointment,
      message: "Appointment booked successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all appointments for a user (patient sees their appointments, doctor sees appointments with them)
const getAppointments = async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;
  const { status } = req.query;

  try {
    let query = {};

    // Filter by user role
    if (userRole === "patient") {
      query.patient = userId;
    } else if (userRole === "doctor") {
      query.doctor = userId;
    } else if (userRole === "admin") {
      // Admin can see all appointments
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate("doctor", "email phone profilePic doctorSpecialty")
      .populate("patient", "email phone profilePic")
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    res.status(200).json({
      appointments,
      count: appointments.length,
      message: "Appointments retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get appointment by ID
const getAppointmentById = async (req, res) => {
  const { appointmentId } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    const appointment = await Appointment.findById(appointmentId)
      .populate("doctor", "email phone profilePic doctorSpecialty")
      .populate("patient", "email phone profilePic");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check if user has permission to view this appointment
    if (
      userRole !== "admin" &&
      appointment.patient._id.toString() !== userId &&
      appointment.doctor._id.toString() !== userId
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.status(200).json({
      appointment,
      message: "Appointment retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update appointment status (cancel or complete)
const updateAppointmentStatus = async (req, res) => {
  const { appointmentId } = req.params;
  const { status, notes } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check if user has permission to update this appointment
    if (
      userRole !== "admin" &&
      appointment.patient.toString() !== userId &&
      appointment.doctor.toString() !== userId
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Patients can only cancel appointments
    if (userRole === "patient" && status !== "cancelled") {
      return res
        .status(403)
        .json({ message: "Patients can only cancel appointments" });
    }

    // Update appointment status
    appointment.status = status;

    // Update notes if provided
    if (notes) {
      appointment.notes = notes;
    }

    await appointment.save();

    // If appointment is cancelled, update doctor's availability
    if (status === "cancelled") {
      await User.updateOne(
        {
          _id: appointment.doctor,
          "availability.date": new Date(appointment.appointmentDate)
            .toISOString()
            .split("T")[0],
          "availability.startTime": { $lte: appointment.appointmentTime },
          "availability.endTime": { $gt: appointment.appointmentTime },
        },
        { $set: { "availability.$.isBooked": false } }
      );
    }

    // Populate doctor and patient details
    const updatedAppointment = await Appointment.findById(appointmentId)
      .populate("doctor", "email phone profilePic doctorSpecialty")
      .populate("patient", "email phone profilePic");

    res.status(200).json({
      appointment: updatedAppointment,
      message: `Appointment ${status} successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add doctor availability
const addDoctorAvailability = async (req, res) => {
  const doctorId = req.user.id;
  const { availabilitySlots } = req.body;

  try {
    // Verify user is a doctor
    const doctor = await User.findOne({ _id: doctorId, role: "doctor" });
    if (!doctor) {
      return res
        .status(403)
        .json({ message: "Only doctors can add availability" });
    }

    // Validate availability slots
    if (!Array.isArray(availabilitySlots) || availabilitySlots.length === 0) {
      return res
        .status(400)
        .json({ message: "Please provide valid availability slots" });
    }

    // Add new availability slots
    const updatedDoctor = await User.findByIdAndUpdate(
      doctorId,
      { $push: { availability: { $each: availabilitySlots } } },
      { new: true }
    ).select("-password");

    res.status(200).json({
      doctor: updatedDoctor,
      message: "Availability added successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Remove doctor availability
const removeDoctorAvailability = async (req, res) => {
  const doctorId = req.user.id;
  const { availabilityId } = req.params;

  try {
    // Verify user is a doctor
    const doctor = await User.findOne({ _id: doctorId, role: "doctor" });
    if (!doctor) {
      return res
        .status(403)
        .json({ message: "Only doctors can remove availability" });
    }

    // Remove availability slot
    const updatedDoctor = await User.findByIdAndUpdate(
      doctorId,
      { $pull: { availability: { _id: availabilityId } } },
      { new: true }
    ).select("-password");

    res.status(200).json({
      doctor: updatedDoctor,
      message: "Availability removed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  addDoctorAvailability,
  removeDoctorAvailability,
};
