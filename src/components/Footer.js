import React from "react";
import "./Footer.css";

function Footer() {
  return (
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
      <div className="footer-copy">
        © 2025 FEKRA. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
