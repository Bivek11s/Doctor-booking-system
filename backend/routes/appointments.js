const express = require("express");
const router = express.Router();
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

/**
 * @swagger
 * /api/appointments/availability/{availabilityId}:
 *   delete:
 *     tags: [Appointments]
 *     summary: Remove doctor availability
 *     description: Remove an availability slot for a doctor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: availabilityId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the availability slot
 *     responses:
 *       200:
 *         description: Availability removed successfully
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete("/availability/:availabilityId", removeDoctorAvailability);

module.exports = router;
