import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ReviewForm from "./ReviewForm";
import { useAuth } from "../contexts/AuthContext";

const DoctorReviews = ({ doctorId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (doctorId) {
      fetchReviews();
    }
  }, [doctorId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/reviews/doctor/${doctorId}`);
      setReviews(response.data.reviews);
      setAverageRating(response.data.averageRating);
      setTotalReviews(response.data.totalReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmitted = () => {
    fetchReviews();
    setShowReviewForm(false);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          style={{
            color: i <= rating ? "#FFD700" : "#ccc",
            fontSize: "16px",
            marginRight: "2px",
          }}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Patient Reviews</h2>
        <div style={styles.ratingInfo}>
          <div style={styles.averageRating}>
            {renderStars(averageRating)}
            <span style={styles.ratingText}>
              {averageRating.toFixed(1)} ({totalReviews} reviews)
            </span>
          </div>
          {user?.role === "patient" && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              style={styles.writeReviewBtn}
            >
              {showReviewForm ? "Cancel" : "Write a Review"}
            </button>
          )}
        </div>
      </div>

      {showReviewForm && (
        <ReviewForm
          doctorId={doctorId}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}

      {loading ? (
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
        </div>
      ) : reviews.length > 0 ? (
        <div style={styles.reviewsList}>
          {reviews.map((review) => (
            <div key={review._id} style={styles.reviewCard}>
              <div style={styles.reviewHeader}>
                <div style={styles.reviewerInfo}>
                  <img
                    src={
                      review.patient.profilePic ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt={review.patient.fullName}
                    style={styles.reviewerPic}
                  />
                  <div>
                    <p style={styles.reviewerName}>{review.patient.fullName}</p>
                    <p style={styles.reviewDate}>
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
                <div>{renderStars(review.rating)}</div>
              </div>
              <p style={styles.reviewComment}>{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <p style={styles.noReviews}>
          No reviews yet. Be the first to review this doctor!
        </p>
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    marginTop: "20px",
  },
  header: {
    marginBottom: "20px",
  },
  title: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "10px",
  },
  ratingInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
  },
  averageRating: {
    display: "flex",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: "10px",
    fontSize: "16px",
    color: "#555",
  },
  writeReviewBtn: {
    backgroundColor: "#4A90E2",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    padding: "20px",
  },
  spinner: {
    width: "30px",
    height: "30px",
    border: "3px solid #f3f3f3",
    borderTop: "3px solid #4A90E2",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  reviewsList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  reviewCard: {
    backgroundColor: "#f8f9fa",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  reviewHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "10px",
  },
  reviewerInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  reviewerPic: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  reviewerName: {
    fontWeight: "bold",
    margin: 0,
  },
  reviewDate: {
    color: "#777",
    fontSize: "14px",
    margin: "3px 0 0 0",
  },
  reviewComment: {
    margin: "0",
    lineHeight: "1.5",
  },
  noReviews: {
    textAlign: "center",
    color: "#777",
    fontStyle: "italic",
    padding: "20px 0",
  },
};

export default DoctorReviews;
