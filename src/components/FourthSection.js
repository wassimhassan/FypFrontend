import React from "react";
import ReviewCard from "./ReviewCard";
import "./FourthSection.css";

const FourthSection = () => {
  return (
    <div className="fourth-section">
      <p className="subtitle">What people say</p>
      <h2 className="title">Reviews</h2>

      <div className="review-cards">
        <ReviewCard
          name="John Doe"
          description="its really an amazing website, i hope everyone will benefit"
          image="/FekraLogo.png"
        />
        <ReviewCard
          name="Jane Smith"
          description="great resources and easy to use!"
          image="/FekraLogo.png"
        />
        <ReviewCard
          name="Ali Khoury"
          description="awesome initiative, very useful content."
          image="/FekraLogo.png"
        />
      </div>

      <button className="write-review-btn">Write a review</button>
    </div>
  );
};

export default FourthSection;
