const express = require("express");
const router = express.Router();
const {
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/users");
const multer = require("multer");

// Multer config for file upload
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
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: List users by role
 *     description: Retrieve a list of users filtered by role, verification status, and specialty
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [patient, doctor]
 *         description: Filter users by role
 *       - in: query
 *         name: isVerified
 *         schema:
 *           type: boolean
 *         description: Filter by verification status
 *       - in: query
 *         name: specialty
 *         schema:
 *           type: string
 *         description: Filter doctors by specialty
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get("/", listUsers);

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by ID
 *     description: Retrieve user details by their ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User's ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/:userId", getUserById);

/**
 * @swagger
 * /api/users/{userId}:
 *   put:
 *     tags: [Users]
 *     summary: Update user
 *     description: Update user information including profile picture and qualification proof
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User's ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               gender:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *               doctorSpecialty:
 *                 type: string
 *               profilePic:
 *                 type: string
 *                 format: binary
 *               qualificationProof:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/:userId",
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "qualificationProof", maxCount: 1 },
  ]),
  updateUser
);

/**
 * @swagger
 * /api/users/{userId}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete user
 *     description: Delete a user (admin only)
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User's ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       403:
 *         description: Only admin can delete users
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:userId", deleteUser);

module.exports = router;
