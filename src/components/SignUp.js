import React from 'react';
import { Link } from 'react-router-dom';
import './Signup.css';

export default function SignUp() {
  return (
    <div className="signup-container">
      <div className="signup-form-box">
        <h1>Sign up</h1>
        <form>
          <input type="text" placeholder="username" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button type="submit">signup</button>
        </form>
        <p>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'inherit', textDecoration: 'underline', cursor: 'pointer' }}>
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
