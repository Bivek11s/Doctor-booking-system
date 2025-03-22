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

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Appointment management endpoints
 */

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     tags: [Appointments]
 *     summary: Book a new appointment
 *     description: Create a new appointment with a doctor
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctorId
 *               - appointmentDate
 *               - appointmentTime
 *               - reason
 *             properties:
 *               doctorId:
 *                 type: string
 *                 description: ID of the doctor
 *               appointmentDate:
 *                 type: string
 *                 format: date
 *                 description: Date of the appointment (YYYY-MM-DD)
 *               appointmentTime:
 *                 type: string
 *                 description: Time of the appointment (HH:MM)
 *               reason:
 *                 type: string
 *                 description: Reason for the appointment
 *               notes:
 *                 type: string
 *                 description: Additional notes for the appointment
 *     responses:
 *       201:
 *         description: Appointment booked successfully
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Doctor not found
 *       500:
 *         description: Internal server error
 */
router.post("/", createAppointment);

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     tags: [Appointments]
 *     summary: Get user appointments
 *     description: Retrieve all appointments for the authenticated user (patients see their appointments, doctors see appointments with them)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [scheduled, completed, cancelled]
 *         description: Filter appointments by status
 *     responses:
 *       200:
 *         description: Appointments retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get("/", getAppointments);

/**
 * @swagger
 * /api/appointments/{appointmentId}:
 *   get:
 *     tags: [Appointments]
 *     summary: Get appointment by ID
 *     description: Retrieve details of a specific appointment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the appointment
 *     responses:
 *       200:
 *         description: Appointment retrieved successfully
 *       404:
 *         description: Appointment not found
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/:appointmentId", getAppointmentById);

/**
 * @swagger
 * /api/appointments/{appointmentId}/status:
 *   put:
 *     tags: [Appointments]
 *     summary: Update appointment status
 *     description: Update the status of an appointment (cancel or complete)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the appointment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [scheduled, completed, cancelled]
 *                 description: New status of the appointment
 *               notes:
 *                 type: string
 *                 description: Additional notes for the status update
 *     responses:
 *       200:
 *         description: Appointment status updated successfully
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Appointment not found
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.put("/:appointmentId/status", updateAppointmentStatus);

/**
 * @swagger
 * /api/appointments/availability:
 *   post:
 *     tags: [Appointments]
 *     summary: Add doctor availability
 *     description: Add availability slots for a doctor
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - availabilitySlots
 *             properties:
 *               availabilitySlots:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - date
 *                     - startTime
 *                     - endTime
 *                   properties:
 *                     date:
 *                       type: string
 *                       format: date
 *                       description: Date of availability (YYYY-MM-DD)
 *                     startTime:
 *                       type: string
 *                       description: Start time of availability (HH:MM)
 *                     endTime:
 *                       type: string
 *                       description: End time of availability (HH:MM)
 *                     isBooked:
 *                       type: boolean
 *                       default: false
 *                       description: Whether the slot is booked
 *     responses:
 *       200:
 *         description: Availability added successfully
 *       400:
 *         description: Invalid request data
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
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
