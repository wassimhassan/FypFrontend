"use client"

// src/pages/Login.jsx   (or wherever you keep it)

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import "./Login.css"

export default function Login({ setIsLoggingIn = () => {} }) {
  /* ───── hooks ─────────────────────────────────────────────── */
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // forgot-password modal
  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail] = useState("")
  const [resetMsg, setResetMsg] = useState("")

  /* ───── mount/unmount side-effect ─────────────────────────── */
  useEffect(() => {
    setIsLoggingIn(true)
    return () => setIsLoggingIn(false)
  }, [setIsLoggingIn])

  /* ───── helpers ───────────────────────────────────────────── */
  const roleDest = {
    student: "/student",
    teacher: "/teacher",
    admin: "/admin",
  }

  /* ───── handlers ──────────────────────────────────────────── */
  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      localStorage.clear()

      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, { email, password })

      const { token } = res.data
      localStorage.setItem("token", token)

      // decode once instead of trusting backend blindly
      const { role, id: userId } = jwtDecode(token)
      localStorage.setItem("role", role)
      localStorage.setItem("userId", userId)

      navigate(roleDest[role] || "/")
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.")
      setForgotEmail(email)
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    setResetMsg("")
    setError("")
    setLoading(true)
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/reset-password`, { email: forgotEmail })
      setResetMsg("If that e-mail exists, a reset link was sent.")
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link.")
    } finally {
      setLoading(false)
    }
  }

  /* ───── UI ───────────────────────────────────────────────── */
  return (
    <div className="Login-container">
      <div className="Login-logo-box">
        <img src="/logo_fekra.jpeg" alt="Fekra logo" />
      </div>

      <div className="Login-form-box">
        <h1>Login</h1>

        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

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
              setForgotEmail(email)
              setShowForgot(true)
            }}
          >
            Forgot password?
          </p>
        </div>
      </div>

      {/* ── Reset-password modal ─────────────────────────────── */}
      {showForgot && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Reset Password</h3>
            <p>Enter your e-mail to receive a reset link:</p>

            <input
              type="email"
              placeholder="Enter your e-mail"
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
  )
}
