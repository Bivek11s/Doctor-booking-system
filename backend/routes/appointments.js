const express = require("express");
const router = express.Router();

// Import controller functions for appointment handling
const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  addDoctorAvailability,
  removeDoctorAvailability,
} = require("../controllers/appointments");


router.post("/", createAppointment);


router.get("/", getAppointments);


router.get("/:appointmentId", getAppointmentById);


router.put("/:appointmentId/status", updateAppointmentStatus);

router.post("/availability", addDoctorAvailability);


router.delete("/availability/:availabilityId", removeDoctorAvailability);

module.exports = router;
