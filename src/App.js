import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./components/Signup.js"; // ✅ Your version
import Login from "./components/Login";
//import ResetPassword from "./components/ResetPassword.js";
//import ChangePassword from "./components/ChangePassword.js";
import WelcomePage from "./components/WelcomePage";
import ProfileCard from "./components/ProfileCard.js";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProfileCard /> } />
  <Route path="/" element={<WelcomePage />} />
  <Route path="/" element={<WelcomePage />} />
        {/* Fallback – unknown path */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;