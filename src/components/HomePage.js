import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import background from '../assets/background.png';
import "./HomePage.css";
import { FaGraduationCap, FaBriefcase, FaUniversity, FaLaptopCode} from "react-icons/fa";
import { FiCalendar, FiUsers } from 'react-icons/fi';
import ScholarshipsTab from './ScholarshipsTab';
import Footer from './Footer';
import NavBar from './NavBar';
import CoursesTab from './CoursesTab';
import CareersTab from './CareersTab';
import UniversitiesTab from './UniversitiesTab';

const tabs = [
    { name: "Scholarships", icon: <FaGraduationCap /> },
    { name: "Careers", icon: <FaBriefcase /> },
    { name: "Universities", icon: <FaUniversity /> },
    { name: "Courses", icon: <FaLaptopCode /> },
];

export default function HomePage() {
    const [activeTab, setActiveTab] = useState("Scholarships");
    const navigate = useNavigate();  

    return (
        <div className="home-container">
            {/* Navbar */}
      <NavBar />

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content-background">
                    <h1>Your Gateway to</h1>
                    <p>
                        Discover scholarships, explore career opportunities, find the perfect university,
                        and advance your skills with our comprehensive educational platform.
                    </p>
                    <div className="hero-buttons">
                        <button className="search-btn">
                            <img src="/search.png" alt="Search" className="search-icon" />
                        </button>
                        <button className="btn-learnmore">Learn More</button>
                    </div>
                </div>

                {/* Tab Menu */}
                <div className="hero-tab-wrapper">
                    <div className="tab-menu">
                        {tabs.map((tab) => (
                            <button
                                key={tab.name}
                                onClick={() => setActiveTab(tab.name)}
                                className={`tab-button ${activeTab === tab.name ? "active" : ""}`}
                            >
                                <span className="tab-icon">{tab.icon}</span>
                                <span>{tab.name}</span>
                            </button>
                        ))}
                    </div>
                </div>


                {/* Tab Content */}
                {activeTab === "Scholarships" && <ScholarshipsTab />}
                {activeTab === "Courses" && <CoursesTab />}
                {activeTab === "Careers" && <CareersTab />}
                {activeTab === "Universities" && <UniversitiesTab />}
            </section>

            {/* Stats Section */}
            <section className="stats">
                <div className="stat-box">
                    <div className="stat-number">10K+</div>
                    <div className="stat-label">Scholarships Available</div>
                </div>
                <div className="stat-box">
                    <div className="stat-number">5K+</div>
                    <div className="stat-label">Career Opportunities</div>
                </div>
                <div className="stat-box">
                    <div className="stat-number">500+</div>
                    <div className="stat-label">Partner Universities</div>
                </div>
                <div className="stat-box">
                    <div className="stat-number">1K+</div>
                    <div className="stat-label">Online Courses</div>
                </div>
            </section>

           <Footer/> 
        </div>
    );
}
