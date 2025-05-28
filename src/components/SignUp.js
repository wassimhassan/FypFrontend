import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") || "student";
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState(initialRole);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { setRole(initialRole); }, [initialRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/signup`, {
        username,
        email,
        password,
        role,
      });
      alert("Account created! Please log in.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Sign Up – {role.charAt(0).toUpperCase() + role.slice(1)}</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />

          <div className="role-select">
            <label>
              <input type="radio" name="role" value="student" checked={role === "student"} onChange={() => setRole("student")} /> Student
            </label>
            <label style={{ marginLeft: "1rem" }}>
              <input type="radio" name="role" value="teacher" checked={role === "teacher"} onChange={() => setRole("teacher")} /> Teacher
            </label>
          </div>

          {error && <p className="error-message">{error}</p>}
          <button type="submit" disabled={loading}>{loading ? "Signing up…" : "Create Account"}</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;