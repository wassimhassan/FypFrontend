import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FirstSection from "./firstSection";
import SecondSection from "./SecondSection";
import ThirdSection from "./ThirdSection";
import FourthSection from "./FourthSection";
import Footer from "./Footer";
import NavBar from "./NavBar";

const WelcomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#reviews") {
      const el = document.getElementById("reviews");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <>
    
      <NavBar />
      <FirstSection />
      <SecondSection />
      <ThirdSection />
      <FourthSection />
      <Footer />
    </>
  );
};

export default WelcomePage;
