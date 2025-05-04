const express = require("express");
const router = express.Router();
const {
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateDoctorVerification,
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

router.get("/", listUsers);

router.get("/:userId", getUserById);

router.put(
  "/:userId",
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "qualificationProof", maxCount: 1 },
  ]),
  updateUser
);

router.delete("/:userId", deleteUser);

// Update doctor verification status
router.patch("/:userId/verify", updateDoctorVerification);

module.exports = router;
