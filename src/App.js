import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./components/SignUp.js";
import Login from "./components/Login.js";
import ResetPassword from "./components/ResetPassword.js";
import ChangePassword from "./components/ChangePassword.js";
import WelcomePage from "./components/WelcomePage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;