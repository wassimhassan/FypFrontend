import React from "react";
import "./firstSection.css";
import HeroVisual from "./HeroVisual";
import LeftFirstSection from "./LeftFirstSection"; // ⬅️ Import the new component

const FirstSection = () => {
  return (
    <div className="first-section">
      <LeftFirstSection />
      <HeroVisual />
    </div>
  );
};

export default FirstSection;
