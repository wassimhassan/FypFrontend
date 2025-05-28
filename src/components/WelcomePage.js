import React from "react";
import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="welcome-container">
      <div className="back-button" onClick={() => navigate("/")}>Back</div>
      <div className="overlay">
        <h1>Welcome!</h1>
        <div className="buttons">
          <button className="btn" onClick={() => navigate("/signup")}>Sign Up</button>
          <button className="btn secondary" onClick={() => navigate("/login")}>Already have an account? Log In</button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;