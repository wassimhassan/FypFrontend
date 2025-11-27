import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CoursesPage.css";
import NavBar from "./NavBar";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [pending, setPending] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get(`${API}/courses/my`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCourses(res.data))
      .catch(console.error);

    axios
      .get(`${API}/courses/my/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPending(res.data))
      .catch(console.error);
  }, []);

  return (
  <>
    <NavBar />
    {/* Toasts */}
    <ToastContainer position="top-right" autoClose={2000} />

    <div className="courses-page">
      <div className="courses-inner">
        {/* -------- My Courses -------- */}
        <section className="courses-section">
          <h2>My Courses</h2>

          {courses.length === 0 ? (
            <div className="empty-card">
              <p>You haven’t registered for any course yet.</p>
            </div>
          ) : (
            <ul className="card-grid">
              {courses.map((course) => (
                <li
                  key={course._id}
                  className="course-card enrolled-card"
                  onClick={() => navigate(`/courses/${course._id}`)}
                >
                  <div className="course-card-top">
                    <span className="badge enrolled">Enrolled</span>
                  </div>

                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-subtitle">Click to view course details</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* -------- Pending Requests -------- */}
        <section className="courses-section">
          <h2>Pending Requests</h2>

          {pending.length === 0 ? (
            <div className="empty-card">
              <p>No pending requests.</p>
            </div>
          ) : (
            <ul className="card-grid">
              {pending.map((course) => (
                <li key={course._id} className="course-card pending-card">
                  <div className="course-card-top">
                    <span className="badge pending">Pending Approval</span>
                  </div>

                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-subtitle">
                    Waiting for instructor or admin approval.
                  </p>

                  <div className="pending-row">
                    <button
                      className="btn-cancel btn-danger"
                      onClick={async () => {
                        try {
                          setPending((prev) =>
                            prev.map((c) =>
                              c._id === course._id
                                ? { ...c, __loading: true }
                                : c
                            )
                          );
                          const token = localStorage.getItem("token");
                          await axios.delete(
                            `${API}/courses/${course._id}/pending`,
                            { headers: { Authorization: `Bearer ${token}` } }
                          );
                          setPending((prev) =>
                            prev.filter((c) => c._id !== course._id)
                          );
                          toast.success("Request cancelled.");
                        } catch (e) {
                          console.error(e);
                          setPending((prev) =>
                            prev.map((c) =>
                              c._id === course._id
                                ? { ...c, __loading: false }
                                : c
                            )
                          );
                          toast.error("Failed to cancel. Try again.");
                        }
                      }}
                      disabled={course.__loading}
                    >
                      {course.__loading ? "Cancelling..." : "Cancel request"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  </>
);

}
