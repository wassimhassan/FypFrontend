import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Signup from "./components/Signup.js";
import Login from "./components/Login";
import ResetPassword from "./components/ResetPassword.js";
import ChangePassword from "./components/ChangePassword.js";
import WelcomePage from "./components/WelcomePage";
import ProfileCard from "./components/ProfileCard.js";
import HomePage from "./components/HomePage.js";
import ManageCourse from "./components/ManageCourse.js";
import CoursesPage from "./components/CoursesPage";
import CourseView from "./components/CourseView.js";
import CalendarPage from "./components/CalendarPage";
import Admin from "./components/Admin.js";               // <-- acts as layout
import ReviewDashboard from "./components/ReviewDashboard.js";
import TeacherDashboard from "./components/TeacherDashboard.js";
import UserDashboard from "./components/UserDashboard.js";
import CourseDashboard from "./components/CourseDashboard.js";
import ScholarshipDashboard from "./components/ScholarshipDashboard.js";
import DashboardOverview from "./components/DashboardOverview.js";
import UniversityDashboard from "./components/UniversityDashboard.js";
import CareerDashboard from "./components/CareerDashboard.js";
import Teacher from "./components/Teacher.js"; 
import "./components/Teacher.css";            
import Chatbot from "./components/Chatbot.js";
import CareersTab from "./components/CareersTab.js";
import ProtectedRoute from "./components/ProtectedRoutes.js";
import ScholarshipDetailsModal from "./components/ScholarshipDetailsModal.js";
import CareerDetails from "./components/CareerDetails.js";
import EventDashboard from "./components/EventDashboard.js";
import AboutPage from "./components/AboutPage";


function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes (anyone) */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/welcomepage" element={<WelcomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProfileCard />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />

        <Route path="/teacherHomePage" element={<Teacher />} />
        <Route path="/teacherHomePage/courses/:courseId/manage" element={<ManageCourse />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:courseId" element={<CourseView />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/careers" element={<CareersTab />} />
   <Route path="/career-details" element={<CareerDetails />} />
<Route path="/about" element={<AboutPage />} />

        {/* Admin layout + nested dashboards */}. . 
        <Route path="/admin/*" element={<Admin />}/>
        

        <Route path="chatbot" element={<Chatbot />} />
        <Route path="/calendar" element={<CalendarPage />} />

        {/* Student or Admin only */}
        <Route
          path="/homepage"
          element={
            <ProtectedRoute allowedRoles={["student", "admin"]}>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <ProtectedRoute allowedRoles={["student", "admin"]}>
              <CoursesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:courseId"
          element={
            <ProtectedRoute allowedRoles={["student", "admin"]}>
              <CourseView />
            </ProtectedRoute>
          }
        />

        {/* Teacher or Admin only */}
        <Route
          path="/teacherHomePage"
          element={
            <ProtectedRoute allowedRoles={["teacher", "admin"]}>
              <Teacher />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacherHomePage/courses/:courseId/manage"
          element={
            <ProtectedRoute allowedRoles={["teacher", "admin"]}>
              <ManageCourse />
            </ProtectedRoute>
          }
        />

        {/* Admin only (wrap the layout) */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Admin />
            </ProtectedRoute>
          }
        >

          <Route index element={<DashboardOverview />} />
          <Route path="review" element={<ReviewDashboard />} />
          <Route path="teacher" element={<TeacherDashboard />} />
          <Route path="user" element={<UserDashboard />} />
          <Route path="course" element={<CourseDashboard />} />
          <Route path="scholarship" element={<ScholarshipDashboard />} />
          <Route path="university" element={<UniversityDashboard />} />
          <Route path="career" element={<CareerDashboard />} />
          <Route path="event" element={<EventDashboard />} />
          <Route path="overview" element={<DashboardOverview />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
