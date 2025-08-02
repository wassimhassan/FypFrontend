import React from "react";
import { useNavigate } from "react-router-dom";
import FirstSection from "./firstSection";
import SecondSection from "./SecondSection";
import ThirdSection from "./ThirdSection";
import FourthSection from "./FourthSection";

const WelcomePage = () => {
  const navigate = useNavigate();
  return (
    <>
    
      <FirstSection />
      <SecondSection />
      <ThirdSection />
    <FourthSection/> 
    </>
  );
};

export default WelcomePage;
