import React from "react";
import { FaMinusCircle } from "react-icons/fa";
import "./ReviewCard.css";

const ReviewCard = ({ name, description, image, userId, reviewUserId, onDelete }) => {
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
      <p className="review-description">{description}</p>
    </div>
  );
};

export default ReviewCard;
