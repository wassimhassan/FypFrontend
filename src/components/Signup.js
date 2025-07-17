import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';

export default function Signup() {
  const navigate = useNavigate();

  // ── form state ───────────────────────────────────────────────
  const [username, setUsername]         = useState('');
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);

  // ── submit handler ───────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/signup`,
        { username, email, password }
      );
      alert('Account created! Please log in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Try again.');
    }

    setLoading(false);
  };

  return (
    <div className="signup-container">
      <div className="signup-form-box">
        <h1>Sign up</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          {error && <p className="error-message">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Signing up…' : 'Signup'}
          </button>
        </form>

        <p>
          Already have an account?{' '}
          <Link
            to="/login"
            style={{ color: 'inherit', textDecoration: 'underline' }}
          >
            Login here
          </Link>
        </p>
      </div>

      <div className="signup-logo-box">
        <img src="/logo_fekra.jpeg" alt="Fekra logo" />
      </div>
    </div>
  );
}
