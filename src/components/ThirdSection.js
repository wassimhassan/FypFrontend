import React from "react";
import "./ThirdSection.css";
import ProfileCardWelcomepage from "./ProfileCardWelcomepage"; // reuse the card from earlier

const ThirdSection = () => {
  return (
    <section className="third-section">
      <p className="subtitle">Key people</p>
      <h2 className="title">Meet our Teachers</h2>

      <div className="profile-card-container">
        <ProfileCardWelcomepage
          icon="/FekraLogo.png"
          name="John Doe"
          description="Description hello thats me writing to inform you that im testing"
        />
        <ProfileCardWelcomepage
          icon="/FekraLogo.png"
          name="John Doe"
          description="Description hello thats me writing to inform you that im testing"
        />
        <ProfileCardWelcomepage
          icon="/FekraLogo.png"
          name="John Doe"
          description="Description hello thats me writing to inform you that im testing"
        />
      </div>
    </section>
  );
};

export default ThirdSection;
