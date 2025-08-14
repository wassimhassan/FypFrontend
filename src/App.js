import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./components/Signup.js";
import Login from "./components/Login";
import ResetPassword from "./components/ResetPassword.js";
import ChangePassword from "./components/ChangePassword.js";
import WelcomePage from "./components/WelcomePage";
import ProfileCard from "./components/ProfileCard.js";
import HomePage from "./components/HomePage.js";

import Admin from "./components/Admin.js";               // <-- acts as layout
import ReviewDashboard from "./components/ReviewDashboard.js";
import TeacherDashboard from "./components/TeacherDashboard.js";
import UserDashboard from "./components/UserDashboard.js";
import CourseDashboard from "./components/CourseDashboard.js";
import ScholarshipDashboard from "./components/ScholarshipDashboard.js";
import DashboardOverview from "./components/DashboardOverview.js";
import UniversityDashboard from "./components/UniversityDashboard.js";
import CareerDashboard from "./components/CareerDashboard.js";
import Teacher from "./components/Teacher.js"; // ✅ import the component
import "./components/Teacher.css";             // ✅ import the CSS



function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/welcomepage" element={<WelcomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProfileCard />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
       <Route path="/teacher" element={<Teacher />} />
        {/* Admin layout + nested dashboards */}. . 
        <Route path="/admin/*" element={<Admin />}>
        
          <Route index element={<DashboardOverview />} />
          <Route path="review" element={<ReviewDashboard />} />
          <Route path="teacher" element={<TeacherDashboard />} />
          <Route path="user" element={<UserDashboard />} />
          <Route path="course" element={<CourseDashboard />} />
          <Route path="scholarship" element={<ScholarshipDashboard />} />
          <Route path="university" element={<UniversityDashboard />} />
          <Route path="career" element={<CareerDashboard />} />
          <Route path="overview" element={<DashboardOverview />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
