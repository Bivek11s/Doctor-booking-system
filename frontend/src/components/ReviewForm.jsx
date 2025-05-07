import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";

const ReviewForm = ({ doctorId, appointmentId, onReviewSubmitted }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to submit a review");
      return;
    }

    if (rating < 1 || rating > 5) {
      toast.error("Rating must be between 1 and 5");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please provide a comment");
      return;
    }

    // Ensure we have a valid patient ID
    const patientId = user.id || user._id;
    if (!patientId) {
      toast.error("Unable to identify patient. Please try logging in again.");
      console.error("Patient ID missing in user object:", user);
      return;
    }

    if (!doctorId) {
      toast.error("Doctor ID is required");
      return;
    }

    try {
      setIsSubmitting(true);
      const reviewData = {
        rating,
        comment,
        doctorId,
        appointmentId,
        patientId, // Use the validated patient ID
      };

      console.log("Submitting review with data:", reviewData);

      await axios.post("/api/reviews", reviewData);
      toast.success("Review submitted successfully");
      setRating(5);
      setComment("");
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          onClick={() => setRating(i)}
          style={{
            cursor: "pointer",
            color: i <= rating ? "#FFD700" : "#ccc",
            fontSize: "24px",
            marginRight: "5px",
          }}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  if (!user || user.role !== "patient") {
    return null;
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Write a Review</h3>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.ratingContainer}>
          <label style={styles.label}>Rating:</label>
          <div>{renderStars()}</div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Comment:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={styles.textarea}
            placeholder="Share your experience with this doctor..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            ...styles.button,
            opacity: isSubmitting ? 0.7 : 1,
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#f8f9fa",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "20px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "15px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  ratingContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  label: {
    fontWeight: "bold",
    color: "#555",
  },
  textarea: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    minHeight: "100px",
    resize: "vertical",
  },
  button: {
    backgroundColor: "#4A90E2",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "4px",
    fontWeight: "bold",
    alignSelf: "flex-end",
  },
};

export default ReviewForm;
