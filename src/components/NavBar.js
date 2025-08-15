import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "./NavBar.css";

function NavBar() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const [user, setUser] = useState(null);

  const goHome = () => {
  navigate(user?.role === "teacher" ? "/teacherHomePage" : "/homepage");
};


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      console.log("✅ Token decoded:", decoded);

      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/auth/auth-check`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log("✅ User fetched:", res.data.user);
          setUser(res.data.user);
        })
        .catch((err) => {
          console.error("❌ Error fetching user:", err);
          localStorage.removeItem("token");
          setUser(null);
        });
    } catch (err) {
      console.error("❌ Error decoding token:", err);
      localStorage.removeItem("token");
      setUser(null);
    }
  }, []);

  const avatar =
    user?.profilePicture && user.profilePicture !== ""
      ? user.profilePicture
      : "/default-avatar.png"; // optional fallback

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img
          src="/logo-removebg-preview.png"
          alt="Logo"
          className="navbar-logo"
          onClick={() => navigate("/homepage")}
          style={{ cursor: "pointer" }}
        />
      </div>

      <div className="nav-links">
        {/* Prefer Link over <a href="#"> to avoid page reloads */}
        <Link to="/WelcomePage#reviews">Reviews</Link>
        <Link to="/about">About</Link>
        <Link to="/resources">Resources</Link>
        <Link to="/support">Support</Link>

        {!user ? (
          <>
            <button className="btn-outline" onClick={() => navigate("/login")}>
              Sign In
            </button>
            <button className="btn-primary" onClick={() => navigate("/signup")}>
              Get Started
            </button>
          </>
        ) : (
          // ✅ Logged-in: always show BOTH Homepage and Profile
          <>

              {/* Show "Courses" only for students */}
            {user?.role === "student" && (
            <button
             className="btn-outline"
             onClick={() => navigate("/courses")}
              >
            Courses
          </button>
          )}
          
            <button
              className="btn-outline"
              onClick={goHome}
            >
              Homepage
            </button>

            <button
              className="profile-button"
              onClick={() => navigate("/profile")}
              title="Your profile"
            >
              <img src={avatar} alt="Profile" className="profile-pic" />
              <span className="username">{user.username}</span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
