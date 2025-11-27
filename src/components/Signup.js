import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import "./Signup.css"

import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import eyeOpen from "../assets/eye.png"
import eyeClosed from "../assets/eyebrow.png"

export default function Signup() {
  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/signup`, { username, email, password })
      toast.success("Account created! Please log in.")
      navigate("/login")
    } catch (err) {
      const msg = err.response?.data?.message || "Signup failed. Try again."
      setError(msg)
      toast.error(msg)
    }

    setLoading(false)
  }

  return (
    <div className="signup-container">
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="signup-form-box">
        <h1>Sign up</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* PASSWORD FIELD WITH TOGGLE */}
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <img
              src={showPassword ? eyeClosed : eyeOpen}
              alt="toggle password"
              className="password-eye"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Signing up…" : "Signup"}
          </button>
        </form>

        <p>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "inherit", textDecoration: "underline" }}>
            Login here
          </Link>
        </p>
      </div>

      <div className="signup-logo-box">
        <img src="/logo_fekra.jpeg" alt="Fekra logo" />
      </div>
    </div>
  )
}
