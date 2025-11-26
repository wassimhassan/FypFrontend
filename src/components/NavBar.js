import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "./NavBar.css";

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
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
      : "/default-avatar.png";

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img
          src="/logo-removebg-preview.png"
          alt="Logo"
          className="navbar-logo"
          onClick={goHome}
          role="button"
          aria-label="Go to homepage"
        />
      </div>

      <div className="nav-links">
        <NavLink to="/chatbot" className="nav-item">
          ChatBot
        </NavLink>
        <NavLink to="/WelcomePage#reviews" className="nav-item">
          Reviews
        </NavLink>
        <NavLink to="/about" className="nav-item">
          About
        </NavLink>
        
        <NavLink to="/calendar" className="nav-item">
          Calendar
        </NavLink>

        {!user ? (
          <>
            <button className="btn btn-outline" onClick={() => navigate("/login")}>
              Sign In
            </button>
            <button className="btn btn-primary" onClick={() => navigate("/signup")}>
              Get Started
            </button>
          </>
        ) : (
          <>
            {user?.role === "student" && (
              <button className="btn btn-outline" onClick={() => navigate("/courses")}>
                Courses
              </button>
            )}

            <button className="btn btn-ghost" onClick={goHome}>
              Homepage
            </button>

            <button
              className="profile-button"
              onClick={() => navigate("/profile")}
              title="Your profile"
            >
              <img src={avatar} alt="Profile" className="profile-pic" />
              <span className="username">{user?.username}</span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
