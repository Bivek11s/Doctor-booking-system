const express = require("express");
const router = express.Router();
const { register, login, verifyDoctor } = require("../controllers/auth");
const multer = require("multer");

//Multer config for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest =
      file.fieldname === "qualificationProof"
        ? "uploads/qualifications/"
        : "uploads/profiles/";
    cb(null, dest);
  },
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     description: Creates a new user account with profile picture and qualification proof upload
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - phone
 *               - gender
 *               - dateOfBirth
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *               phone:
 *                 type: string
 *                 description: User's phone number
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 description: User's gender
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 description: User's date of birth
 *               role:
 *                 type: string
 *                 enum: [admin, patient, doctor]
 *                 description: User's role
 *               doctorSpecialty:
 *                 type: string
 *                 description: Required if role is doctor
 *               profilePic:
 *                 type: string
 *                 format: binary
 *                 description: User's profile picture
 *               qualificationProof:
 *                 type: string
 *                 format: binary
 *                 description: Doctor's qualification proof document (required if role is doctor)
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: User's unique identifier
 *                     email:
 *                       type: string
 *                       format: email
 *                       description: User's email address
 *                     phone:
 *                       type: string
 *                       description: User's phone number
 *                     gender:
 *                       type: string
 *                       enum: [male, female, other]
 *                       description: User's gender
 *                     dateOfBirth:
 *                       type: string
 *                       format: date
 *                       description: User's date of birth
 *                     role:
 *                       type: string
 *                       enum: [admin, patient, doctor]
 *                       description: User's role
 *                     isVerified:
 *                       type: boolean
 *                       description: User's verification status
 *                     doctorSpecialty:
 *                       type: string
 *                       description: Doctor's specialty (if role is doctor)
 *                     profilePic:
 *                       type: string
 *                       format: uri
 *                       description: URL to user's profile picture
 *                     qualificationProof:
 *                       type: string
 *                       format: uri
 *                       description: URL to doctor's qualification proof (if role is doctor)
 *                     availability:
 *                       type: array
 *                       description: Doctor's availability schedule (only for doctors)
 *                       items:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                             format: date
 *                             description: Available date
 *                           startTime:
 *                             type: string
 *                             format: time
 *                             description: Start time of availability
 *                           endTime:
 *                             type: string
 *                             format: time
 *                             description: End time of availability
 *                           isBooked:
 *                             type: boolean
 *                             description: Whether the time slot is booked
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *       400:
 *         description: Invalid input or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User already exists
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.post(
  "/register",
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "qualificationProof", maxCount: 1 },
  ]),
  register
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 *     description: Authenticate user and return user details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emailOrPhone
 *               - password
 *             properties:
 *               emailOrPhone:
 *                 type: string
 *                 description: User's email or phone number
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: User's unique identifier
 *                     email:
 *                       type: string
 *                       format: email
 *                       description: User's email address
 *                     phone:
 *                       type: string
 *                       description: User's phone number
 *                     gender:
 *                       type: string
 *                       enum: [male, female, other]
 *                       description: User's gender
 *                     dateOfBirth:
 *                       type: string
 *                       format: date
 *                       description: User's date of birth
 *                     role:
 *                       type: string
 *                       enum: [admin, patient, doctor]
 *                       description: User's role
 *                     isVerified:
 *                       type: boolean
 *                       description: User's verification status
 *                     doctorSpecialty:
 *                       type: string
 *                       description: Doctor's specialty (if role is doctor)
 *                     profilePic:
 *                       type: string
 *                       format: uri
 *                       description: URL to user's profile picture
 *                     qualificationProof:
 *                       type: string
 *                       format: uri
 *                       description: URL to doctor's qualification proof (if role is doctor)
 *                     availability:
 *                       type: array
 *                       description: Doctor's availability schedule (only for doctors)
 *                       items:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                             format: date
 *                             description: Available date
 *                           startTime:
 *                             type: string
 *                             format: time
 *                             description: Start time of availability
 *                           endTime:
 *                             type: string
 *                             format: time
 *                             description: End time of availability
 *                           isBooked:
 *                             type: boolean
 *                             description: Whether the time slot is booked
 *                 message:
 *                   type: string
 *                   example: Login successful
 *       400:
 *         description: Invalid credentials or missing fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid credentials
 *       403:
 *         description: Account not verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account not verified by admin
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/verify-doctor:
 *   post:
 *     tags: [Auth]
 *     summary: Verify doctor account
 *     description: Admin endpoint to approve or reject doctor registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctorId
 *               - isApproved
 *             properties:
 *               doctorId:
 *                 type: string
 *                 description: ID of the doctor to verify
 *               isApproved:
 *                 type: boolean
 *                 description: Whether to approve or reject the doctor
 *     responses:
 *       200:
 *         description: Doctor verification successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Doctor approved successfully
 *                 doctor:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     role:
 *                       type: string
 *                     isVerified:
 *                       type: boolean
 *                     doctorSpecialty:
 *                       type: string
 *                     qualificationProof:
 *                       type: string
 *       400:
 *         description: Invalid request
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Doctor not found
 *       500:
 *         description: Internal server error
 */
router.post("/verify-doctor", verifyDoctor);

module.exports = router;
