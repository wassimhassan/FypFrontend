"use client";

import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./Login.css";
import eyeOpen from "../assets/eye.png";
import eyeClosed from "../assets/eyebrow.png";

export default function Login({ setIsLoggingIn = () => {} }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
const [showPassword, setShowPassword] = useState(false);

  // Forgot password modal
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetMsg, setResetMsg] = useState("");

  useEffect(() => {
    setIsLoggingIn(true);
    return () => setIsLoggingIn(false);
  }, [setIsLoggingIn]);

  // Disable page scroll while modal is open + ESC to close
  useEffect(() => {
    document.body.style.overflow = showForgot ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showForgot]);

  const onEsc = useCallback((e) => {
    if (e.key === "Escape") setShowForgot(false);
  }, []);
  useEffect(() => {
    if (!showForgot) return;
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [showForgot, onEsc]);

// put this near the top of your component
const roleDest = {
  student: "/homePage",
  teacher: "/teacherHomePage",
  admin: "/admin",
};

const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);
  try {
    localStorage.clear();
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/auth/login`,
      { email, password }
    );

    const { token } = res.data;
    localStorage.setItem("token", token);

    const { role, id: userId } = jwtDecode(token);
    localStorage.setItem("role", role);
    localStorage.setItem("userId", userId);

    // 👇 redirect based on role
    navigate(roleDest[role] || "/homePage", { replace: true });
  } catch (err) {
    setError(err.response?.data?.message || "Login failed. Try again.");
    setForgotEmail(email);
  } finally {
    setLoading(false);
  }
};

  const handleForgotPassword = async () => {
    setResetMsg("");
    setError("");
    setLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/reset-password`,
        { email: forgotEmail }
      );
      setResetMsg("If that e-mail exists, a reset link was sent.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Login-container">
      <div className="Login-logo-box">
        <img src="/logo_fekra.jpeg" alt="Fekra logo" />
      </div>

      <div className="Login-form-box">
        <h1>Login</h1>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

<div className="password-wrapper">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />

  <img
    src={showPassword ? eyeOpen : eyeClosed}
    alt="Toggle visibility"
    className="toggle-eye-img"
    onClick={() => setShowPassword(!showPassword)}
  />
</div>




          {error && <p className="error-message">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>

        <div className="Login-data">
          <p>
            Don&apos;t have an account?{" "}
            <Link to="/signup" style={{ color: "inherit", textDecoration: "underline" }}>
              Create one here
            </Link>
          </p>

          <p
            className="link-button"
            onClick={() => {
              setForgotEmail(email);
              setShowForgot(true);
            }}
          >
            Forgot password?
          </p>
        </div>
      </div>

      {/* Reset-password modal */}
      {showForgot && (
        <div className="modal-overlay" onClick={() => setShowForgot(false)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 id="reset-title">Reset Password</h3>
              <button
                className="modal-close"
                onClick={() => setShowForgot(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <p>Enter your e-mail to receive a reset link:</p>
              <input
                autoFocus
                type="email"
                placeholder="Enter your e-mail"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />
              {resetMsg && <p className="success-message">{resetMsg}</p>}
              {error && <p className="error-message">{error}</p>}
            </div>

            <div className="modal-actions">
              <button
                className="btn-primary"
                onClick={handleForgotPassword}
                disabled={loading}
              >
                {loading ? "Sending…" : "Send reset link"}
              </button>
              <button className="btn-secondary" onClick={() => setShowForgot(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
