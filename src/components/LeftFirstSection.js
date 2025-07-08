import React from "react";
import "./LeftFirstSection.css";

const LeftFirstSection = () => {
  return (
    <div className="left-first-section">
      <div className="logo">
        <img src="/FekraLogo.png" alt="FEKRA Logo" />
      </div>

<h1>
  A <span className="bold">bold</span> step toward empowering students with equal access to education and opportunity
</h1>



      <p className="subtext">
        Access programs anytime, with <br />
        flexible learning on both mobile and <br />
        desktop devices
      </p>

      <button className="get-started-btn">Get Sarted</button>
    </div>
  );
};

export default LeftFirstSection;
