import React from "react";
import { useNavigate } from "react-router-dom";
import FirstSection from "./firstSection";
import SecondSection from "./SecondSection";
import ThirdSection from "./ThirdSection";
import FourthSection from "./FourthSection";
import Footer from "./Footer";
import NavBar from "./NavBar";

const WelcomePage = () => {
  const navigate = useNavigate();
  return (
    <>
    <NavBar/> 
      <FirstSection />
      <SecondSection />
      <ThirdSection />
    <FourthSection/> 
    <Footer/> 
    </>
  );
};

export default WelcomePage;
