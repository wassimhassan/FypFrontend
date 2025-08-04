import React, { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";
import axios from "axios";
import "./FourthSection.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const FourthSection = () => {
  const [reviews, setReviews] = useState([]);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [newReview, setNewReview] = useState("");
  const [expandedReview, setExpandedReview] = useState(null);
const [reviewToDelete, setReviewToDelete] = useState(null);

  // Fetch reviews
  const fetchReviews = () => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/reviews`)
      .then((res) => setReviews(res.data))
      .catch((err) => console.error("Failed to fetch reviews", err));
  };

  useEffect(fetchReviews, []);
const [userId, setUserId] = useState(null);

useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const { id } = JSON.parse(atob(token.split(".")[1]));
      setUserId(id);
    } catch (err) {
      console.error("Invalid token", err);
    }
  }
}, []);

  // Rotate reviews every 8s
  useEffect(() => {
    if (reviews.length <= 3) return;
    const interval = setInterval(() => {
      setVisibleIndex(prev => (prev + 3) % reviews.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [reviews]);

  const handleSubmitReview = () => {
    const token = localStorage.getItem("token");
    if (!token || !newReview.trim()) return;

// Submit Review
axios.post(
  `${process.env.REACT_APP_BACKEND_URL}/api/reviews`,
  { text: newReview },
  { headers: { Authorization: `Bearer ${token}` } }
)
.then(() => {
  fetchReviews();
  setVisibleIndex(0);
  setShowModal(false);
  setNewReview("");
  toast.success("Review added successfully!");
})
.catch((err) => {
  console.error("Failed to submit review", err);
  toast.error("Failed to add review.");
});

  };
const handleDeleteReview = (reviewId) => {
  const token = localStorage.getItem("token");
  if (!token) return;
// Delete Review
axios
  .delete(`${process.env.REACT_APP_BACKEND_URL}/api/reviews/${reviewId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  .then(() => {
    fetchReviews();
    toast.success("Review deleted!");
  })
  .catch((err) => {
    console.error("Failed to delete review", err);
    toast.error("Couldn't delete review.");
  });

};

  const visibleReviews = reviews.slice(visibleIndex, visibleIndex + 3);

  return (
    <section id="reviews" className="fourth-section">
      <p className="subtitle">What People Say</p>
      <h2 className="title">Student Reviews</h2>
      <p className="section-description">
        Hear from our community of students who have benefited from our platform and achieved their educational goals.
      </p>
<div className="review-carousel-container">
  <FaChevronLeft
    className="arrow-icon left"
    onClick={() =>
      setVisibleIndex((prev) =>
        prev === 0 ? Math.max(reviews.length - 3, 0) : prev - 3
      )
    }
  />
  
  <div className="review-cards">
    {visibleReviews.map((r) => {
      const reviewUserId = typeof r.user === "object" ? r.user._id : r.user;
      return (
        <div key={r._id} onClick={() => setExpandedReview(r)}>
          <ReviewCard
            name={r.username}
            description={r.text}
            image={r.profilePicture}
            userId={userId}
            reviewUserId={reviewUserId}
            onDelete={(e) => {
              e.stopPropagation();
              setReviewToDelete(r);
            }}
          />
        </div>
      );
    })}
  </div>

  <FaChevronRight
    className="arrow-icon right"
    onClick={() =>
      setVisibleIndex((prev) =>
        prev + 3 >= reviews.length ? 0 : prev + 3
      )
    }
  />
</div>

      <button className="write-review-btn" onClick={() => setShowModal(true)}>
        Write a Review
      </button>

   {/* Write Modal */}
{showModal && (
  <div className="review-modal" onClick={() => setShowModal(false)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <button className="close-button" onClick={() => setShowModal(false)}>×</button>
      <h3>Write a Review</h3>
      <textarea
        placeholder="Your review..."
        value={newReview}
        onChange={(e) => setNewReview(e.target.value)}
      />
      <div className="modal-actions">
        <button onClick={handleSubmitReview}>Submit</button>
      </div>
    </div>
  </div>
)}

{/* Expanded Review Modal */}
{expandedReview && (
  <div className="review-modal" onClick={() => setExpandedReview(null)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <button className="close-button" onClick={() => setExpandedReview(null)}>×</button>
      <img
        src={expandedReview.profilePicture}
        alt="Profile"
        className="review-image"
        style={{ width: "100px", height: "100px", marginBottom: "10px" }}
      />
      <h3>{expandedReview.username}</h3>
      <p style={{
        marginTop: "15px",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        fontSize: "15px",
        color: "#475569"
      }}>
        {expandedReview.text}
      </p>
      <div className="modal-actions">
      </div>
    </div>
  </div>
)}
{reviewToDelete && (
  <div className="review-modal" onClick={() => setReviewToDelete(null)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <button className="close-button" onClick={() => setReviewToDelete(null)}>×</button>
      <h3>Are you sure you want to delete this review?</h3>
      <p style={{ margin: "15px 0", color: "#475569" }}>{reviewToDelete.text}</p>
      <div className="modal-actions">
        <button
          onClick={() => {
            handleDeleteReview(reviewToDelete._id);
            setReviewToDelete(null);
          }}
          style={{ backgroundColor: "#d9534f", color: "white" }}
        >
          Yes, Delete
        </button>
        <button onClick={() => setReviewToDelete(null)}>Cancel</button>
      </div>
    </div>
  </div>
)}

<ToastContainer
  position="top-right"
  autoClose={2500}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="colored"
/>

    </section>
    
  );
};

export default FourthSection;
