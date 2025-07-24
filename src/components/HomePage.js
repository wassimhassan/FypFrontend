

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import background from '../assets/background.png';
import "./HomePage.css";
import { FaGraduationCap, FaBriefcase, FaUniversity, FaLaptopCode} from "react-icons/fa";
import { FiCalendar, FiUsers } from 'react-icons/fi';


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
            <nav className="navbar">
                <div className="navbar-left">
                    <img src="/logo-removebg-preview.png" alt="Logo" className="navbar-logo" />
                </div>
                <div className="nav-links">
                    <a href="#">About</a>
                    <a href="#">Resources</a>
                    <a href="#">Support</a>
                    <button className="btn-outline" onClick={() => navigate('/login')}>Sign In</button> {/* <-- Navigate on click */}
                    <button className="btn-primary">Get Started</button>
                </div>
            </nav>

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
                {activeTab === "Scholarships" && (
                    <div className="tab-content">
                        <h2>Scholarship Opportunities</h2>
                        <p>
                            Find and apply for scholarships that match your academic achievements and career goals.
                        </p>
                        <div className="card-grid">
                            <div className="card">
                                <div className="card-header">
                                    <div className="badge">Full Tuition</div>
                                    <div className="amount">$25,000</div>
                                </div>
                                <h3>Merit Excellence Scholarship</h3>
                                <p>Outstanding academic performance and leadership potential</p>
                                <div className="card-icons">
                                    <span><FiCalendar /></span>
                                    <span><FiUsers /></span>
                                </div>
                                <button className="btn-primary">Apply Now</button>
                            </div>
                            <div className="card">
                                <div className="card-header">
                                    <div className="badge">Renewable</div>
                                    <div className="amount">$15,000</div>
                                </div>
                                <h3>STEM Innovation Grant</h3>
                                <p>Supporting students pursuing Science, Technology, Engineering, and Mathematics</p>
                                <div className="card-icons">
                                    <span><FiCalendar /></span>
                                    <span><FiUsers /></span>
                                </div>
                                <button className="btn-primary">Apply Now</button>
                            </div>
                            <div className="card">
                                <div className="card-header">
                                    <div className="badge">Need-Based</div>
                                    <div className="amount">$10,000</div>
                                </div>
                                <h3>Community Leader Award</h3>
                                <p>Recognizing students who have made significant community impact</p>
                                <div className="card-icons">
                                    <span><FiCalendar /></span>
                                    <span><FiUsers /></span>
                                </div>
                                <button className="btn-primary">Apply Now</button>
                            </div>
                        </div>
                    </div>
                )}
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

            {/* Footer */}
            <footer className="footer">
                <div className="footer-grid">
                    <div>
                        <h4>FEKRA</h4>
                        <p>Your gateway to educational excellence and career success.</p>
                    </div>
                    <div>
                        <h4>Resources</h4>
                        <ul>
                            <li>Scholarship Guide</li>
                            <li>Career Advice</li>
                            <li>University Rankings</li>
                            <li>Course Catalog</li>
                        </ul>
                    </div>
                    <div>
                        <h4>Support</h4>
                        <ul>
                            <li>Help Center</li>
                            <li>Contact Us</li>
                            <li>Privacy Policy</li>
                            <li>Terms of Service</li>
                        </ul>
                    </div>
                    <div>
                        <h4>Connect</h4>
                        <ul>
                            <li>Newsletter</li>
                            <li>Blog</li>
                            <li>Social Media</li>
                            <li>Community</li>
                        </ul>
                    </div>
                </div>
                <div className="footer-copy">© 2025 FEKRA. All rights reserved.</div>
            </footer>
        </div>
    );
}
