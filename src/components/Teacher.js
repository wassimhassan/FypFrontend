import React, { useState } from "react";
import TeacherCourse from "./TeacherCourse";
import "./Teacher.css";

export default function Teacher() {
  const [courses, setCourses] = useState([
    {
      type: "Test Prep",
      title: "SAT Preparation Course",
      instructor: "Dr. Ahmed Hassan",
      duration: "8 weeks",
      students: "3,247",
      rating: 4.9,
      level: "Advanced",
      price: "Free",
    },
    {
      type: "Language",
      title: "TOEFL Training Program",
      instructor: "Sarah Mitchell",
      duration: "6 weeks",
      students: "2,156",
      rating: 4.8,
      level: "Intermediate",
      price: "$150",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    type: "",
    title: "",
    instructor: "",
    duration: "",
    students: "",
    rating: "",
    level: "",
    price: "",
  });

  const [editIndex, setEditIndex] = useState(null); // track course being edited

  const handleChange = (e) => {
    setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
  };

  const handleAddOrEditCourse = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      // Update existing course
      const updatedCourses = [...courses];
      updatedCourses[editIndex] = newCourse;
      setCourses(updatedCourses);
    } else {
      // Add new course
      setCourses([...courses, newCourse]);
    }
    // Reset form
    setNewCourse({
      type: "",
      title: "",
      instructor: "",
      duration: "",
      students: "",
      rating: "",
      level: "",
      price: "",
    });
    setEditIndex(null);
    setShowForm(false);
  };

  const handleDelete = (index) => {
    const updatedCourses = courses.filter((_, i) => i !== index);
    setCourses(updatedCourses);
  };

  const handleEdit = (index) => {
    setNewCourse(courses[index]); // pre-fill form
    setEditIndex(index);
    setShowForm(true);
  };

  return (
    <div className="dashboard">
      {/* + Button */}
      <div className="top-center">
        <button
          className="add-course-btn"
          onClick={() => {
            setNewCourse({
              type: "",
              title: "",
              instructor: "",
              duration: "",
              students: "",
              rating: "",
              level: "",
              price: "",
            }); // reset form
            setEditIndex(null); // set Add mode
            setShowForm(true);
          }}
        >
          +
        </button>
      </div>

      {/* Courses */}
      <main className="courses-container">
        {courses.map((course, index) => (
          <TeacherCourse
            key={index}
            course={course}
            onEdit={() => handleEdit(index)}
            onDelete={() => handleDelete(index)}
          />
        ))}
      </main>

      {/* Modal Form */}
      {showForm && (
        <div className="modal">
          <form className="course-form" onSubmit={handleAddOrEditCourse}>
            <h2>{editIndex !== null ? "Edit Course" : "Add New Course"}</h2>
            <input
              name="type"
              placeholder="Type"
              value={newCourse.type}
              onChange={handleChange}
            />
            <input
              name="title"
              placeholder="Title"
              value={newCourse.title}
              onChange={handleChange}
            />
            <input
              name="instructor"
              placeholder="Instructor"
              value={newCourse.instructor}
              onChange={handleChange}
            />
            <input
              name="duration"
              placeholder="Duration"
              value={newCourse.duration}
              onChange={handleChange}
            />
            <input
              name="students"
              placeholder="Students"
              value={newCourse.students}
              onChange={handleChange}
            />
            <input
              name="rating"
              placeholder="Rating"
              value={newCourse.rating}
              onChange={handleChange}
            />
            <input
              name="level"
              placeholder="Level"
              value={newCourse.level}
              onChange={handleChange}
            />
            <input
              name="price"
              placeholder="Price"
              value={newCourse.price}
              onChange={handleChange}
            />
            <div className="form-buttons">
              <button type="submit">
                {editIndex !== null ? "Save Changes" : "Add"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditIndex(null);
                  setNewCourse({
                    type: "",
                    title: "",
                    instructor: "",
                    duration: "",
                    students: "",
                    rating: "",
                    level: "",
                    price: "",
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
