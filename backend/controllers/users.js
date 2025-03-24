const User = require("../models/User");
const { uploadToGoogleDrive } = require("../utils/googleDrive");

// List users by role (patients or doctors)
const listUsers = async (req, res) => {
  const { role, isVerified, specialty } = req.query;

  try {
    const query = {};
    if (role) query.role = role;
    if (isVerified !== undefined) query.isVerified = isVerified === "true";
    if (specialty) query.doctorSpecialty = specialty;

    const users = await User.find(query).select("-password");
    res.status(200).json({
      users,
      count: users.length,
      message: `${role || "Users"} retrieved successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user,
      message: "User retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update user
const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { fullName, ...updates } = req.body;
  const files = req.files;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Handle file uploads
    if (files?.profilePic?.[0]) {
      updates.profilePic = await uploadToGoogleDrive(files.profilePic[0]);
    }

    if (files?.qualificationProof?.[0]) {
      updates.qualificationProof = await uploadToGoogleDrive(
        files.qualificationProof[0]
      );
    }

    // Remove sensitive fields from updates
    delete updates.password;
    delete updates.role;
    delete updates.isVerified;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { ...updates, ...(fullName && { fullName }) } },
      { new: true }
    ).select("-password");

    res.status(200).json({
      user: updatedUser,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  const { userId } = req.params;
  const { user } = req; // From auth middleware

  try {
    // Only admin can delete users
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can delete users" });
    }

    const userToDelete = await User.findById(userId);
    if (!userToDelete) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
};
