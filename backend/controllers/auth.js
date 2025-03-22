const { uploadToGoogleDrive } = require("../utils/googleDrive");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  const { email, phone, password, role, doctorSpecialty, gender, dateOfBirth } =
    req.body;
  const files = req.files; // From Multer (multiple files)

  //validation
  if (!email || !phone || !password || !gender || !dateOfBirth) {
    return res.status(400).json({
      message:
        "Please provide email, phone, password, gender, and date of birth",
    });
  }
  if (role === "doctor" && (!doctorSpecialty || !files?.qualificationProof)) {
    return res.status(400).json({
      message: "Please provide doctor specialty and qualification proof",
    });
  }

  try {
    let user = await User.findOne({ $or: [{ email }, { phone }] });
    if (user) return res.status(400).json({ message: "User already exists" });

    //handle file uploads
    let profilePicUrl = null;
    let qualificationProofUrl = null;

    if (files?.profilePic?.[0]) {
      profilePicUrl = await uploadToGoogleDrive(files.profilePic[0]);
    }

    if (files?.qualificationProof?.[0]) {
      qualificationProofUrl = await uploadToGoogleDrive(
        files.qualificationProof[0]
      );
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    user = new User({
      email,
      phone,
      password: hashedPassword,
      gender,
      dateOfBirth,
      role: role || "patient",
      doctorSpecialty: role === "doctor" ? doctorSpecialty : undefined,
      profilePic: profilePicUrl,
      qualificationProof: qualificationProofUrl,
    });

    await user.save();

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        role: user.role,
        isVerified: user.isVerified,
        doctorSpecialty: user.doctorSpecialty,
        profilePic: user.profilePic,
        qualificationProof: user.qualificationProof,
      },
      message: "User registered successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { emailOrPhone, password } = req.body;

  //validation
  if (!emailOrPhone || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email or phone and password" });
  }

  try {
    //find user by email or phone
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    //compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    //Check verification - only doctors need verification
    if (!user.isVerified && user.role === "doctor") {
      return res.status(403).json({ message: "Account not verified by admin" });
    }

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        role: user.role,
        isVerified: user.isVerified,
        doctorSpecialty: user.doctorSpecialty,
        profilePic: user.profilePic,
        qualificationProof: user.qualificationProof,
      },
      message: "Login successful",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const verifyDoctor = async (req, res) => {
  const { doctorId, isApproved } = req.body;
  const { user } = req;

  try {
    // Find the doctor
    const doctor = await User.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    if (doctor.role !== "doctor")
      return res.status(400).json({ message: "User is not a doctor" });

    // Update verification status
    doctor.isVerified = isApproved;
    await doctor.save();

    res.status(200).json({
      message: `Doctor ${isApproved ? "approved" : "rejected"} successfully`,
      doctor: {
        id: doctor.id,
        email: doctor.email,
        phone: doctor.phone,
        role: doctor.role,
        isVerified: doctor.isVerified,
        doctorSpecialty: doctor.doctorSpecialty,
        qualificationProof: doctor.qualificationProof,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { register, login, verifyDoctor };
