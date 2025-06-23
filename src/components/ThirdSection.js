import React from "react";
import "./ThirdSection.css";
import ProfileCard from "./ProfileCard"; // reuse the card from earlier

const ThirdSection = () => {
  return (
    <section className="third-section">
      <p className="subtitle">Key people</p>
      <h2 className="title">Meet our Teachers</h2>

      <div className="profile-card-container">
        <ProfileCard
          icon="/FekraLogo.png"
          name="John Doe"
          description="Description hello thats me writing to inform you that im testing"
        />
        <ProfileCard
          icon="/FekraLogo.png"
          name="John Doe"
          description="Description hello thats me writing to inform you that im testing"
        />
        <ProfileCard
          icon="/FekraLogo.png"
          name="John Doe"
          description="Description hello thats me writing to inform you that im testing"
        />
      </div>
    </section>
  );
};

export default ThirdSection;
