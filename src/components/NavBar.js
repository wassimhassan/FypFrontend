import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NavBar.css";

function NavBar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

useEffect(() => {
  const userData = localStorage.getItem("user");
  console.log("Fetched from localStorage:", userData); // ✅ Add this

  if (userData) {
    try {
      const parsed = JSON.parse(userData);
      setUser(parsed);
    } catch (err) {
      console.error("Error parsing user data:", err);
    }
  }
}, []);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img
          src="/logo-removebg-preview.png"
          alt="Logo"
          className="navbar-logo"
        />
      </div>

      <div className="nav-links">
        <a href="#">About</a>
        <a href="#">Resources</a>
        <a href="#">Support</a>

        {!user ? (
          <>
            <button className="btn-outline" onClick={() => navigate("/login")}>
              Sign In
            </button>
            <button className="btn-primary">Get Started</button>
          </>
        ) : (
          <button className="profile-button" onClick={() => navigate("/profile")}>
            <img
              src={user.profilePic || "/default-avatar.png"}
              alt="Profile"
              className="profile-pic"
            />
            <span className="username">{user.username}</span>
          </button>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
