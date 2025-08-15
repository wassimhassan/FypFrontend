import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(`${API}/courses/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setCourses(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="courses-page">
      <h2>My Courses</h2>
      {courses.length === 0 ? (
        <p>No registered courses yet.</p>
      ) : (
        <ul>
          {courses.map(course => (
            <li
              key={course._id}
              style={{ cursor: "pointer", color: "blue" }}
              onClick={() => navigate(`/courses/${course._id}`)}
            >
              {course.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
