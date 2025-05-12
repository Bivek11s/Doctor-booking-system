import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";

const PatientReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.role === "patient") {
      fetchPatientReviews();
    }
  }, [user]);

  const fetchPatientReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/reviews/patient?patientId=${user.id}`
      );
      setReviews(response.data.reviews);
    } catch (error) {
      console.error("Error fetching patient reviews:", error);
      toast.error("Failed to load your reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (review) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setEditRating(5);
    setEditComment("");
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();
    if (!editingReview) return;

    try {
      setIsSubmitting(true);
      await axios.put(`/api/reviews/${editingReview._id}`, {
        rating: editRating,
        comment: editComment,
      });
      toast.success("Review updated successfully");
      fetchPatientReviews();
      handleCancelEdit();
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error(error.response?.data?.message || "Failed to update review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await axios.delete(`/api/reviews/${reviewId}`, {
        data: {
          userId: user.id,
          userRole: user.role,
        },
      });
      toast.success("Review deleted successfully");
      fetchPatientReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error(error.response?.data?.message || "Failed to delete review");
    }
  };

  const renderStars = (rating, isEditable = false, setRatingFn = null) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          onClick={isEditable ? () => setRatingFn(i) : undefined}
          style={{
            cursor: isEditable ? "pointer" : "default",
            color: i <= rating ? "#FFD700" : "#ccc",
            fontSize: isEditable ? "24px" : "16px",
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

  if (!user || user.role !== "patient") {
    return (
      <div style={styles.container}>
        <p style={styles.message}>Only patients can view their reviews.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>My Reviews</h2>

      {loading ? (
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
        </div>
      ) : reviews.length > 0 ? (
        <div style={styles.reviewsList}>
          {reviews.map((review) => (
            <div key={review._id} style={styles.reviewCard}>
              {editingReview && editingReview._id === review._id ? (
                <form onSubmit={handleUpdateReview} style={styles.editForm}>
                  <div style={styles.ratingContainer}>
                    <label style={styles.label}>Rating:</label>
                    <div>{renderStars(editRating, true, setEditRating)}</div>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Comment:</label>
                    <textarea
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      style={styles.textarea}
                      required
                    />
                  </div>

                  <div style={styles.buttonGroup}>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      style={styles.cancelButton}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      style={{
                        ...styles.saveButton,
                        opacity: isSubmitting ? 0.7 : 1,
                      }}
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div style={styles.reviewHeader}>
                    <div style={styles.doctorInfo}>
                      <img
                        src={
                          review.doctor.profilePic ||
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        alt={review.doctor.fullName}
                        style={styles.doctorPic}
                      />
                      <div>
                        <p style={styles.doctorName}>
                          {review.doctor.fullName}
                        </p>
                        <p style={styles.specialty}>
                          {review.doctor.doctorSpecialty}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div>{renderStars(review.rating)}</div>
                      <p style={styles.reviewDate}>
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  </div>
                  <p style={styles.reviewComment}>{review.comment}</p>
                  <div style={styles.actionButtons}>
                    <button
                      onClick={() => handleEditClick(review)}
                      style={styles.editButton}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      style={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p style={styles.noReviews}>
          You haven't written any reviews yet. When you review a doctor, it will
          appear here.
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
    maxWidth: "800px",
    margin: "20px auto",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "20px",
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
  },
  message: {
    textAlign: "center",
    color: "#666",
    padding: "20px 0",
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
  doctorInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  doctorPic: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  doctorName: {
    fontWeight: "bold",
    margin: 0,
  },
  specialty: {
    color: "#666",
    margin: "3px 0 0 0",
    fontSize: "14px",
  },
  reviewDate: {
    color: "#777",
    fontSize: "14px",
    textAlign: "right",
    margin: "5px 0 0 0",
  },
  reviewComment: {
    margin: "10px 0",
    lineHeight: "1.5",
  },
  actionButtons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "10px",
  },
  editButton: {
    backgroundColor: "#4A90E2",
    color: "white",
    padding: "6px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    color: "white",
    padding: "6px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  editForm: {
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
  buttonGroup: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },
  cancelButton: {
    backgroundColor: "#6c757d",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  saveButton: {
    backgroundColor: "#28a745",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  noReviews: {
    textAlign: "center",
    color: "#777",
    fontStyle: "italic",
    padding: "20px 0",
  },
};
export default PatientReviews;
