import React from "react";
import "./LeftFirstSection.css";
import { useNavigate } from "react-router-dom";

const LeftFirstSection = () => {
  const navigate = useNavigate();

  // (optional) tiny helper to reject expired JWTs
  const isTokenValid = (token) => {
    if (!token) return false;
    try {
      const [, payload] = token.split(".");
      const { exp } = JSON.parse(atob(payload));
      return typeof exp === "number" ? Date.now() < exp * 1000 : true;
    } catch {
      return false;
    }
  };

  const handleGetStarted = () => {
    const token = localStorage.getItem("token");
    if (isTokenValid(token)) {
      navigate("/homePage");
    } else {
      // send where we wanted to go, so login can redirect back
      navigate("/login", { state: { from: "/homePage" }, replace: true });
    }
  };

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

      <button className="get-started-btn" onClick={handleGetStarted}>
        Get Started
      </button>
    </div>
  );
};

export default LeftFirstSection;
