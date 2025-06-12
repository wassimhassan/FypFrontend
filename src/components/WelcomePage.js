import React from "react";
import { useNavigate } from "react-router-dom";
import FirstSection from "./firstSection";

const WelcomePage = () => {
  const navigate = useNavigate();
  return (
    <FirstSection />
  );
};

export default WelcomePage;
