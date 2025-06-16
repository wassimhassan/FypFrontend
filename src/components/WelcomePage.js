import React from "react";
import { useNavigate } from "react-router-dom";
import FirstSection from "./firstSection";
import SecondSection from "./SecondSection";

const WelcomePage = () => {
  const navigate = useNavigate();
  return (
    <>
      <FirstSection />
      <SecondSection />
    </>
  );
};

export default WelcomePage;
