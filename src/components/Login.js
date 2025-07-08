import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

export default function Login() {
  return (
    <div className="Login-container">
      <div className="Login-logo-box">
        <img src="/logo_fekra.jpeg" alt="Fekra logo" />
      </div>
      <div className="Login-form-box">
        <h1>Login</h1>
        <form>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button type="submit">Login</button>
        </form>
        <div className="Login-data">
          <p>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'inherit', textDecoration: 'underline', cursor: 'pointer' }}>
              Create one here
            </Link>
          </p>
          <p>Forget Password</p>
        </div>
      </div>
    </div>
  );
}
