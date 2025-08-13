import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "./NavBar.css";
import { Link } from "react-router-dom";


function NavBar() {
  const navigate = useNavigate();
  const location   = useLocation();               // ⬅️ get current route
  const onProfile  = location.pathname.startsWith("/profile"); // ⬅️ are we on profile?
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("✅ Token decoded:", decoded);

        // 🔥 Fetch full user info using /auth-check
axios
  .get(`${process.env.REACT_APP_BACKEND_URL}/api/auth/auth-check`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .then((res) => {
    console.log("✅ User fetched:", res.data.user); // ✅ updated
    setUser(res.data.user); // ✅ only set the user part
  })
  .catch((err) => {
    console.error("❌ Error fetching user:", err);
    localStorage.removeItem("token");
  });

      } catch (err) {
        console.error("❌ Error decoding token:", err);
        localStorage.removeItem("token");
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
    <Link to="/WelcomePage#reviews">Reviews</Link>
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
          ) : onProfile ? (
          // ⬇️ When on /profile, show Homepage instead of the profile chip
          <button className="btn-outline" onClick={() => navigate("/homepage")}>Homepage</button>
        ) : (
          <button className="profile-button" onClick={() => navigate("/profile")}>
            <img
              src={user.profilePicture }
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
