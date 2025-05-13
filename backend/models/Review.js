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

