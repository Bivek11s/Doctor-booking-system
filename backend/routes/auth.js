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


router.post(
  "/register",
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "qualificationProof", maxCount: 1 },
  ]),
  register
);


router.post("/login", login);


router.post("/verify-doctor", verifyDoctor);

module.exports = router;
