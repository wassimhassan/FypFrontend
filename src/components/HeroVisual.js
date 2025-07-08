import React from "react";
import "./HeroVisual.css";

const HeroVisual = () => {
  return (
    <div className="hero-visual">
      <div className="shape shape1"></div>
      <div className="shape shape2"></div>

      <div className="girl-image">
        <img src="/girlImage.png" alt="Student" />
      </div>

      <div className="speech-bubble top-left">
        Best Courses for High School and college!
      </div>

      <div className="speech-bubble bottom-right">
        19+ Courses <br /> Multiple Categories
      </div>
    </div>
  );
};

export default HeroVisual;
