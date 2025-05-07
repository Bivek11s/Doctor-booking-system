const express = require("express");
const router = express.Router();
const {
  createReview,
  getDoctorReviews,
  getPatientReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviews");

// Create a new review
router.post("/", createReview);

// Get all reviews for a doctor
router.get("/doctor/:doctorId", getDoctorReviews);

// Get all reviews by the logged-in patient
router.get("/patient", getPatientReviews);

// Update a review
router.put("/:reviewId", updateReview);

// Delete a review
router.delete("/:reviewId", deleteReview);

module.exports = router;
