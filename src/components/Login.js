import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsLoggingIn = () => {} }) => {
  /* -------------------------------------------------- hooks */
  const navigate = useNavigate();
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [error, setError]               = useState("");
  const [loading, setLoading]           = useState(false);
  const [showForgot, setShowForgot]     = useState(false);
  const [forgotEmail, setForgotEmail]   = useState("");
  const [resetMsg, setResetMsg]         = useState("");

  /* -------------------------------------------------- mount */
  useEffect(() => {
    setIsLoggingIn(true);
    return () => setIsLoggingIn(false);
  }, [setIsLoggingIn]);

  /* -------------------------------------------------- helpers */
  const roleDest = {
    student: "/student",
    teacher: "/teacher",
    admin  : "/admin",
  };

  /* -------------------------------------------------- handlers */
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

      // decode once instead of trusting backend payload blindly
      const { role, id: userId } = jwtDecode(token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);

      navigate(roleDest[role] || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
      setForgotEmail(email);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetMsg("");
    setError("");
    setLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/reset-password`,
        { email: forgotEmail }
      );
      setResetMsg("If that e‑mail exists, a reset link was sent.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };


  /* -------------------------------------------------- render */
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="forgot-password">
            <button
              type="button"
              className="link-button"
              onClick={() => {
                setForgotEmail(email);
                setShowForgot(true);
              }}
            >
              Forgot password?
            </button>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>


      </div>

      {showForgot && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Reset Password</h3>
            <p>Enter your e‑mail to receive a reset link:</p>
            <input
              type="email"
              placeholder="Enter your e‑mail"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required
            />
            {resetMsg && <p className="success-message">{resetMsg}</p>}
            {error && <p className="error-message">{error}</p>}
            <button onClick={handleForgotPassword} disabled={loading}>
              {loading ? "Sending…" : "Send reset link"}
            </button>
            <button onClick={() => setShowForgot(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
