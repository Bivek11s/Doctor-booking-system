const Review = require("../models/Review");
const User = require("../models/User");
const Appointment = require("../models/Appointment");

// Create a new review
const createReview = async (req, res) => {
  const { rating, comment, doctorId, appointmentId, patientId } = req.body;
  // patientId now comes from request body instead of auth middleware

  try {
    // Validate required fields
    if (!rating || !comment || !doctorId || !patientId) {
      return res.status(400).json({
        message: "Missing required fields",
        details: {
          rating: rating ? undefined : "Rating is required",
          comment: comment ? undefined : "Comment is required",
          doctorId: doctorId ? undefined : "Doctor ID is required",
          patientId: patientId ? undefined : "Patient ID is required",
        },
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    // Check if doctor exists
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Check if patient exists
    const patient = await User.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Check if appointment exists if appointmentId is provided
    if (appointmentId) {
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      // Verify that the appointment belongs to this patient and doctor
      if (
        appointment.patient.toString() !== patientId ||
        appointment.doctor.toString() !== doctorId
      ) {
        return res
          .status(403)
          .json({ message: "Unauthorized to review this appointment" });
      }

      // Check if appointment is completed
      if (appointment.status !== "completed") {
        return res
          .status(400)
          .json({ message: "Can only review completed appointments" });
      }

      // Check if review already exists for this appointment
      const existingReview = await Review.findOne({
        appointment: appointmentId,
      });
      if (existingReview) {
        return res
          .status(400)
          .json({ message: "Review already exists for this appointment" });
      }
    }

    // Create the review
    const review = new Review({
      rating,
      comment,
      patient: patientId,
      doctor: doctorId,
      appointment: appointmentId,
    });

    await review.save();

    res.status(201).json({
      review,
      message: "Review submitted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all reviews for a doctor
const getDoctorReviews = async (req, res) => {
  const { doctorId } = req.params;

  try {
    // Check if doctor exists
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Get reviews with patient details
    const reviews = await Review.find({ doctor: doctorId })
      .populate("patient", "fullName profilePic")
      .sort({ createdAt: -1 });

    // Calculate average rating
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0;

    res.status(200).json({
      reviews,
      totalReviews,
      averageRating,
      message: "Reviews retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all reviews by a patient
const getPatientReviews = async (req, res) => {
  const { patientId } = req.query; // Get patientId from query parameters

  try {
    const reviews = await Review.find({ patient: patientId })
      .populate("doctor", "fullName profilePic doctorSpecialty")
      .sort({ createdAt: -1 });

    res.status(200).json({
      reviews,
      message: "Reviews retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a review
const updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const { rating, comment, patientId } = req.body; // patientId now comes from request body

  try {
    // Find the review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if the user is the author of the review
    if (review.patient.toString() !== patientId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this review" });
    }

    // Validate rating
    if (rating && (rating < 1 || rating > 5)) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    // Update the review
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    await review.save();

    res.status(200).json({
      review,
      message: "Review updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  const { reviewId } = req.params;
  const { userId, userRole } = req.body; // Get user info from request body instead of auth middleware

  try {
    // Find the review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if the user is the author of the review or an admin
    if (review.patient.toString() !== userId && userRole !== "admin") {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this review" });
    }

    await Review.findByIdAndDelete(reviewId);

    res.status(200).json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createReview,
  getDoctorReviews,
  getPatientReviews,
  updateReview,
  deleteReview,
};
