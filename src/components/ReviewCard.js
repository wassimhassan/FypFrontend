import React from "react";
import "./ReviewCard.css";

const ReviewCard = ({ name, description, image }) => {
  return (
    <div className="review-card">
      <img src={image} alt={name} className="review-image" />
      <h3 className="review-name">{name}</h3>
      <p className="review-description">{description}</p>
    </div>
  );
};

export default ReviewCard;
