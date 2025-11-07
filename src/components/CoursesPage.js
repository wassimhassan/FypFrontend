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
        <h2>My Courses</h2>
        {courses.length === 0 ? (
          <p>No registered courses yet.</p>
        ) : (
          <ul>
            {courses.map((course) => (
              <li
                key={course._id}
                onClick={() => navigate(`/courses/${course._id}`)}
              >
                {course.title}
              </li>
            ))}
          </ul>
        )}
        <h2 style={{ marginTop: "40px" }}>Pending Requests</h2>
        {pending.length === 0 ? (
          <p className="Empty-State">No pending requests.</p>
        ) : (
          <ul>
            {pending.map((course) => (
              <li key={course._id}>
                <div>{course.title}</div>
                <div className="pending-row">
                  <span className="badge">Pending Approval</span>
                  <button
                    className="btn-cancel btn-danger"
                    onClick={async () => {
                      try {
                        // optimistic UI: mark as loading
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
                        // remove from list
                        setPending((prev) =>
                          prev.filter((c) => c._id !== course._id)
                        );
                      } catch (e) {
                        console.error(e);
                        // revert loading state
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
      </div>
    </>
  );
}
