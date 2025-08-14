// Teacher.js
import React, { useEffect, useState } from "react";
import TeacherCourse from "./TeacherCourse";
import "./Teacher.css";
import axios from "axios";
import NavBar from "./NavBar";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Teacher() {
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // track when we're editing an existing course
  const [editingId, setEditingId] = useState(null);

  const [newCourse, setNewCourse] = useState({
    category: "",
    title: "",
    instructor: "",        // you can auto-fill from /auth-check if you like
    durationDays: "",
    level: "",
    price: "",             // "Free" or "$150"
    description: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    // fetch ONLY my courses
    axios
      .get(`${API}/courses/mine-created`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCourses(res.data))
      .catch(console.error);
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: value }));
  };

  // Add or Edit (PUT if editingId exists, POST otherwise)
  const handleAdd = async (e) => {
    e.preventDefault();
    // block submit if any field empty or duration < 1
const required = ["category","title","instructor","durationDays","level","price","description"];
for (const f of required) {
  if (!String(newCourse[f] ?? "").trim()) {
    alert(`Please fill the ${f} field.`);
    return;
  }
}
const d = Number(newCourse.durationDays);
if (!Number.isFinite(d) || d < 1) {
  alert("Duration must be a number ≥ 1 (days).");
  return;
}
    const payload = {
      ...newCourse,
      durationDays: d,
    };

    if (editingId) {
      // UPDATE
      const { data: updated } = await axios.put(
        `${API}/courses/${editingId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCourses((prev) => prev.map((c) => (c._id === editingId ? updated : c)));
    } else {
      // CREATE
      const { data: created } = await axios.post(`${API}/courses`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses((prev) => [created, ...prev]);
    }

    // reset form state
    setShowForm(false);
    setEditingId(null);
    setNewCourse({
      category: "",
      title: "",
      instructor: "",
      durationDays: "",
      level: "",
      price: "",
      description: "",
    });
  };

  // open modal pre-filled for edit
  const openEdit = (course) => {
    setNewCourse({
      category: course.category || "",
      title: course.title || "",
      instructor: course.instructor || "",
      durationDays: course.durationDays || "",
      level: course.level || "",
      price: course.price || "",
      description: course.description || "",
    });
    setEditingId(course._id);
    setShowForm(true);
  };

  return (
    <>
    <NavBar />
    <div className="dashboard">
      <div className="top-center">
        <button
          className="add-course-btn"
          onClick={() => {
            // ensure we're in "add" mode and clear form
            setEditingId(null);
            setNewCourse({
              category: "",
              title: "",
              instructor: "",
              durationDays: "",
              level: "",
              price: "",
              description: "",
            });
            setShowForm(true);
          }}
        >
          +
        </button>
      </div>

      <main className="courses-container">
        {courses.map((course) => (
          <TeacherCourse
            key={course._id}
            course={course}
            onEdit={() => openEdit(course)} // ✅ now opens the edit form
            onDelete={async () => {
              // ✅ ask before deleting
              const ok = window.confirm(`Delete “${course.title}”?`);
              if (!ok) return;
              await axios.delete(`${API}/courses/${course._id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              setCourses((prev) => prev.filter((c) => c._id !== course._id));
            }}
          />
        ))}
      </main>

      {showForm && (
        <div className="modal">
          <form className="course-form" onSubmit={handleAdd}>
            <h2>Add New Course</h2>

            <input
              name="category"
              required
              placeholder="Category"
              value={newCourse.category}
              onChange={handleChange}
            />
            <input
              name="title"
              required
              placeholder="Title"
              value={newCourse.title}
              onChange={handleChange}
            />
            <input
              name="instructor"
              required
              placeholder="Instructor"
              value={newCourse.instructor}
              onChange={handleChange}
            />
            <input
              name="durationDays"
              placeholder="Duration (days)"
              type="number"
              min="1"
              step="1"
              required
              value={newCourse.durationDays}
              onChange={handleChange}
            />
            <input
              name="level"
              required
              placeholder="Level (Beginner/Intermediate/Advanced)"
              value={newCourse.level}
              onChange={handleChange}
            />
            <input
              name="price"
              required
              placeholder="Price (Free or $...)"
              value={newCourse.price}
              onChange={handleChange}
            />
            <textarea
            required
              name="description"
              placeholder="Short description"
              value={newCourse.description}
              onChange={handleChange}
            />

            <div className="form-buttons">
              <button type="submit">Add</button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
    </>
  );
}
