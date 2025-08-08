import React from "react";
import { FaMinusCircle } from "react-icons/fa";
import Rating from "@mui/material/Rating";
import "./ReviewCard.css";

const ReviewCard = ({ name, description, image, userId, reviewUserId, onDelete, rating }) => {
  const isOwner = userId === reviewUserId;

  return (
    <div className="review-card">
      {isOwner && (
        <FaMinusCircle
          className="delete-icon"
          title="Delete review"
          onClick={onDelete}
        />
      )}
      <img src={image} alt={name} className="review-image" />
      <h3 className="review-name">{name}</h3>

      {/* ⭐ Display star rating */}
      <Rating
        name="read-only-rating"
        value={rating}
        readOnly
        precision={0.5}
        size="small"
        style={{ margin: "4px 0" }}
      />

      <p className="review-description">{description}</p>
    </div>
  );
};

export default ReviewCard;
