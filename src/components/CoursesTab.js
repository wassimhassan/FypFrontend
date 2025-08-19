import React, { useEffect, useState } from 'react';
import './CoursesTab.css';
import TeacherCourse from '../components/TeacherCourse';
import ViewEnrollModal from '../components/ViewEnrollModal'; // ⬅️ add this
import axios from 'axios';

export default function CoursesTab() {
  const [courses, setCourses] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState("");

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const fetchCourses = async () => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/courses`);
    setCourses(res.data);
  } catch (error) {
    console.error("Error fetching courses:", error);
  }
};
useEffect(() => {
  fetchCourses();
}, []);

 const openModal = (course) => {
    setSelected(course);
    setEnrollError("");
    setOpen(true);
  };
  const closeModal = () => {
    setOpen(false);
    setSelected(null);
    setEnrollError("");
    setEnrolling(false);
  };

  const handleEnroll = async (course) => {
    try {
      setEnrollError("");
      setEnrolling(true);

      const token = localStorage.getItem("token");
      if (!token) {
        setEnrollError("You need to log in to enroll.");
        setEnrolling(false);
        return;
      }

      await axios.post(`${API}/courses/${course._id}/enroll`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Refresh data so enrolled count updates
      await fetchCourses();

      setEnrolling(false);
      setOpen(false);
      // optional: toast
      alert(`Enrolled in: ${course.title}`);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        (err?.response?.status === 401
          ? "Unauthorized. Please log in again."
          : "Failed to enroll. Please try again.");
      setEnrollError(msg);
      setEnrolling(false);
    }
  };

  return (
    <section className="tab-content">
      <h2>Available Courses</h2>
      <p>Explore our featured courses to boost your skills.</p>
      <div className="card-row">
        {courses.map((course) => (
          <TeacherCourse
          key={course._id}
          course={course}
          buttonLabel="View / Enroll"
          onAction={() => openModal(course)}  // ⬅️ opens the modal
          />
        ))}
      </div>
      <ViewEnrollModal
        open={open}
        course={selected}
        onClose={closeModal}
        onEnroll={handleEnroll}
        loading={enrolling}
        error={enrollError}
      />
    </section>
  );
}
