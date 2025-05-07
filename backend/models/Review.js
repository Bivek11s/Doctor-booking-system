const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Virtual for formatting the date
reviewSchema.virtual("formattedDate").get(function () {
  return this.createdAt.toLocaleDateString();
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - rating
 *         - comment
 *         - patient
 *         - doctor
 *       properties:
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           description: Rating given by the patient (1-5 stars)
 *         comment:
 *           type: string
 *           description: Review comment text
 *         patient:
 *           type: string
 *           format: uuid
 *           description: Reference to the patient who wrote the review
 *         doctor:
 *           type: string
 *           format: uuid
 *           description: Reference to the doctor being reviewed
 *         appointment:
 *           type: string
 *           format: uuid
 *           description: Reference to the appointment (optional)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when review was created
 */
