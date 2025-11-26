import React from "react";
import "./AboutPage.css";
import { FaUsers, FaBookOpen, FaGlobe, FaHandsHelping } from "react-icons/fa";

export default function AboutPage() {
  return (
    <div className="about-container">
      
      {/* HEADER */}
      <section className="about-hero fade-in">
        <h1>About FEKRA</h1>
        <p>
          FEKRA is a student-focused educational initiative dedicated to empowering 
          youth through opportunities, guidance, and accessible learning resources.
        </p>
      </section>

      {/* MISSION SECTION */}
      <section className="about-section fade-up">
        <h2>Our Mission</h2>
        <p className="about-paragraph">
          Since 2021, FEKRA has been committed to supporting students in Lebanon 
          and beyond by offering scholarship opportunities, academic preparation, 
          career guidance, and skill development programs.
        </p>

        <div className="about-cards">
          <div className="about-card hover-pop">
            <FaBookOpen className="about-icon" />
            <h3>Educational Access</h3>
            <p>Providing essential learning opportunities for every student.</p>
          </div>

          <div className="about-card hover-pop">
            <FaUsers className="about-icon" />
            <h3>Community Growth</h3>
            <p>Building a strong community of learners and volunteers.</p>
          </div>

          <div className="about-card hover-pop">
            <FaHandsHelping className="about-icon" />
            <h3>Student Support</h3>
            <p>Helping students through mentorship, guidance, and resources.</p>
          </div>

          <div className="about-card hover-pop">
            <FaGlobe className="about-icon" />
            <h3>Wide Impact</h3>
            <p>Connecting students with opportunities locally and globally.</p>
          </div>
        </div>
      </section>

      {/* VALUES SECTION */}
      <section className="about-section fade-up">
        <h2>Our Values</h2>
        <ul className="values-list">
          <li>✨ Inclusivity — Every student deserves an opportunity</li>
          <li>📘 Education — Knowledge changes lives</li>
          <li>🌍 Community — We grow stronger together</li>
          <li>💙 Support — Guiding every student toward a brighter future</li>
        </ul>
      </section>
            {/* COLLABORATIONS SECTION */}
      <section className="about-section fade-up">
        <h2>Our Collaborations</h2>
        <p className="about-paragraph">
          FEKRA proudly collaborates with leading universities, NGOs, and educational 
          organizations to expand learning opportunities and empower students.
        </p>

        <div className="collab-grid">
          {[
            "Palestinian Student Funds", "ToRead", "U-Link", "Life Sculptor",
            "Tawwoun", "Young Take Action NGO", "ULYP NGO", "01Tutor",
            "Lion Lot", "Don’t Forget", "Leper X", "Lebanese University",
            "USJ University", "PWHO", "Leonard Education Organization",
            "AGC", "Injaz", "LAU", "AUB", "BAU", "EMU",
            "Amidest", "Harmony Smile Clinic", "Murex"
          ].map((item, i) => (
            <div key={i} className="collab-card hover-pop">
              {item}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
